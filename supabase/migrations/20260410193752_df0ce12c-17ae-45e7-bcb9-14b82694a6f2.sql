CREATE TABLE public.partnership_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT NOT NULL,
  category TEXT NOT NULL,
  product_description TEXT NOT NULL,
  audience_size TEXT NOT NULL,
  commission_model TEXT NOT NULL,
  additional_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.partnership_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit partnership applications"
  ON public.partnership_applications FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Service role can view all applications"
  ON public.partnership_applications FOR SELECT
  TO public
  USING (auth.role() = 'service_role');