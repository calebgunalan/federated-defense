import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAblationResults, useAddAblationResult, useDeleteAblationResult } from "@/hooks/usePhases6to9";

const CONFIG_TYPES = [
  { value: "global_threshold", label: "Global Threshold" },
  { value: "per_client_local", label: "Per-Client Local" },
  { value: "federated_calibration", label: "Federated Calibration" },
];

function AddAblationDialog() {
  const [open, setOpen] = useState(false);
  const add = useAddAblationResult();
  const [form, setForm] = useState({ config_name: "", config_type: "global_threshold", accuracy: "", macro_precision: "", macro_recall: "", macro_f1: "", notes: "" });
  const toNum = (v: string) => v ? Number(v) : null;

  const handleSubmit = () => {
    if (!form.config_name.trim()) { toast.error("Name required"); return; }
    add.mutate({
      config_name: form.config_name, config_type: form.config_type,
      accuracy: toNum(form.accuracy), macro_precision: toNum(form.macro_precision),
      macro_recall: toNum(form.macro_recall), macro_f1: toNum(form.macro_f1), notes: form.notes,
    }, { onSuccess: () => { toast.success("Result added"); setOpen(false); } });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Result</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Ablation Result</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Config name *" value={form.config_name} onChange={e => setForm(f => ({ ...f, config_name: e.target.value }))} />
          <Select value={form.config_type} onValueChange={v => setForm(f => ({ ...f, config_type: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{CONFIG_TYPES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Accuracy" type="number" step="0.0001" value={form.accuracy} onChange={e => setForm(f => ({ ...f, accuracy: e.target.value }))} />
            <Input placeholder="Macro Precision" type="number" step="0.0001" value={form.macro_precision} onChange={e => setForm(f => ({ ...f, macro_precision: e.target.value }))} />
            <Input placeholder="Macro Recall" type="number" step="0.0001" value={form.macro_recall} onChange={e => setForm(f => ({ ...f, macro_recall: e.target.value }))} />
            <Input placeholder="Macro F1" type="number" step="0.0001" value={form.macro_f1} onChange={e => setForm(f => ({ ...f, macro_f1: e.target.value }))} />
          </div>
          <Textarea placeholder="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <Button onClick={handleSubmit} disabled={add.isPending} className="w-full">{add.isPending ? "Adding..." : "Add Result"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const fmt = (v: number | null) => v !== null && v !== undefined ? Number(v).toFixed(4) : "—";

export default function Phase6Page() {
  const { data: results, isLoading } = useAblationResults();
  const del = useDeleteAblationResult();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">Phase 6 · Weeks 13–15</p>
        <h1 className="text-2xl font-bold tracking-tight">Ablation Study</h1>
        <p className="text-muted-foreground mt-1">Test client-adaptive threshold calibration: global, per-client local, and federated.</p>
      </div>

      <div className="flex justify-end"><AddAblationDialog /></div>

      {isLoading ? <Skeleton className="h-60" /> : results?.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">No ablation results yet.</CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Config</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Accuracy</TableHead>
                  <TableHead className="text-right">Precision</TableHead>
                  <TableHead className="text-right">Recall</TableHead>
                  <TableHead className="text-right">F1</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results?.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium text-sm">{r.config_name}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{CONFIG_TYPES.find(c => c.value === r.config_type)?.label}</Badge></TableCell>
                    <TableCell className="text-right font-mono text-xs">{fmt(r.accuracy)}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{fmt(r.macro_precision)}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{fmt(r.macro_recall)}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{fmt(r.macro_f1)}</TableCell>
                    <TableCell><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => del.mutate(r.id, { onSuccess: () => toast.success("Deleted") })}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
