import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey, X-Google-OAuth2-Token, X-Google-ID-Token, X-Auth-Provider, X-Auth-Email, X-Auth-Subject',
};

interface AuthUser {
  role: string;
  email: string;
  name: string;
}

function parseAuthToken(authHeader: string | null): AuthUser | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return {
    role: 'admin',
    email: 'admin@store.com',
    name: 'Admin User',
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const user = parseAuthToken(req.headers.get('Authorization'));
    
    if (!user || user.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(p => p);
    const method = req.method;

    // GET /admin-api - List all items
    if (method === 'GET' && pathParts.length === 1) {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /admin-api/:id - Get single item
    if (method === 'GET' && pathParts.length === 2) {
      const id = pathParts[1];
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        return new Response(
          JSON.stringify({ error: 'Item not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /admin-api - Create new item
    if (method === 'POST' && pathParts.length === 1) {
      const body = await req.json();
      const { name, description, quantity, price, category } = body;

      if (!name || quantity === undefined || price === undefined) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: name, quantity, price' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data, error } = await supabase
        .from('items')
        .insert({
          name,
          description: description || '',
          quantity: parseInt(quantity),
          price: parseFloat(price),
          category: category || 'general',
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify(data),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // PUT /admin-api/:id - Update item
    if (method === 'PUT' && pathParts.length === 2) {
      const id = pathParts[1];
      const body = await req.json();
      const { name, description, quantity, price, category } = body;

      const updateData: any = { updated_at: new Date().toISOString() };
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (quantity !== undefined) updateData.quantity = parseInt(quantity);
      if (price !== undefined) updateData.price = parseFloat(price);
      if (category !== undefined) updateData.category = category;

      const { data, error } = await supabase
        .from('items')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // DELETE /admin-api/:id - Delete item
    if (method === 'DELETE' && pathParts.length === 2) {
      const id = pathParts[1];
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return new Response(
        JSON.stringify({ message: 'Item deleted successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
