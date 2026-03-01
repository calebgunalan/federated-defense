import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, FlaskConical, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useFlExperiments, useAddFlExperiment, useDeleteFlExperiment } from "@/hooks/useFlExperiments";

const PARADIGMS = ["local", "centralized", "fedavg", "fedprox"];
const PAIRINGS = ["A+B", "A+C", "B+C", "A+B+C"];

function AddExperimentDialog() {
  const [open, setOpen] = useState(false);
  const add = useAddFlExperiment();
  const [form, setForm] = useState({
    experiment_name: "", client_pairing: "A+B", training_paradigm: "fedavg",
    architecture: "", mu_value: "", accuracy: "", macro_precision: "", macro_recall: "",
    macro_f1: "", auc_roc: "", notes: "",
  });

  const toNum = (v: string) => v ? Number(v) : null;

  const handleSubmit = () => {
    if (!form.experiment_name.trim()) { toast.error("Name required"); return; }
    add.mutate({
      experiment_name: form.experiment_name, client_pairing: form.client_pairing,
      training_paradigm: form.training_paradigm, architecture: form.architecture,
      mu_value: toNum(form.mu_value), accuracy: toNum(form.accuracy),
      macro_precision: toNum(form.macro_precision), macro_recall: toNum(form.macro_recall),
      macro_f1: toNum(form.macro_f1), auc_roc: toNum(form.auc_roc), notes: form.notes,
    }, { onSuccess: () => { toast.success("Experiment added"); setOpen(false); } });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Experiment</Button></DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Log FL Experiment</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Experiment name *" value={form.experiment_name} onChange={e => setForm(f => ({ ...f, experiment_name: e.target.value }))} />
          <div className="flex gap-2">
            <Select value={form.client_pairing} onValueChange={v => setForm(f => ({ ...f, client_pairing: v }))}>
              <SelectTrigger className="w-32"><SelectValue placeholder="Pairing" /></SelectTrigger>
              <SelectContent>{PAIRINGS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={form.training_paradigm} onValueChange={v => setForm(f => ({ ...f, training_paradigm: v }))}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Paradigm" /></SelectTrigger>
              <SelectContent>{PARADIGMS.map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Input placeholder="Architecture" value={form.architecture} onChange={e => setForm(f => ({ ...f, architecture: e.target.value }))} />
          {form.training_paradigm === "fedprox" && (
            <Input placeholder="µ value" type="number" step="0.001" value={form.mu_value} onChange={e => setForm(f => ({ ...f, mu_value: e.target.value }))} />
          )}
          <p className="text-xs font-medium text-muted-foreground">Results</p>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Accuracy" type="number" step="0.0001" value={form.accuracy} onChange={e => setForm(f => ({ ...f, accuracy: e.target.value }))} />
            <Input placeholder="Macro Precision" type="number" step="0.0001" value={form.macro_precision} onChange={e => setForm(f => ({ ...f, macro_precision: e.target.value }))} />
            <Input placeholder="Macro Recall" type="number" step="0.0001" value={form.macro_recall} onChange={e => setForm(f => ({ ...f, macro_recall: e.target.value }))} />
            <Input placeholder="Macro F1" type="number" step="0.0001" value={form.macro_f1} onChange={e => setForm(f => ({ ...f, macro_f1: e.target.value }))} />
            <Input placeholder="AUC-ROC" type="number" step="0.0001" value={form.auc_roc} onChange={e => setForm(f => ({ ...f, auc_roc: e.target.value }))} />
          </div>
          <Textarea placeholder="Notes & observations" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <Button onClick={handleSubmit} disabled={add.isPending} className="w-full">{add.isPending ? "Adding..." : "Log Experiment"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const fmt = (v: number | null) => v !== null && v !== undefined ? Number(v).toFixed(4) : "—";
const paradigmColor: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  local: "outline", centralized: "secondary", fedavg: "default", fedprox: "default",
};

export default function Phase5Page() {
  const { data: experiments, isLoading } = useFlExperiments();
  const del = useDeleteFlExperiment();
  const [filterParadigm, setFilterParadigm] = useState("all");

  const filtered = filterParadigm === "all" ? experiments : experiments?.filter(e => e.training_paradigm === filterParadigm);
  const muExperiments = experiments?.filter(e => e.training_paradigm === "fedprox" && e.mu_value !== null);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">Phase 5 · Weeks 9–13</p>
        <h1 className="text-2xl font-bold tracking-tight">Federated Learning Experiments</h1>
        <p className="text-muted-foreground mt-1">Run FedAvg vs FedProx across client pairings. Track µ sensitivity analysis.</p>
      </div>

      <Tabs defaultValue="matrix">
        <TabsList>
          <TabsTrigger value="matrix" className="gap-1"><FlaskConical className="h-3.5 w-3.5" /> Experiment Matrix</TabsTrigger>
          <TabsTrigger value="mu" className="gap-1"><SlidersHorizontal className="h-3.5 w-3.5" /> µ Sensitivity</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="space-y-4 mt-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-1 flex-wrap">
              <Badge variant={filterParadigm === "all" ? "default" : "outline"} className="cursor-pointer" onClick={() => setFilterParadigm("all")}>All</Badge>
              {PARADIGMS.map(p => <Badge key={p} variant={filterParadigm === p ? "default" : "outline"} className="cursor-pointer capitalize" onClick={() => setFilterParadigm(p)}>{p}</Badge>)}
            </div>
            <AddExperimentDialog />
          </div>

          {isLoading ? <Skeleton className="h-60" /> : filtered?.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">No experiments logged yet.</CardContent></Card>
          ) : (
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Experiment</TableHead>
                      <TableHead>Clients</TableHead>
                      <TableHead>Paradigm</TableHead>
                      <TableHead>Arch</TableHead>
                      <TableHead className="text-right">F1</TableHead>
                      <TableHead className="text-right">AUC</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered?.map(e => (
                      <TableRow key={e.id}>
                        <TableCell className="font-medium text-sm">{e.experiment_name}</TableCell>
                        <TableCell className="font-mono text-xs">{e.client_pairing}</TableCell>
                        <TableCell><Badge variant={paradigmColor[e.training_paradigm] ?? "outline"} className="text-[10px] capitalize">{e.training_paradigm}</Badge></TableCell>
                        <TableCell className="text-xs">{e.architecture || "—"}</TableCell>
                        <TableCell className="text-right font-mono text-xs">{fmt(e.macro_f1)}</TableCell>
                        <TableCell className="text-right font-mono text-xs">{fmt(e.auc_roc)}</TableCell>
                        <TableCell><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => del.mutate(e.id, { onSuccess: () => toast.success("Deleted") })}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="mu" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">µ Sensitivity Analysis</CardTitle>
              <CardDescription>FedProx experiments filtered by µ value. Compare µ ∈ {"{0.001, 0.01, 0.1, 1.0}"}.</CardDescription>
            </CardHeader>
            <CardContent>
              {muExperiments?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No FedProx experiments with µ values logged yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Experiment</TableHead>
                      <TableHead>Clients</TableHead>
                      <TableHead className="text-right">µ</TableHead>
                      <TableHead className="text-right">F1</TableHead>
                      <TableHead className="text-right">AUC</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {muExperiments?.map(e => (
                      <TableRow key={e.id}>
                        <TableCell className="text-sm">{e.experiment_name}</TableCell>
                        <TableCell className="font-mono text-xs">{e.client_pairing}</TableCell>
                        <TableCell className="text-right font-mono text-xs font-bold">{Number(e.mu_value).toFixed(3)}</TableCell>
                        <TableCell className="text-right font-mono text-xs">{fmt(e.macro_f1)}</TableCell>
                        <TableCell className="text-right font-mono text-xs">{fmt(e.auc_roc)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
