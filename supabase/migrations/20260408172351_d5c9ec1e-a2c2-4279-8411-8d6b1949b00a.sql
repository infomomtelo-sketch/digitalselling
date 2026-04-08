
CREATE TABLE public.consultation_credits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id uuid NOT NULL UNIQUE REFERENCES public.service_requests(id) ON DELETE CASCADE,
  free_messages_used integer NOT NULL DEFAULT 0,
  paid_credits integer NOT NULL DEFAULT 0,
  stripe_session_ids text[] DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.consultation_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read credits"
  ON public.consultation_credits FOR SELECT USING (true);

CREATE POLICY "Anyone can insert credits"
  ON public.consultation_credits FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update credits"
  ON public.consultation_credits FOR UPDATE
  USING (auth.role() = 'service_role'::text)
  WITH CHECK (auth.role() = 'service_role'::text);

CREATE POLICY "Service role can manage all credits"
  ON public.consultation_credits FOR ALL
  USING (auth.role() = 'service_role'::text)
  WITH CHECK (auth.role() = 'service_role'::text);
