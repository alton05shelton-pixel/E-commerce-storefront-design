-- Row Level Security Policies for E-commerce

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read, admin write)
CREATE POLICY "categories_select_all" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_insert_admin" ON public.categories FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "categories_update_admin" ON public.categories FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "categories_delete_admin" ON public.categories FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Products policies (public read active products, admin full access)
CREATE POLICY "products_select_active" ON public.products FOR SELECT 
  USING (is_active = true OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "products_insert_admin" ON public.products FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "products_update_admin" ON public.products FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "products_delete_admin" ON public.products FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Profiles policies (users can manage their own profile, admins can see all)
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles FOR SELECT 
  USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own_or_admin" ON public.profiles FOR UPDATE 
  USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE 
  USING (auth.uid() = id);

-- Addresses policies (users can manage their own addresses)
CREATE POLICY "addresses_select_own" ON public.addresses FOR SELECT 
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "addresses_insert_own" ON public.addresses FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "addresses_update_own" ON public.addresses FOR UPDATE 
  USING (auth.uid() = user_id);
CREATE POLICY "addresses_delete_own" ON public.addresses FOR DELETE 
  USING (auth.uid() = user_id);

-- Orders policies (users can see their own orders, admins can see all)
CREATE POLICY "orders_select_own_or_admin" ON public.orders FOR SELECT 
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_update_admin" ON public.orders FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Order items policies (users can see items from their orders, admins can see all)
CREATE POLICY "order_items_select_own_or_admin" ON public.order_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))));
CREATE POLICY "order_items_insert_own" ON public.order_items FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()));

-- Cart items policies (users can manage their own cart)
CREATE POLICY "cart_items_select_own" ON public.cart_items FOR SELECT 
  USING (auth.uid() = user_id);
CREATE POLICY "cart_items_insert_own" ON public.cart_items FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cart_items_update_own" ON public.cart_items FOR UPDATE 
  USING (auth.uid() = user_id);
CREATE POLICY "cart_items_delete_own" ON public.cart_items FOR DELETE 
  USING (auth.uid() = user_id);
