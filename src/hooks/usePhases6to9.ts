import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface AblationResult {
  id: string; user_id: string; config_name: string; config_type: string;
  accuracy: number | null; macro_precision: number | null; macro_recall: number | null; macro_f1: number | null;
  notes: string; created_at: string;
}

export interface StatTest {
  id: string; user_id: string; test_name: string; comparison: string;
  test_statistic: number | null; p_value: number | null; significant: boolean | null;
  confidence_interval: string; notes: string; created_at: string;
}

export interface WritingSection {
  id: string; user_id: string; section_name: string; section_order: number;
  status: string; word_count: number; key_points: { text: string; done: boolean }[];
  notes: string; created_at: string; updated_at: string;
}

export interface ReviewerSuggestion {
  id: string; user_id: string; name: string; affiliation: string;
  relevant_papers: string; email: string; notes: string; created_at: string;
}

export interface RevisionEntry {
  id: string; user_id: string; round_number: number; reviewer_comment: string;
  response: string; status: string; created_at: string; updated_at: string;
}

// Ablation
export function useAblationResults() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["ablation", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("ablation_results").select("*").order("created_at");
      if (error) throw error;
      return data as AblationResult[];
    },
    enabled: !!user,
  });
}
export function useAddAblationResult() {
  const qc = useQueryClient(); const { user } = useAuth();
  return useMutation({
    mutationFn: async (r: Omit<AblationResult, "id" | "user_id" | "created_at">) => {
      const { error } = await supabase.from("ablation_results").insert({ ...r, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ablation"] }),
  });
}
export function useDeleteAblationResult() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ablation_results").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ablation"] }),
  });
}

// Stat Tests
export function useStatTests() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["stat_tests", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("stat_tests").select("*").order("created_at");
      if (error) throw error;
      return data as StatTest[];
    },
    enabled: !!user,
  });
}
export function useAddStatTest() {
  const qc = useQueryClient(); const { user } = useAuth();
  return useMutation({
    mutationFn: async (t: Omit<StatTest, "id" | "user_id" | "created_at">) => {
      const { error } = await supabase.from("stat_tests").insert({ ...t, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stat_tests"] }),
  });
}
export function useDeleteStatTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("stat_tests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stat_tests"] }),
  });
}

// Writing Sections
export function useWritingSections() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["writing_sections", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("writing_sections").select("*").order("section_order");
      if (error) throw error;
      return data as WritingSection[];
    },
    enabled: !!user,
  });
}
export function useAddWritingSection() {
  const qc = useQueryClient(); const { user } = useAuth();
  return useMutation({
    mutationFn: async (s: Pick<WritingSection, "section_name" | "section_order" | "key_points">) => {
      const { error } = await supabase.from("writing_sections").insert({ ...s, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["writing_sections"] }),
  });
}
export function useUpdateWritingSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...u }: Partial<WritingSection> & { id: string }) => {
      const { error } = await supabase.from("writing_sections").update(u).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["writing_sections"] }),
  });
}

// Reviewers
export function useReviewerSuggestions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["reviewers", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("reviewer_suggestions").select("*").order("created_at");
      if (error) throw error;
      return data as ReviewerSuggestion[];
    },
    enabled: !!user,
  });
}
export function useAddReviewer() {
  const qc = useQueryClient(); const { user } = useAuth();
  return useMutation({
    mutationFn: async (r: Pick<ReviewerSuggestion, "name" | "affiliation" | "relevant_papers" | "email" | "notes">) => {
      const { error } = await supabase.from("reviewer_suggestions").insert({ ...r, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviewers"] }),
  });
}
export function useDeleteReviewer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviewer_suggestions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviewers"] }),
  });
}

// Revision Log
export function useRevisionLog() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["revision_log", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("revision_log").select("*").order("round_number").order("created_at");
      if (error) throw error;
      return data as RevisionEntry[];
    },
    enabled: !!user,
  });
}
export function useAddRevisionEntry() {
  const qc = useQueryClient(); const { user } = useAuth();
  return useMutation({
    mutationFn: async (e: Pick<RevisionEntry, "round_number" | "reviewer_comment" | "response" | "status">) => {
      const { error } = await supabase.from("revision_log").insert({ ...e, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["revision_log"] }),
  });
}
export function useUpdateRevisionEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...u }: Partial<RevisionEntry> & { id: string }) => {
      const { error } = await supabase.from("revision_log").update(u).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["revision_log"] }),
  });
}
export function useDeleteRevisionEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("revision_log").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["revision_log"] }),
  });
}
