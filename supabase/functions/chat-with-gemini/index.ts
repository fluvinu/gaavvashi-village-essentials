import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface RequestPayload {
  message: string;
}

interface Product {
  idx: number;
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  category: string;
  in_stock: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

interface Profile {
  idx: number;
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address: any;
  created_at: string;
  updated_at: string;
}

interface Order {
  idx: number;
  id: string;
  user_id: string;
  total_amount: string;
  payment_id: string;
  status: string;
  shipping_address: any;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  idx: number;
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: string;
  created_at: string;
}

Deno.serve(async (req: Request) => {
  console.log('=== Chat function started ===');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user message
    const { message }: RequestPayload = await req.json();
    console.log('Processing message:', message);

    if (!message || typeof message !== 'string') {
      throw new Error('Valid message is required');
    }

    // Query relevant products from database
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    // Query profiles data
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('Profiles query error:', profilesError);
    }

    // Query orders data
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Orders query error:', ordersError);
    }

    // Query order items data
    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (orderItemsError) {
      console.error('Order items query error:', orderItemsError);
    }

    // Prepare context for AI
    const dbContext = `
You are a helpful assistant for an organic products store. You have access to the complete business database including products, customer profiles, orders, and order items. Here's the current data:

PRODUCTS INVENTORY:
${products?.map((product: Product) => `
- ${product.name} (ID: ${product.id})
  Category: ${product.category}
  Price: ₹${product.price}
  Description: ${product.description}
  In Stock: ${product.in_stock ? 'Yes' : 'No'}
  Stock Quantity: ${product.stock_quantity}
`).join('\n')}

${profiles && profiles.length > 0 ? `
CUSTOMER PROFILES:
${profiles.map((profile: Profile) => `
- ${profile.full_name} (User ID: ${profile.user_id})
  Phone: ${profile.phone || 'Not provided'}
  Address: ${profile.address ? JSON.stringify(profile.address) : 'Not provided'}
  Member since: ${new Date(profile.created_at).toLocaleDateString()}
`).join('\n')}
` : ''}

${orders && orders.length > 0 ? `
ORDERS:
${orders.map((order: Order) => `
- Order ID: ${order.id}
  Customer: ${order.user_id}
  Total: ₹${order.total_amount}
  Status: ${order.status}
  Payment: ${order.payment_id}
  Shipping Address: ${order.shipping_address ? JSON.stringify(order.shipping_address) : 'Not provided'}
  Order Date: ${new Date(order.created_at).toLocaleDateString()}
`).join('\n')}
` : ''}

${orderItems && orderItems.length > 0 ? `
ORDER ITEMS:
${orderItems.map((item: OrderItem) => `
- Order: ${item.order_id}
  Product: ${item.product_id}
  Quantity: ${item.quantity}
  Price: ₹${item.price}
  Date: ${new Date(item.created_at).toLocaleDateString()}
`).join('\n')}
` : ''}

Please respond naturally and helpfully to questions about products, customers, orders, sales analytics, inventory management, or any business-related queries. Be conversational and provide specific information with relevant data from the database.
`;

    // Get API key
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey || geminiApiKey.trim() === '') {
      const errorMsg = 'GEMINI_API_KEY is not properly configured in Supabase secrets';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }

    console.log('Calling Gemini API...');

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: dbContext },
                { text: `User question: ${message}` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Failed to get response from Gemini API: ${geminiResponse.status} ${geminiResponse.statusText}`);
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini response received');
    
    const aiResponse = geminiData.candidates[0]?.content?.parts[0]?.text || 
      "I'm sorry, I couldn't process your request at the moment.";

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in chat-with-gemini function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        response: "I'm sorry, I'm having trouble accessing the database right now. Please try again later."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});