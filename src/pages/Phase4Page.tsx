import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { useArchitectures, useAddArchitecture, useUpdateArchitecture, useDeleteArchitecture } from "@/hooks/useArchitectures";

function AddArchDialog() {
  const [open, setOpen] = useState(false);
  const add = useAddArchitecture();
  const [form, setForm] = useState({ name: "", model_type: "", description: "", accuracy: "", macro_precision: "", macro_recall: "", macro_f1: "", selected_for_fl: false, selection_rationale: "", notes: "" });

  const toNum = (v: string) => v ? Number(v) : null;

  const handleSubmit = () => {
    if (!form.name.trim()) { toast.error("Name required"); return; }
    add.mutate({
      name: form.name, model_type: form.model_type, description: form.description,
      accuracy: toNum(form.accuracy), macro_precision: toNum(form.macro_precision),
      macro_recall: toNum(form.macro_recall), macro_f1: toNum(form.macro_f1),
      selected_for_fl: form.selected_for_fl, selection_rationale: form.selection_rationale, notes: form.notes,
    }, { onSuccess: () => { toast.success("Architecture added"); setOpen(false); } });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Architecture</Button></DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Add Architecture Candidate</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Name * (e.g. LSTM)" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input placeholder="Model type (e.g. sequence)" value={form.model_type} onChange={e => setForm(f => ({ ...f, model_type: e.target.value }))} />
          <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <p className="text-xs font-medium text-muted-foreground">Centralized Baseline Metrics</p>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Accuracy" type="number" step="0.0001" value={form.accuracy} onChange={e => setForm(f => ({ ...f, accuracy: e.target.value }))} />
            <Input placeholder="Macro Precision" type="number" step="0.0001" value={form.macro_precision} onChange={e => setForm(f => ({ ...f, macro_precision: e.target.value }))} />
            <Input placeholder="Macro Recall" type="number" step="0.0001" value={form.macro_recall} onChange={e => setForm(f => ({ ...f, macro_recall: e.target.value }))} />
            <Input placeholder="Macro F1" type="number" step="0.0001" value={form.macro_f1} onChange={e => setForm(f => ({ ...f, macro_f1: e.target.value }))} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.selected_for_fl} onCheckedChange={v => setForm(f => ({ ...f, selected_for_fl: v }))} />
            <span className="text-sm">Selected for FL experiments</span>
          </div>
          {form.selected_for_fl && <Textarea placeholder="Selection rationale" value={form.selection_rationale} onChange={e => setForm(f => ({ ...f, selection_rationale: e.target.value }))} />}
          <Textarea placeholder="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <Button onClick={handleSubmit} disabled={add.isPending} className="w-full">{add.isPending ? "Adding..." : "Add"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const fmt = (v: number | null) => v !== null && v !== undefined ? v.toFixed(4) : "—";

export default function Phase4Page() {
  const { data: archs, isLoading } = useArchitectures();
  const del = useDeleteArchitecture();
  const update = useUpdateArchitecture();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">Phase 4 · Weeks 7–9</p>
        <h1 className="text-2xl font-bold tracking-tight">Model Architecture Selection</h1>
        <p className="text-muted-foreground mt-1">Compare LSTM, MLP, 1D CNN, and Autoencoder. Run centralized baselines, select top models for FL.</p>
      </div>

      <div className="flex justify-end"><AddArchDialog /></div>

      {isLoading ? <Skeleton className="h-60" /> : archs?.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">No architectures added yet.</CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Architecture</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Accuracy</TableHead>
                  <TableHead className="text-right">Precision</TableHead>
                  <TableHead className="text-right">Recall</TableHead>
                  <TableHead className="text-right">F1</TableHead>
                  <TableHead className="text-center">FL</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {archs?.map(a => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium text-sm">{a.name}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{a.model_type || "—"}</Badge></TableCell>
                    <TableCell className="text-right font-mono text-xs">{fmt(a.accuracy)}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{fmt(a.macro_precision)}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{fmt(a.macro_recall)}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{fmt(a.macro_f1)}</TableCell>
                    <TableCell className="text-center">
                      <Switch checked={a.selected_for_fl} onCheckedChange={v => update.mutate({ id: a.id, selected_for_fl: v })} />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => del.mutate(a.id, { onSuccess: () => toast.success("Deleted") })}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {archs && archs.filter(a => a.selected_for_fl).length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Star className="h-4 w-4" /> Selected for FL</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {archs.filter(a => a.selected_for_fl).map(a => (
              <div key={a.id} className="text-sm">
                <span className="font-medium">{a.name}</span>
                {a.selection_rationale && <span className="text-muted-foreground ml-2">— {a.selection_rationale}</span>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
