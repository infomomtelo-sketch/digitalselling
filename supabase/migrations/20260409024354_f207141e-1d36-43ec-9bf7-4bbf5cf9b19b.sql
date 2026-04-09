
-- 1. Reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, reviewer_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = reviewer_id);
CREATE POLICY "Users can delete their own reviews" ON public.reviews FOR DELETE USING (auth.uid() = reviewer_id);

CREATE INDEX idx_reviews_product ON public.reviews(product_id);
CREATE INDEX idx_reviews_reviewer ON public.reviews(reviewer_id);

-- 2. Conversations table
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_one UUID NOT NULL,
  participant_two UUID NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(participant_one, participant_two)
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view their conversations" ON public.conversations FOR SELECT 
  USING (auth.uid() = participant_one OR auth.uid() = participant_two);
CREATE POLICY "Authenticated users can create conversations" ON public.conversations FOR INSERT 
  WITH CHECK (auth.uid() = participant_one OR auth.uid() = participant_two);
CREATE POLICY "Participants can update conversations" ON public.conversations FOR UPDATE 
  USING (auth.uid() = participant_one OR auth.uid() = participant_two);

-- 3. Conversation messages table
CREATE TABLE public.conversation_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Conversation participants can read messages" ON public.conversation_messages FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.conversations c 
    WHERE c.id = conversation_id 
    AND (c.participant_one = auth.uid() OR c.participant_two = auth.uid())
  ));
CREATE POLICY "Conversation participants can send messages" ON public.conversation_messages FOR INSERT 
  WITH CHECK (auth.uid() = sender_id AND EXISTS (
    SELECT 1 FROM public.conversations c 
    WHERE c.id = conversation_id 
    AND (c.participant_one = auth.uid() OR c.participant_two = auth.uid())
  ));
CREATE POLICY "Receiver can mark messages read" ON public.conversation_messages FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.conversations c 
    WHERE c.id = conversation_id 
    AND (c.participant_one = auth.uid() OR c.participant_two = auth.uid())
  ));

CREATE INDEX idx_conv_messages_conversation ON public.conversation_messages(conversation_id);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_messages;

-- 4. Services table (Fiverr gigs)
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  category TEXT NOT NULL DEFAULT 'other',
  cover_image_url TEXT,
  basic_price NUMERIC NOT NULL DEFAULT 0,
  basic_description TEXT,
  basic_delivery_days INTEGER DEFAULT 7,
  standard_price NUMERIC,
  standard_description TEXT,
  standard_delivery_days INTEGER,
  premium_price NUMERIC,
  premium_description TEXT,
  premium_delivery_days INTEGER,
  is_published BOOLEAN NOT NULL DEFAULT false,
  sales_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published services visible to everyone" ON public.services FOR SELECT 
  USING (is_published = true OR auth.uid() = creator_id);
CREATE POLICY "Creators can insert services" ON public.services FOR INSERT 
  WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update their services" ON public.services FOR UPDATE 
  USING (auth.uid() = creator_id);
CREATE POLICY "Creators can delete their services" ON public.services FOR DELETE 
  USING (auth.uid() = creator_id);

CREATE INDEX idx_services_creator ON public.services(creator_id);
CREATE INDEX idx_services_category ON public.services(category);

-- 5. Service orders table
CREATE TABLE public.service_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  buyer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  tier TEXT NOT NULL DEFAULT 'basic',
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  requirements TEXT,
  delivery_url TEXT,
  buyer_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers and sellers can view their orders" ON public.service_orders FOR SELECT 
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Authenticated users can create service orders" ON public.service_orders FOR INSERT 
  WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Sellers can update order status" ON public.service_orders FOR UPDATE 
  USING (auth.uid() = seller_id OR auth.uid() = buyer_id);

CREATE INDEX idx_service_orders_buyer ON public.service_orders(buyer_id);
CREATE INDEX idx_service_orders_seller ON public.service_orders(seller_id);

-- 6. Wishlists table
CREATE TABLE public.wishlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wishlist" ON public.wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to wishlist" ON public.wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from wishlist" ON public.wishlists FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_wishlists_user ON public.wishlists(user_id);

-- 7. User roles table (for admin)
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = user_id);
CREATE POLICY "Service role manages roles" ON public.user_roles FOR ALL 
  USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Triggers for updated_at
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_service_orders_updated_at BEFORE UPDATE ON public.service_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Update conversation last_message_at on new message
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations SET last_message_at = now() WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_conversation_timestamp AFTER INSERT ON public.conversation_messages 
  FOR EACH ROW EXECUTE FUNCTION public.update_conversation_last_message();
