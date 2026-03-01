import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, BarChart3, CheckSquare } from "lucide-react";
import { toast } from "sonner";
import { useStatTests, useAddStatTest, useDeleteStatTest } from "@/hooks/usePhases6to9";
import { useChecklist, useAddChecklistItem, useToggleChecklistItem, useDeleteChecklistItem } from "@/hooks/useDatasetDesign";

function AddStatTestDialog() {
  const [open, setOpen] = useState(false);
  const add = useAddStatTest();
  const [form, setForm] = useState({ test_name: "", comparison: "", test_statistic: "", p_value: "", significant: false, confidence_interval: "", notes: "" });
  const toNum = (v: string) => v ? Number(v) : null;

  const handleSubmit = () => {
    if (!form.test_name.trim()) { toast.error("Test name required"); return; }
    add.mutate({
      test_name: form.test_name, comparison: form.comparison,
      test_statistic: toNum(form.test_statistic), p_value: toNum(form.p_value),
      significant: form.significant, confidence_interval: form.confidence_interval, notes: form.notes,
    }, { onSuccess: () => { toast.success("Test added"); setOpen(false); } });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Test</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Log Statistical Test</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Test name * (e.g. McNemar's)" value={form.test_name} onChange={e => setForm(f => ({ ...f, test_name: e.target.value }))} />
          <Input placeholder="Comparison (e.g. FedProx vs FedAvg)" value={form.comparison} onChange={e => setForm(f => ({ ...f, comparison: e.target.value }))} />
          <div className="flex gap-2">
            <Input placeholder="Test statistic" type="number" step="0.0001" value={form.test_statistic} onChange={e => setForm(f => ({ ...f, test_statistic: e.target.value }))} />
            <Input placeholder="p-value" type="number" step="0.000001" value={form.p_value} onChange={e => setForm(f => ({ ...f, p_value: e.target.value }))} />
          </div>
          <Input placeholder="CI (e.g. [0.82, 0.91])" value={form.confidence_interval} onChange={e => setForm(f => ({ ...f, confidence_interval: e.target.value }))} />
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox checked={form.significant} onCheckedChange={v => setForm(f => ({ ...f, significant: !!v }))} />
            Statistically significant
          </label>
          <Textarea placeholder="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <Button onClick={handleSubmit} disabled={add.isPending} className="w-full">{add.isPending ? "Adding..." : "Log Test"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ValidationChecklist() {
  const { data: items, isLoading } = useChecklist(7);
  const addItem = useAddChecklistItem();
  const toggleItem = useToggleChecklistItem();
  const deleteItem = useDeleteChecklistItem();
  const [newLabel, setNewLabel] = useState("");

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    addItem.mutate({ phase_number: 7, label: newLabel, sort_order: (items?.length ?? 0) }, { onSuccess: () => { toast.success("Added"); setNewLabel(""); } });
  };

  if (isLoading) return <Skeleton className="h-40" />;

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Validation Checklist</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {items?.map(item => (
          <div key={item.id} className="flex items-center gap-2 group">
            <Checkbox checked={item.checked} onCheckedChange={v => toggleItem.mutate({ id: item.id, checked: !!v, phase_number: 7 })} />
            <span className={`text-sm flex-1 ${item.checked ? "line-through text-muted-foreground" : ""}`}>{item.label}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteItem.mutate({ id: item.id, phase_number: 7 })}><Trash2 className="h-3 w-3 text-destructive" /></Button>
          </div>
        ))}
        <div className="flex gap-2 pt-2">
          <Input placeholder="Add item..." value={newLabel} onChange={e => setNewLabel(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()} className="text-sm" />
          <Button size="sm" onClick={handleAdd} disabled={addItem.isPending}>Add</Button>
        </div>
      </CardContent>
    </Card>
  );
}

const fmt = (v: number | null) => v !== null && v !== undefined ? Number(v).toFixed(4) : "—";
const fmtP = (v: number | null) => v !== null && v !== undefined ? Number(v).toFixed(6) : "—";

export default function Phase7Page() {
  const { data: tests, isLoading } = useStatTests();
  const del = useDeleteStatTest();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">Phase 7 · Weeks 15–16</p>
        <h1 className="text-2xl font-bold tracking-tight">Statistical Validation</h1>
        <p className="text-muted-foreground mt-1">McNemar's test, bootstrap CIs, ROC curves. Validate significance of results.</p>
      </div>

      <Tabs defaultValue="tests">
        <TabsList>
          <TabsTrigger value="tests" className="gap-1"><BarChart3 className="h-3.5 w-3.5" /> Test Results</TabsTrigger>
          <TabsTrigger value="checklist" className="gap-1"><CheckSquare className="h-3.5 w-3.5" /> Checklist</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-4 mt-4">
          <div className="flex justify-end"><AddStatTestDialog /></div>
          {isLoading ? <Skeleton className="h-60" /> : tests?.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">No statistical tests logged yet.</CardContent></Card>
          ) : (
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test</TableHead>
                      <TableHead>Comparison</TableHead>
                      <TableHead className="text-right">Statistic</TableHead>
                      <TableHead className="text-right">p-value</TableHead>
                      <TableHead>Sig.</TableHead>
                      <TableHead>CI</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tests?.map(t => (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium text-sm">{t.test_name}</TableCell>
                        <TableCell className="text-xs">{t.comparison}</TableCell>
                        <TableCell className="text-right font-mono text-xs">{fmt(t.test_statistic)}</TableCell>
                        <TableCell className="text-right font-mono text-xs">{fmtP(t.p_value)}</TableCell>
                        <TableCell>{t.significant ? <Badge variant="default" className="text-[10px]">Yes</Badge> : <Badge variant="outline" className="text-[10px]">No</Badge>}</TableCell>
                        <TableCell className="font-mono text-xs">{t.confidence_interval || "—"}</TableCell>
                        <TableCell><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => del.mutate(t.id, { onSuccess: () => toast.success("Deleted") })}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="checklist" className="mt-4"><ValidationChecklist /></TabsContent>
      </Tabs>
    </div>
  );
}
