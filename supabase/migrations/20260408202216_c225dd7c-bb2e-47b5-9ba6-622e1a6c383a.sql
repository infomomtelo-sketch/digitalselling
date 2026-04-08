
CREATE TABLE public.seller_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'tools',
  icon_url TEXT,
  affiliate_url TEXT NOT NULL,
  partner_name TEXT NOT NULL,
  partner_logo_url TEXT,
  is_free BOOLEAN NOT NULL DEFAULT false,
  badge TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.seller_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view seller resources"
ON public.seller_resources
FOR SELECT
USING (true);

CREATE POLICY "Service role can manage resources"
ON public.seller_resources
FOR ALL
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);

CREATE TRIGGER update_seller_resources_updated_at
BEFORE UPDATE ON public.seller_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
