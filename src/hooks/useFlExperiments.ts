import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface FlExperiment {
  id: string; user_id: string; experiment_name: string; client_pairing: string;
  training_paradigm: string; architecture: string; mu_value: number | null;
  accuracy: number | null; macro_precision: number | null; macro_recall: number | null;
  macro_f1: number | null; auc_roc: number | null; notes: string;
  created_at: string; updated_at: string;
}

export function useFlExperiments() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["fl_experiments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("fl_experiments").select("*").order("created_at");
      if (error) throw error;
      return data as FlExperiment[];
    },
    enabled: !!user,
  });
}

export function useAddFlExperiment() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (e: Omit<FlExperiment, "id" | "user_id" | "created_at" | "updated_at">) => {
      const { error } = await supabase.from("fl_experiments").insert({ ...e, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fl_experiments"] }),
  });
}

export function useDeleteFlExperiment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("fl_experiments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fl_experiments"] }),
  });
}
