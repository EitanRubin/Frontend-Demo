  import { createClient } from 'npm:@supabase/supabase-js@2';
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey, X-Kerberos-Auth, X-Kerberos-Principal, X-Kerberos-Realm, X-Auth-Provider, X-Auth-Email, X-Bearer-Token',
  };
  
  interface AuthUser {
    role: string;
    email: string;
    name: string;
  }
  
  function parseAuthToken(authHeader: string | null): AuthUser | null {
    if (!authHeader || !authHeader.startsWith('Negotiate ')) {
      return null;
    }
  
    return {
      role: 'support',
      email: 'support@store.com',
      name: 'Support User',
    };
  }
  
  Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }
  
    try {
      const user = parseAuthToken(req.headers.get('Authorization'));
  
      if (!user || user.role !== 'support') {
        return new Response(
          JSON.stringify({ error: 'Unauthorized - Support access required' }),
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
  
      // GET /support-api/tickets - List all tickets
      if (method === 'GET' && pathParts.length === 2 && pathParts[1] === 'tickets') {
        const status = url.searchParams.get('status');
        
        let query = supabase
          .from('tickets')
          .select('*')
          .order('created_at', { ascending: false });
  
        if (status && status !== 'all') {
          query = query.eq('status', status);
        }
  
        const { data, error } = await query;
        if (error) throw error;
  
        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
  
      // GET /support-api/tickets/:id - Get single ticket with messages
      if (method === 'GET' && pathParts.length === 3 && pathParts[1] === 'tickets') {
        const id = pathParts[2];
        
        const { data: ticket, error: ticketError } = await supabase
          .from('tickets')
          .select('*')
          .eq('id', id)
          .maybeSingle();
  
        if (ticketError) throw ticketError;
        if (!ticket) {
          return new Response(
            JSON.stringify({ error: 'Ticket not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
  
        const { data: messages, error: messagesError } = await supabase
          .from('ticket_messages')
          .select('*')
          .eq('ticket_id', id)
          .order('created_at', { ascending: true });
  
        if (messagesError) throw messagesError;
  
        return new Response(
          JSON.stringify({ ...ticket, messages: messages || [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
  
      // PUT /support-api/tickets/:id/status - Update ticket status
      if (method === 'PUT' && pathParts.length === 4 && pathParts[1] === 'tickets' && pathParts[3] === 'status') {
        const id = pathParts[2];
        const body = await req.json();
        const { status } = body;
  
        if (!status || !['open', 'in_progress', 'closed'].includes(status)) {
          return new Response(
            JSON.stringify({ error: 'Invalid status. Must be: open, in_progress, or closed' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
  
        const { data, error } = await supabase
          .from('tickets')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
  
        if (error) throw error;
  
        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
  
      // POST /support-api/tickets/:id/messages - Add message to ticket
      if (method === 'POST' && pathParts.length === 4 && pathParts[1] === 'tickets' && pathParts[3] === 'messages') {
        const ticketId = pathParts[2];
        const body = await req.json();
        const { message } = body;
  
        if (!message) {
          return new Response(
            JSON.stringify({ error: 'Message is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
  
        const { data, error } = await supabase
          .from('ticket_messages')
          .insert({
            ticket_id: ticketId,
            message,
            sender_type: 'support',
            sender_name: user.name,
          })
          .select()
          .single();
  
        if (error) throw error;
  
        await supabase
          .from('tickets')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', ticketId);
  
        return new Response(
          JSON.stringify(data),
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
