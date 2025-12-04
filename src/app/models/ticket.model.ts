export interface Ticket {
  id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  created_at: string;
  updated_at: string;
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  message: string;
  sender_type: 'customer' | 'support';
  sender_name: string;
  created_at: string;
}
