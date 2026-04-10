
CREATE TABLE public.launch_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.launch_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe"
  ON public.launch_emails FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can read all"
  ON public.launch_emails FOR SELECT
  USING (auth.role() = 'service_role');
