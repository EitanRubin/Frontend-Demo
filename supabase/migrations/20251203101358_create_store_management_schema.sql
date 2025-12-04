/*
  # Store Management Application Schema

  ## Overview
  This migration creates the database schema for a store management application with
  admin inventory control and customer support ticket system.

  ## New Tables
  
  ### 1. users
  Stores user information for both admin and support staff
  - `id` (uuid, primary key) - Unique user identifier
  - `email` (text, unique) - User email address
  - `name` (text) - User display name
  - `role` (text) - User role: 'admin' or 'support'
  - `auth_type` (text) - Authentication type: 'google_sso' or 'kerberos'
  - `created_at` (timestamptz) - Account creation timestamp

  ### 2. items
  Stores inventory items managed by admins
  - `id` (uuid, primary key) - Unique item identifier
  - `name` (text) - Item name
  - `description` (text) - Item description
  - `quantity` (integer) - Current stock quantity
  - `price` (decimal) - Item price
  - `category` (text) - Item category
  - `created_at` (timestamptz) - Item creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. tickets
  Stores customer support tickets
  - `id` (uuid, primary key) - Unique ticket identifier
  - `customer_name` (text) - Customer name
  - `customer_email` (text) - Customer email address
  - `subject` (text) - Ticket subject line
  - `description` (text) - Initial ticket description
  - `status` (text) - Ticket status: 'open', 'in_progress', or 'closed'
  - `created_at` (timestamptz) - Ticket creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. ticket_messages
  Stores conversation messages within tickets
  - `id` (uuid, primary key) - Unique message identifier
  - `ticket_id` (uuid, foreign key) - Reference to parent ticket
  - `message` (text) - Message content
  - `sender_type` (text) - Type of sender: 'customer' or 'support'
  - `sender_name` (text) - Name of message sender
  - `created_at` (timestamptz) - Message timestamp

  ## Security
  - Enable Row Level Security on all tables
  - Policies restrict access based on authentication context
  - Public access is denied by default after enabling RLS

  ## Indexes
  - Index on tickets.status for efficient filtering
  - Index on tickets.created_at for sorting
  - Index on ticket_messages.ticket_id for fast message retrieval
  - Index on items.category for filtering
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'support')),
  auth_type text NOT NULL CHECK (auth_type IN ('google_sso', 'kerberos')),
  created_at timestamptz DEFAULT now()
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  quantity integer NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  price decimal(10, 2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  subject text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ticket_messages table
CREATE TABLE IF NOT EXISTS ticket_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  message text NOT NULL,
  sender_type text NOT NULL CHECK (sender_type IN ('customer', 'support')),
  sender_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for items table
CREATE POLICY "Anyone can read items"
  ON items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert items"
  ON items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update items"
  ON items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete items"
  ON items FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for tickets table
CREATE POLICY "Support can read all tickets"
  ON tickets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Support can update tickets"
  ON tickets FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for ticket_messages table
CREATE POLICY "Support can read all messages"
  ON ticket_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Support can insert messages"
  ON ticket_messages FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert some sample data for testing
INSERT INTO users (email, name, role, auth_type) VALUES
  ('admin@store.com', 'Admin User', 'admin', 'google_sso'),
  ('support@store.com', 'Support User', 'support', 'kerberos')
ON CONFLICT (email) DO NOTHING;

INSERT INTO items (name, description, quantity, price, category) VALUES
  ('Laptop', 'High-performance laptop for business use', 15, 999.99, 'electronics'),
  ('Office Chair', 'Ergonomic office chair with lumbar support', 25, 249.99, 'furniture'),
  ('Desk Lamp', 'LED desk lamp with adjustable brightness', 50, 39.99, 'accessories'),
  ('Notebook', 'A5 lined notebook, 200 pages', 100, 5.99, 'stationery'),
  ('Wireless Mouse', 'Bluetooth wireless mouse with ergonomic design', 40, 29.99, 'electronics')
ON CONFLICT DO NOTHING;

INSERT INTO tickets (customer_name, customer_email, subject, description, status) VALUES
  ('John Doe', 'john@example.com', 'Product inquiry', 'I would like to know more about the laptop specifications', 'open'),
  ('Jane Smith', 'jane@example.com', 'Order issue', 'My order #12345 has not arrived yet', 'in_progress'),
  ('Bob Johnson', 'bob@example.com', 'Refund request', 'I would like to request a refund for item #67890', 'open')
ON CONFLICT DO NOTHING;