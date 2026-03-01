import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Database, Users, BarChart3, CheckSquare } from "lucide-react";
import { toast } from "sonner";
import {
  useDatasets, useAddDataset, useDeleteDataset,
  useClientPartitions, useAddClientPartition, useDeleteClientPartition,
  useJsdMeasurements, useAddJsdMeasurement, useDeleteJsdMeasurement,
  useChecklist, useAddChecklistItem, useToggleChecklistItem, useDeleteChecklistItem,
} from "@/hooks/useDatasetDesign";

function AddDatasetDialog() {
  const [open, setOpen] = useState(false);
  const add = useAddDataset();
  const [form, setForm] = useState({ name: "", description: "", rationale: "", source_url: "" });

  const handleSubmit = () => {
    if (!form.name.trim()) { toast.error("Name required"); return; }
    add.mutate(form, {
      onSuccess: () => { toast.success("Dataset added"); setForm({ name: "", description: "", rationale: "", source_url: "" }); setOpen(false); },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Dataset</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Dataset</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Dataset name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <Textarea placeholder="Why this dataset? (rationale)" value={form.rationale} onChange={e => setForm(f => ({ ...f, rationale: e.target.value }))} />
          <Input placeholder="Source URL" value={form.source_url} onChange={e => setForm(f => ({ ...f, source_url: e.target.value }))} />
          <Button onClick={handleSubmit} disabled={add.isPending} className="w-full">{add.isPending ? "Adding..." : "Add Dataset"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DatasetsTab() {
  const { data: datasets, isLoading } = useDatasets();
  const del = useDeleteDataset();

  if (isLoading) return <Skeleton className="h-40" />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><AddDatasetDialog /></div>
      {datasets?.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">No datasets documented yet.</CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {datasets?.map(d => (
            <Card key={d.id} className="group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{d.name}</h4>
                    {d.description && <p className="text-xs text-muted-foreground mt-1">{d.description}</p>}
                    {d.rationale && <p className="text-xs text-muted-foreground mt-1 italic">Rationale: {d.rationale}</p>}
                    {d.source_url && <a href={d.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">{d.source_url}</a>}
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={() => del.mutate(d.id, { onSuccess: () => toast.success("Deleted") })}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function AddPartitionDialog() {
  const [open, setOpen] = useState(false);
  const add = useAddClientPartition();
  const [form, setForm] = useState({ name: "", org_type: "", characteristics: "", role_distribution: "", notes: "" });

  const handleSubmit = () => {
    if (!form.name.trim()) { toast.error("Name required"); return; }
    add.mutate(form, {
      onSuccess: () => { toast.success("Client added"); setForm({ name: "", org_type: "", characteristics: "", role_distribution: "", notes: "" }); setOpen(false); },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Client</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Client Partition</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Client name * (e.g. Client A)" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input placeholder="Organization type (e.g. Financial Firm)" value={form.org_type} onChange={e => setForm(f => ({ ...f, org_type: e.target.value }))} />
          <Textarea placeholder="Key characteristics (e.g. high USB and remote access activity)" value={form.characteristics} onChange={e => setForm(f => ({ ...f, characteristics: e.target.value }))} />
          <Textarea placeholder="Role distribution (e.g. many privileged IT admins)" value={form.role_distribution} onChange={e => setForm(f => ({ ...f, role_distribution: e.target.value }))} />
          <Textarea placeholder="Additional notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <Button onClick={handleSubmit} disabled={add.isPending} className="w-full">{add.isPending ? "Adding..." : "Add Client"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ClientPartitionsTab() {
  const { data: partitions, isLoading } = useClientPartitions();
  const del = useDeleteClientPartition();

  if (isLoading) return <Skeleton className="h-40" />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><AddPartitionDialog /></div>
      {partitions?.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">No client partitions defined yet.</CardContent></Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {partitions?.map(p => (
            <Card key={p.id} className="group">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-sm">{p.name}</h4>
                    {p.org_type && <Badge variant="outline" className="text-[10px] mt-1">{p.org_type}</Badge>}
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={() => del.mutate(p.id, { onSuccess: () => toast.success("Deleted") })}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
                {p.characteristics && <p className="text-xs text-muted-foreground">{p.characteristics}</p>}
                {p.role_distribution && <p className="text-xs text-muted-foreground italic">{p.role_distribution}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function JsdTab() {
  const { data: measurements, isLoading } = useJsdMeasurements();
  const add = useAddJsdMeasurement();
  const del = useDeleteJsdMeasurement();
  const [form, setForm] = useState({ client_a: "", client_b: "", jsd_value: "", notes: "" });

  const handleAdd = () => {
    if (!form.client_a || !form.client_b) { toast.error("Both clients required"); return; }
    add.mutate(
      { client_a: form.client_a, client_b: form.client_b, jsd_value: form.jsd_value ? Number(form.jsd_value) : null, notes: form.notes },
      { onSuccess: () => { toast.success("JSD recorded"); setForm({ client_a: "", client_b: "", jsd_value: "", notes: "" }); } }
    );
  };

  if (isLoading) return <Skeleton className="h-40" />;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Record JSD Measurement</CardTitle>
          <CardDescription>Jensen-Shannon Divergence between client pairs to quantify non-IID heterogeneity.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 items-end">
            <Input placeholder="Client A" className="w-32" value={form.client_a} onChange={e => setForm(f => ({ ...f, client_a: e.target.value }))} />
            <Input placeholder="Client B" className="w-32" value={form.client_b} onChange={e => setForm(f => ({ ...f, client_b: e.target.value }))} />
            <Input placeholder="JSD value" type="number" step="0.0001" className="w-28" value={form.jsd_value} onChange={e => setForm(f => ({ ...f, jsd_value: e.target.value }))} />
            <Input placeholder="Notes" className="flex-1 min-w-[150px]" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            <Button onClick={handleAdd} disabled={add.isPending} size="sm">Add</Button>
          </div>
        </CardContent>
      </Card>

      {measurements && measurements.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client A</TableHead>
                  <TableHead>Client B</TableHead>
                  <TableHead>JSD</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {measurements.map(m => (
                  <TableRow key={m.id}>
                    <TableCell className="font-mono text-xs">{m.client_a}</TableCell>
                    <TableCell className="font-mono text-xs">{m.client_b}</TableCell>
                    <TableCell className="font-mono text-xs">{m.jsd_value ?? "—"}</TableCell>
                    <TableCell className="text-xs">{m.notes}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => del.mutate(m.id, { onSuccess: () => toast.success("Deleted") })}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </TableCell>
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

function PrepChecklistTab() {
  const { data: items, isLoading } = useChecklist(2);
  const addItem = useAddChecklistItem();
  const toggleItem = useToggleChecklistItem();
  const deleteItem = useDeleteChecklistItem();
  const [newLabel, setNewLabel] = useState("");

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    addItem.mutate(
      { phase_number: 2, label: newLabel, sort_order: (items?.length ?? 0) },
      { onSuccess: () => { toast.success("Added"); setNewLabel(""); } }
    );
  };

  if (isLoading) return <Skeleton className="h-40" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Dataset Preparation Checklist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items?.map(item => (
          <div key={item.id} className="flex items-center gap-2 group">
            <Checkbox
              checked={item.checked}
              onCheckedChange={v => toggleItem.mutate({ id: item.id, checked: !!v, phase_number: 2 })}
            />
            <span className={`text-sm flex-1 ${item.checked ? "line-through text-muted-foreground" : ""}`}>{item.label}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteItem.mutate({ id: item.id, phase_number: 2 }, { onSuccess: () => toast.success("Removed") })}>
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2 pt-2">
          <Input
            placeholder="Add checklist item..."
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            className="text-sm"
          />
          <Button size="sm" onClick={handleAdd} disabled={addItem.isPending}>Add</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Phase2Page() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">Phase 2 · Weeks 3–5</p>
        <h1 className="text-2xl font-bold tracking-tight">Dataset Selection & Heterogeneity Design</h1>
        <p className="text-muted-foreground mt-1">
          Select datasets, design client partitions, and quantify non-IID heterogeneity via JSD.
        </p>
      </div>

      <Tabs defaultValue="datasets">
        <TabsList>
          <TabsTrigger value="datasets" className="gap-1"><Database className="h-3.5 w-3.5" /> Datasets</TabsTrigger>
          <TabsTrigger value="partitions" className="gap-1"><Users className="h-3.5 w-3.5" /> Client Partitions</TabsTrigger>
          <TabsTrigger value="jsd" className="gap-1"><BarChart3 className="h-3.5 w-3.5" /> JSD Log</TabsTrigger>
          <TabsTrigger value="checklist" className="gap-1"><CheckSquare className="h-3.5 w-3.5" /> Checklist</TabsTrigger>
        </TabsList>

        <TabsContent value="datasets" className="mt-4"><DatasetsTab /></TabsContent>
        <TabsContent value="partitions" className="mt-4"><ClientPartitionsTab /></TabsContent>
        <TabsContent value="jsd" className="mt-4"><JsdTab /></TabsContent>
        <TabsContent value="checklist" className="mt-4"><PrepChecklistTab /></TabsContent>
      </Tabs>
    </div>
  );
}
