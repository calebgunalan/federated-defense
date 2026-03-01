
-- ==========================================
-- PHASE 3: Feature Engineering
-- ==========================================
CREATE TABLE public.feature_catalog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'behavioral',
  time_window TEXT DEFAULT 'daily',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.feature_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own features" ON public.feature_catalog FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own features" ON public.feature_catalog FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own features" ON public.feature_catalog FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own features" ON public.feature_catalog FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- PHASE 4: Model Architecture Selection
-- ==========================================
CREATE TABLE public.architecture_candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  model_type TEXT DEFAULT '',
  description TEXT DEFAULT '',
  accuracy NUMERIC(6,4),
  macro_precision NUMERIC(6,4),
  macro_recall NUMERIC(6,4),
  macro_f1 NUMERIC(6,4),
  selected_for_fl BOOLEAN NOT NULL DEFAULT false,
  selection_rationale TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.architecture_candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own archs" ON public.architecture_candidates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own archs" ON public.architecture_candidates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own archs" ON public.architecture_candidates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own archs" ON public.architecture_candidates FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_arch_updated_at BEFORE UPDATE ON public.architecture_candidates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- PHASE 5: FL Experiments
-- ==========================================
CREATE TABLE public.fl_experiments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  experiment_name TEXT NOT NULL,
  client_pairing TEXT NOT NULL DEFAULT '',
  training_paradigm TEXT NOT NULL DEFAULT 'fedavg',
  architecture TEXT DEFAULT '',
  mu_value NUMERIC(6,4),
  accuracy NUMERIC(6,4),
  macro_precision NUMERIC(6,4),
  macro_recall NUMERIC(6,4),
  macro_f1 NUMERIC(6,4),
  auc_roc NUMERIC(6,4),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.fl_experiments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own experiments" ON public.fl_experiments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own experiments" ON public.fl_experiments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own experiments" ON public.fl_experiments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own experiments" ON public.fl_experiments FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_fl_exp_updated_at BEFORE UPDATE ON public.fl_experiments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- PHASE 6: Ablation Study
-- ==========================================
CREATE TABLE public.ablation_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  config_name TEXT NOT NULL,
  config_type TEXT NOT NULL DEFAULT 'global_threshold',
  accuracy NUMERIC(6,4),
  macro_precision NUMERIC(6,4),
  macro_recall NUMERIC(6,4),
  macro_f1 NUMERIC(6,4),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ablation_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own ablation" ON public.ablation_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ablation" ON public.ablation_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ablation" ON public.ablation_results FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ablation" ON public.ablation_results FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- PHASE 7: Statistical Validation
-- ==========================================
CREATE TABLE public.stat_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  test_name TEXT NOT NULL,
  comparison TEXT NOT NULL DEFAULT '',
  test_statistic NUMERIC(10,4),
  p_value NUMERIC(10,6),
  significant BOOLEAN,
  confidence_interval TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.stat_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own stats" ON public.stat_tests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON public.stat_tests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON public.stat_tests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own stats" ON public.stat_tests FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- PHASE 8: Writing Progress
-- ==========================================
CREATE TABLE public.writing_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  section_name TEXT NOT NULL,
  section_order SMALLINT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'not_started',
  word_count INT NOT NULL DEFAULT 0,
  key_points JSONB DEFAULT '[]'::jsonb,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.writing_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sections" ON public.writing_sections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sections" ON public.writing_sections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sections" ON public.writing_sections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sections" ON public.writing_sections FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_writing_updated_at BEFORE UPDATE ON public.writing_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- PHASE 9: Submission
-- ==========================================
CREATE TABLE public.reviewer_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  affiliation TEXT DEFAULT '',
  relevant_papers TEXT DEFAULT '',
  email TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reviewer_suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own reviewers" ON public.reviewer_suggestions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reviewers" ON public.reviewer_suggestions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviewers" ON public.reviewer_suggestions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviewers" ON public.reviewer_suggestions FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE public.revision_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  round_number SMALLINT NOT NULL DEFAULT 1,
  reviewer_comment TEXT NOT NULL DEFAULT '',
  response TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.revision_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own revisions" ON public.revision_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own revisions" ON public.revision_log FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own revisions" ON public.revision_log FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own revisions" ON public.revision_log FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_revision_updated_at BEFORE UPDATE ON public.revision_log FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
