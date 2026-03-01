import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Dataset {
  id: string;
  user_id: string;
  name: string;
  description: string;
  rationale: string;
  source_url: string;
  created_at: string;
  updated_at: string;
}

export interface ClientPartition {
  id: string;
  user_id: string;
  name: string;
  org_type: string;
  characteristics: string;
  role_distribution: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface JsdMeasurement {
  id: string;
  user_id: string;
  client_a: string;
  client_b: string;
  jsd_value: number | null;
  notes: string;
  created_at: string;
}

export interface ChecklistItem {
  id: string;
  user_id: string;
  phase_number: number;
  label: string;
  checked: boolean;
  sort_order: number;
  created_at: string;
}

// Datasets
export function useDatasets() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["datasets", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("datasets").select("*").order("created_at");
      if (error) throw error;
      return data as Dataset[];
    },
    enabled: !!user,
  });
}

export function useAddDataset() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (d: Pick<Dataset, "name" | "description" | "rationale" | "source_url">) => {
      const { error } = await supabase.from("datasets").insert({ ...d, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["datasets"] }),
  });
}

export function useUpdateDataset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...u }: Partial<Dataset> & { id: string }) => {
      const { error } = await supabase.from("datasets").update(u).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["datasets"] }),
  });
}

export function useDeleteDataset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("datasets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["datasets"] }),
  });
}

// Client Partitions
export function useClientPartitions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["client_partitions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("client_partitions").select("*").order("created_at");
      if (error) throw error;
      return data as ClientPartition[];
    },
    enabled: !!user,
  });
}

export function useAddClientPartition() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (p: Pick<ClientPartition, "name" | "org_type" | "characteristics" | "role_distribution" | "notes">) => {
      const { error } = await supabase.from("client_partitions").insert({ ...p, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["client_partitions"] }),
  });
}

export function useDeleteClientPartition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("client_partitions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["client_partitions"] }),
  });
}

// JSD
export function useJsdMeasurements() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["jsd_measurements", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("jsd_measurements").select("*").order("created_at");
      if (error) throw error;
      return data as JsdMeasurement[];
    },
    enabled: !!user,
  });
}

export function useAddJsdMeasurement() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (m: Pick<JsdMeasurement, "client_a" | "client_b" | "jsd_value" | "notes">) => {
      const { error } = await supabase.from("jsd_measurements").insert({ ...m, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jsd_measurements"] }),
  });
}

export function useDeleteJsdMeasurement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("jsd_measurements").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jsd_measurements"] }),
  });
}

// Checklist
export function useChecklist(phaseNumber: number) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["checklist", phaseNumber, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("phase_checklist_items")
        .select("*")
        .eq("phase_number", phaseNumber)
        .order("sort_order");
      if (error) throw error;
      return data as ChecklistItem[];
    },
    enabled: !!user,
  });
}

export function useAddChecklistItem() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (item: Pick<ChecklistItem, "phase_number" | "label" | "sort_order">) => {
      const { error } = await supabase.from("phase_checklist_items").insert({ ...item, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: (_, v) => qc.invalidateQueries({ queryKey: ["checklist", v.phase_number] }),
  });
}

export function useToggleChecklistItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, checked, phase_number }: { id: string; checked: boolean; phase_number: number }) => {
      const { error } = await supabase.from("phase_checklist_items").update({ checked }).eq("id", id);
      if (error) throw error;
      return phase_number;
    },
    onSuccess: (pn) => qc.invalidateQueries({ queryKey: ["checklist", pn] }),
  });
}

export function useDeleteChecklistItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, phase_number }: { id: string; phase_number: number }) => {
      const { error } = await supabase.from("phase_checklist_items").delete().eq("id", id);
      if (error) throw error;
      return phase_number;
    },
    onSuccess: (pn) => qc.invalidateQueries({ queryKey: ["checklist", pn] }),
  });
}
