
-- ==========================================
-- PHASE 1: Literature Manager tables
-- ==========================================

-- Papers table
CREATE TABLE public.literature_papers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  authors TEXT DEFAULT '',
  year SMALLINT,
  source TEXT DEFAULT '',
  circle TEXT NOT NULL DEFAULT 'fl_methodology',
  tags TEXT[] DEFAULT '{}',
  key_takeaways TEXT DEFAULT '',
  relevance_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.literature_papers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own papers" ON public.literature_papers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own papers" ON public.literature_papers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own papers" ON public.literature_papers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own papers" ON public.literature_papers FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_literature_papers_updated_at BEFORE UPDATE ON public.literature_papers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Gap statement
CREATE TABLE public.gap_statements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT DEFAULT '',
  checklist JSONB DEFAULT '{"identifies_fl_gap": false, "mentions_insider_threat": false, "addresses_heterogeneity": false, "cites_privacy_constraint": false, "differentiates_from_existing": false}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gap_statements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own gap statement" ON public.gap_statements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own gap statement" ON public.gap_statements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own gap statement" ON public.gap_statements FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_gap_statements_updated_at BEFORE UPDATE ON public.gap_statements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- PHASE 2: Dataset & Experiment Design tables
-- ==========================================

-- Datasets
CREATE TABLE public.datasets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  rationale TEXT DEFAULT '',
  source_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own datasets" ON public.datasets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own datasets" ON public.datasets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own datasets" ON public.datasets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own datasets" ON public.datasets FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_datasets_updated_at BEFORE UPDATE ON public.datasets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Client partitions
CREATE TABLE public.client_partitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  org_type TEXT DEFAULT '',
  characteristics TEXT DEFAULT '',
  role_distribution TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.client_partitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own partitions" ON public.client_partitions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own partitions" ON public.client_partitions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own partitions" ON public.client_partitions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own partitions" ON public.client_partitions FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_client_partitions_updated_at BEFORE UPDATE ON public.client_partitions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- JSD measurements
CREATE TABLE public.jsd_measurements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  client_a TEXT NOT NULL,
  client_b TEXT NOT NULL,
  jsd_value NUMERIC(6,4),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.jsd_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own jsd" ON public.jsd_measurements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own jsd" ON public.jsd_measurements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own jsd" ON public.jsd_measurements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own jsd" ON public.jsd_measurements FOR DELETE USING (auth.uid() = user_id);

-- Phase checklists (reusable for any phase)
CREATE TABLE public.phase_checklist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  phase_number SMALLINT NOT NULL,
  label TEXT NOT NULL,
  checked BOOLEAN NOT NULL DEFAULT false,
  sort_order SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.phase_checklist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own checklist" ON public.phase_checklist_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own checklist" ON public.phase_checklist_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own checklist" ON public.phase_checklist_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own checklist" ON public.phase_checklist_items FOR DELETE USING (auth.uid() = user_id);
