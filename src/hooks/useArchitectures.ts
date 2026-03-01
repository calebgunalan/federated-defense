import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Architecture {
  id: string; user_id: string; name: string; model_type: string; description: string;
  accuracy: number | null; macro_precision: number | null; macro_recall: number | null; macro_f1: number | null;
  selected_for_fl: boolean; selection_rationale: string; notes: string;
  created_at: string; updated_at: string;
}

export function useArchitectures() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["architectures", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("architecture_candidates").select("*").order("created_at");
      if (error) throw error;
      return data as Architecture[];
    },
    enabled: !!user,
  });
}

export function useAddArchitecture() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (a: Omit<Architecture, "id" | "user_id" | "created_at" | "updated_at">) => {
      const { error } = await supabase.from("architecture_candidates").insert({ ...a, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["architectures"] }),
  });
}

export function useUpdateArchitecture() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...u }: Partial<Architecture> & { id: string }) => {
      const { error } = await supabase.from("architecture_candidates").update(u).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["architectures"] }),
  });
}

export function useDeleteArchitecture() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("architecture_candidates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["architectures"] }),
  });
}
