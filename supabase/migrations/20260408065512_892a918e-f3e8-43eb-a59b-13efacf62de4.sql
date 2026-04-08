
DROP POLICY "Anyone can create an order" ON public.orders;
CREATE POLICY "Authenticated users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = buyer_id);
