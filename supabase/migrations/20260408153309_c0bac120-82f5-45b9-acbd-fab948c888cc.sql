CREATE TABLE public.service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  plan text NOT NULL DEFAULT 'Not specified',
  details text NOT NULL,
  user_id uuid,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a service request"
ON public.service_requests
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Service role can view all requests"
ON public.service_requests
FOR SELECT
USING (auth.role() = 'service_role');