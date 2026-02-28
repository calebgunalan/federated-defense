import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Phase {
  id: string;
  user_id: string;
  phase_number: number;
  title: string;
  status: "not_started" | "in_progress" | "complete";
  completion_percentage: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

const WEEK_RANGES: Record<number, string> = {
  1: "Weeks 1–3",
  2: "Weeks 3–5",
  3: "Weeks 5–7",
  4: "Weeks 7–9",
  5: "Weeks 9–13",
  6: "Weeks 13–15",
  7: "Weeks 15–16",
  8: "Weeks 16–20",
  9: "Weeks 20–22",
};

export function getWeekRange(phaseNumber: number) {
  return WEEK_RANGES[phaseNumber] ?? "";
}

export function usePhases() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["phases", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("phases")
        .select("*")
        .order("phase_number");
      if (error) throw error;
      return data as Phase[];
    },
    enabled: !!user,
  });
}

export function useUpdatePhase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Phase> & { id: string }) => {
      const { error } = await supabase.from("phases").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["phases"] }),
  });
}
