
-- Allow admins to read partnership applications
CREATE POLICY "Admins can view partnership applications"
ON public.partnership_applications
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update partnership application status
CREATE POLICY "Admins can update partnership applications"
ON public.partnership_applications
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all orders for stats
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all service orders for stats
CREATE POLICY "Admins can view all service orders"
ON public.service_orders
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
