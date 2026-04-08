
-- Timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'other',
  cover_image_url TEXT,
  file_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  sales_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published products are viewable by everyone" ON public.products FOR SELECT USING (is_published = true OR auth.uid() = creator_id);
CREATE POLICY "Creators can insert their own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update their own products" ON public.products FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Creators can delete their own products" ON public.products FOR DELETE USING (auth.uid() = creator_id);

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES auth.users(id),
  buyer_email TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view orders for their products" ON public.orders FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.products WHERE products.id = orders.product_id AND products.creator_id = auth.uid())
  OR auth.uid() = buyer_id
);
CREATE POLICY "Anyone can create an order" ON public.orders FOR INSERT WITH CHECK (true);

-- Storage bucket for product files
INSERT INTO storage.buckets (id, name, public) VALUES ('product-files', 'product-files', true);

CREATE POLICY "Product files are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'product-files');
CREATE POLICY "Authenticated users can upload product files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-files' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own product files" ON storage.objects FOR UPDATE USING (bucket_id = 'product-files' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own product files" ON storage.objects FOR DELETE USING (bucket_id = 'product-files' AND auth.uid()::text = (storage.foldername(name))[1]);
