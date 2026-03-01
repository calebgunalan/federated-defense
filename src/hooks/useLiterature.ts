import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Paper {
  id: string;
  user_id: string;
  title: string;
  authors: string;
  year: number | null;
  source: string;
  circle: string;
  tags: string[];
  key_takeaways: string;
  relevance_notes: string;
  created_at: string;
  updated_at: string;
}

export interface GapStatement {
  id: string;
  user_id: string;
  content: string;
  checklist: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

export const CIRCLES = [
  { value: "fl_methodology", label: "FL Methodology" },
  { value: "insider_threat", label: "Insider Threat Detection" },
  { value: "fl_cybersecurity", label: "FL in Cybersecurity" },
] as const;

export function usePapers() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["papers", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("literature_papers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Paper[];
    },
    enabled: !!user,
  });
}

export function useAddPaper() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (paper: Omit<Paper, "id" | "user_id" | "created_at" | "updated_at">) => {
      const { error } = await supabase.from("literature_papers").insert({ ...paper, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["papers"] }),
  });
}

export function useUpdatePaper() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Paper> & { id: string }) => {
      const { error } = await supabase.from("literature_papers").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["papers"] }),
  });
}

export function useDeletePaper() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("literature_papers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["papers"] }),
  });
}

export function useGapStatement() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["gap_statement", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gap_statements")
        .select("*")
        .maybeSingle();
      if (error) throw error;
      return data as GapStatement | null;
    },
    enabled: !!user,
  });
}

export function useUpsertGapStatement() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ content, checklist }: { content: string; checklist: Record<string, boolean> }) => {
      const existing = qc.getQueryData<GapStatement | null>(["gap_statement", user?.id]);
      if (existing) {
        const { error } = await supabase.from("gap_statements").update({ content, checklist }).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("gap_statements").insert({ user_id: user!.id, content, checklist });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gap_statement"] }),
  });
}
