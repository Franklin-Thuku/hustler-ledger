-- Hustler-Ledger Database Schema
-- Optimized for high-volume transaction processing and scalability

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('owner', 'assistant')) DEFAULT 'owner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Businesses table
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  location TEXT,
  phone TEXT,
  email TEXT,
  registration_number TEXT,
  tax_id TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table (optimized for high-volume inserts)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('sale', 'expense', 'credit', 'repayment')) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  reference_number TEXT,
  payment_method TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('pending', 'completed', 'overdue', 'cancelled')) DEFAULT 'completed',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budgets table
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  limit_amount DECIMAL(12, 2) NOT NULL,
  spent_amount DECIMAL(12, 2) DEFAULT 0,
  period TEXT CHECK (period IN ('monthly', 'weekly', 'yearly')) DEFAULT 'monthly',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Savings goals table
CREATE TABLE IF NOT EXISTS public.savings_goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  target_amount DECIMAL(12, 2) NOT NULL,
  current_amount DECIMAL(12, 2) DEFAULT 0,
  target_date DATE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON public.businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_is_active ON public.businesses(is_active);
CREATE INDEX IF NOT EXISTS idx_transactions_business_id ON public.transactions(business_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_due_date ON public.transactions(due_date) WHERE due_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transactions_customer_phone ON public.transactions(customer_phone) WHERE customer_phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_budgets_business_id ON public.budgets(business_id);
CREATE INDEX IF NOT EXISTS idx_budgets_period ON public.budgets(period);
CREATE INDEX IF NOT EXISTS idx_savings_goals_business_id ON public.savings_goals(business_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_transactions_business_created ON public.transactions(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_business_type ON public.transactions(business_id, type);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Businesses policies
CREATE POLICY "Users can view own businesses" ON public.businesses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own businesses" ON public.businesses
  FOR ALL USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own business transactions" ON public.transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE businesses.id = transactions.business_id 
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own business transactions" ON public.transactions
  FOR ALL WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE businesses.id = transactions.business_id 
      AND businesses.user_id = auth.uid()
    )
  );

-- Budgets policies
CREATE POLICY "Users can view own business budgets" ON public.budgets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE businesses.id = budgets.business_id 
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own business budgets" ON public.budgets
  FOR ALL WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE businesses.id = budgets.business_id 
      AND businesses.user_id = auth.uid()
    )
  );

-- Savings goals policies
CREATE POLICY "Users can view own business savings goals" ON public.savings_goals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE businesses.id = savings_goals.business_id 
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own business savings goals" ON public.savings_goals
  FOR ALL WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE businesses.id = savings_goals.business_id 
      AND businesses.user_id = auth.uid()
    )
  );

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_budgets_updated_at
  BEFORE UPDATE ON public.budgets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_savings_goals_updated_at
  BEFORE UPDATE ON public.savings_goals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to create user profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update budget spent amount when transactions are added
CREATE OR REPLACE FUNCTION public.update_budget_spent()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'expense' THEN
    UPDATE public.budgets 
    SET spent_amount = spent_amount + NEW.amount
    WHERE business_id = NEW.business_id 
    AND category = NEW.category
    AND is_active = true
    AND start_date <= DATE(NEW.created_at)
    AND end_date >= DATE(NEW.created_at);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update budget when expense is added
CREATE TRIGGER update_budget_on_expense
  AFTER INSERT ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_budget_spent();

-- Function to check and create notifications for overdue payments
CREATE OR REPLACE FUNCTION public.check_overdue_payments()
RETURNS void AS $$
BEGIN
  UPDATE public.transactions
  SET status = 'overdue'
  WHERE type = 'credit'
  AND status = 'pending'
  AND due_date < NOW()
  AND due_date >= NOW() - INTERVAL '1 day';
  
  INSERT INTO public.notifications (user_id, business_id, type, title, message)
  SELECT 
    b.user_id,
    t.business_id,
    'warning' as type,
    'Payment Overdue' as title,
    CONCAT('Payment of KES ', t.amount, ' from ', t.customer_name, ' is overdue') as message
  FROM public.transactions t
  JOIN public.businesses b ON b.id = t.business_id
  WHERE t.type = 'credit'
  AND t.status = 'overdue'
  AND t.due_date < NOW()
  AND NOT EXISTS (
    SELECT 1 FROM public.notifications n 
    WHERE n.business_id = t.business_id 
    AND n.type = 'warning'
    AND n.message LIKE CONCAT('%', t.customer_name, '%')
    AND n.created_at > NOW() - INTERVAL '1 day'
  );
END;
$$ LANGUAGE plpgsql;

-- This would be called by a cron job or scheduler
