
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  start_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create phases table
CREATE TABLE public.phases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phase_number SMALLINT NOT NULL CHECK (phase_number BETWEEN 1 AND 9),
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'complete')),
  completion_percentage SMALLINT NOT NULL DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, phase_number)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phases ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Phases RLS
CREATE POLICY "Users can view own phases" ON public.phases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own phases" ON public.phases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own phases" ON public.phases FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own phases" ON public.phases FOR DELETE USING (auth.uid() = user_id);

-- Auto-create profile and 9 phases on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));

  INSERT INTO public.phases (user_id, phase_number, title) VALUES
    (NEW.id, 1, 'Deep Literature Foundation'),
    (NEW.id, 2, 'Dataset & Experiment Design'),
    (NEW.id, 3, 'Feature Engineering'),
    (NEW.id, 4, 'Model Architecture Selection'),
    (NEW.id, 5, 'FL Implementation'),
    (NEW.id, 6, 'Ablation Study'),
    (NEW.id, 7, 'Statistical Validation'),
    (NEW.id, 8, 'Writing the Paper'),
    (NEW.id, 9, 'Submission & Review');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_phases_updated_at BEFORE UPDATE ON public.phases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
