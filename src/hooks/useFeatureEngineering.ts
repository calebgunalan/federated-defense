import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Feature {
  id: string; user_id: string; name: string; description: string;
  category: string; time_window: string; notes: string; created_at: string;
}

export function useFeatures() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["features", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("feature_catalog").select("*").order("created_at");
      if (error) throw error;
      return data as Feature[];
    },
    enabled: !!user,
  });
}

export function useAddFeature() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (f: Pick<Feature, "name" | "description" | "category" | "time_window" | "notes">) => {
      const { error } = await supabase.from("feature_catalog").insert({ ...f, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["features"] }),
  });
}

export function useDeleteFeature() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("feature_catalog").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["features"] }),
  });
}
