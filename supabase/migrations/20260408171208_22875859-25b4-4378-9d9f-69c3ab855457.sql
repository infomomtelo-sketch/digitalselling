
-- Add brief column to service_requests
ALTER TABLE public.service_requests ADD COLUMN IF NOT EXISTS brief text;

-- Create consultation_messages table
CREATE TABLE public.consultation_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id uuid NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.consultation_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can insert messages (public consultation, no auth required)
CREATE POLICY "Anyone can insert consultation messages"
  ON public.consultation_messages
  FOR INSERT
  WITH CHECK (true);

-- Anyone can read consultation messages
CREATE POLICY "Anyone can read consultation messages"
  ON public.consultation_messages
  FOR SELECT
  USING (true);

-- Service role can manage all
CREATE POLICY "Service role full access consultation messages"
  ON public.consultation_messages
  FOR ALL
  USING (auth.role() = 'service_role'::text)
  WITH CHECK (auth.role() = 'service_role'::text);

-- Index for fast lookups
CREATE INDEX idx_consultation_messages_request_id ON public.consultation_messages(service_request_id);
