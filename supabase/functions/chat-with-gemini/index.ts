import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, isAuthenticated } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    console.log('Processing chat message:', message);

    let systemPrompt = `You are a helpful AI assistant for a village products e-commerce store. You can help with general questions about products and shopping.`;
    let orderData = null;
    let productData = null;
    
    if (isAuthenticated && userId) {
      systemPrompt += ` The user is logged in with ID: ${userId}. You can help them with:
      1. Track their orders - say "show my orders" or "track order"
      2. Cancel orders - say "cancel order [order_id]" 
      3. View products - ask about available products
      4. View order history
      
      When they ask about orders, you have access to their real order data. For order operations, provide clear instructions and confirmations.
      
      IMPORTANT COMMANDS:
      - If user asks to see/track orders, respond with "FETCH_ORDERS"
      - If user asks to cancel an order, respond with "CANCEL_ORDER:[order_id]"
      - If user asks about products, respond with "FETCH_PRODUCTS"`;
      
      // Pre-fetch user's orders and products for context
      try {
        const { data: orders } = await supabase
          .from('orders')
          .select(`
            *,
            order_items(
              *,
              products(name, price)
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        const { data: products } = await supabase
          .from('products')
          .select('*')
          .eq('in_stock', true)
          .limit(10);
          
        orderData = orders;
        productData = products;
        
        if (orders && orders.length > 0) {
          systemPrompt += `\n\nUser's Recent Orders:\n${JSON.stringify(orders, null, 2)}`;
        }
        
        if (products && products.length > 0) {
          systemPrompt += `\n\nAvailable Products:\n${JSON.stringify(products, null, 2)}`;
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } else {
      systemPrompt += ` The user is not logged in. For order-related queries, politely inform them they need to login first to access order features.`;
    }

    // Check if this is a special command
    const commandResponse = await handleSpecialCommands(message, userId, supabase);
    if (commandResponse) {
      return new Response(JSON.stringify({ response: commandResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser message: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${geminiResponse.status} ${geminiResponse.statusText}`);
    }

    const data = await geminiResponse.json();
    console.log('Gemini response received');

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ response: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-gemini function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Handle special chatbot commands
async function handleSpecialCommands(message: string, userId: string | null, supabase: any) {
  if (!userId) return null;
  
  const lowerMessage = message.toLowerCase();
  
  // Fetch user orders
  if (lowerMessage.includes('show') && (lowerMessage.includes('order') || lowerMessage.includes('track'))) {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          products(name, price)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      return 'Sorry, I couldn\'t fetch your orders right now. Please try again.';
    }
    
    if (!orders || orders.length === 0) {
      return 'You don\'t have any orders yet. Would you like to browse our products?';
    }
    
    let response = `Here are your recent orders:\n\n`;
    orders.forEach((order: any, index: number) => {
      response += `${index + 1}. Order #${order.id.slice(0, 8)}\n`;
      response += `   Status: ${order.status}\n`;
      response += `   Total: ₹${order.total_amount}\n`;
      response += `   Date: ${new Date(order.created_at).toLocaleDateString()}\n`;
      if (order.order_items && order.order_items.length > 0) {
        response += `   Items:\n`;
        order.order_items.forEach((item: any) => {
          response += `   - ${item.products?.name} (Qty: ${item.quantity}) - ₹${item.price}\n`;
        });
      }
      response += `\n`;
    });
    
    response += `To cancel an order, just say "cancel order" followed by the order ID.`;
    return response;
  }
  
  // Cancel order
  if (lowerMessage.includes('cancel') && lowerMessage.includes('order')) {
    // Extract order ID from message
    const orderIdMatch = message.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i);
    if (!orderIdMatch) {
      return 'Please specify the order ID you want to cancel. You can find it in your order list.';
    }
    
    const orderId = orderIdMatch[0];
    
    // Get the order with items
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          products(id, name, stock_quantity)
        )
      `)
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();
    
    if (fetchError || !order) {
      return 'Order not found or you don\'t have permission to cancel this order.';
    }
    
    if (order.status === 'cancelled') {
      return 'This order is already cancelled.';
    }
    
    if (order.status === 'delivered') {
      return 'Sorry, delivered orders cannot be cancelled.';
    }
    
    // Cancel the order
    const { error: cancelError } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', orderId);
    
    if (cancelError) {
      return 'Sorry, I couldn\'t cancel your order right now. Please try again.';
    }
    
    // Restore stock quantities
    if (order.order_items) {
      for (const item of order.order_items) {
        if (item.products) {
          const newStockQuantity = item.products.stock_quantity + item.quantity;
          await supabase
            .from('products')
            .update({ 
              stock_quantity: newStockQuantity,
              in_stock: newStockQuantity > 0 
            })
            .eq('id', item.products.id);
        }
      }
    }
    
    return `✅ Order #${orderId.slice(0, 8)} has been successfully cancelled and stock has been restored. You should receive a refund within 3-5 business days.`;
  }
  
  // Show products
  if (lowerMessage.includes('product') || lowerMessage.includes('buy') || lowerMessage.includes('shop')) {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .limit(8);
    
    if (error || !products || products.length === 0) {
      return 'Sorry, no products are available right now.';
    }
    
    let response = `🛒 Here are our available products:\n\n`;
    products.forEach((product: any, index: number) => {
      response += `${index + 1}. ${product.name}\n`;
      response += `   Price: ₹${product.price}\n`;
      response += `   Category: ${product.category}\n`;
      response += `   Stock: ${product.stock_quantity} units\n`;
      if (product.description) {
        response += `   ${product.description.slice(0, 60)}...\n`;
      }
      response += `\n`;
    });
    
    response += `To place an order, please visit our main website and add items to your cart!`;
    return response;
  }
  
  return null;
}