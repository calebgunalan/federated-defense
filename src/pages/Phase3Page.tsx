import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Cpu, CheckSquare } from "lucide-react";
import { toast } from "sonner";
import { useFeatures, useAddFeature, useDeleteFeature } from "@/hooks/useFeatureEngineering";
import { useChecklist, useAddChecklistItem, useToggleChecklistItem, useDeleteChecklistItem } from "@/hooks/useDatasetDesign";
import { Checkbox } from "@/components/ui/checkbox";

const CATEGORIES = ["behavioral", "temporal", "network", "file_access", "email", "device", "other"];
const TIME_WINDOWS = ["daily", "weekly", "hourly", "session"];

function AddFeatureDialog() {
  const [open, setOpen] = useState(false);
  const add = useAddFeature();
  const [form, setForm] = useState({ name: "", description: "", category: "behavioral", time_window: "daily", notes: "" });

  const handleSubmit = () => {
    if (!form.name.trim()) { toast.error("Name required"); return; }
    add.mutate(form, { onSuccess: () => { toast.success("Feature added"); setForm({ name: "", description: "", category: "behavioral", time_window: "daily", notes: "" }); setOpen(false); } });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Feature</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Behavioral Feature</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Feature name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <div className="flex gap-2">
            <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={form.time_window} onValueChange={v => setForm(f => ({ ...f, time_window: v }))}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>{TIME_WINDOWS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Textarea placeholder="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <Button onClick={handleSubmit} disabled={add.isPending} className="w-full">{add.isPending ? "Adding..." : "Add Feature"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PrepChecklistTab() {
  const { data: items, isLoading } = useChecklist(3);
  const addItem = useAddChecklistItem();
  const toggleItem = useToggleChecklistItem();
  const deleteItem = useDeleteChecklistItem();
  const [newLabel, setNewLabel] = useState("");

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    addItem.mutate({ phase_number: 3, label: newLabel, sort_order: (items?.length ?? 0) }, { onSuccess: () => { toast.success("Added"); setNewLabel(""); } });
  };

  if (isLoading) return <Skeleton className="h-40" />;

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Preprocessing Pipeline Checklist</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {items?.map(item => (
          <div key={item.id} className="flex items-center gap-2 group">
            <Checkbox checked={item.checked} onCheckedChange={v => toggleItem.mutate({ id: item.id, checked: !!v, phase_number: 3 })} />
            <span className={`text-sm flex-1 ${item.checked ? "line-through text-muted-foreground" : ""}`}>{item.label}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteItem.mutate({ id: item.id, phase_number: 3 })}><Trash2 className="h-3 w-3 text-destructive" /></Button>
          </div>
        ))}
        <div className="flex gap-2 pt-2">
          <Input placeholder="Add checklist item..." value={newLabel} onChange={e => setNewLabel(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()} className="text-sm" />
          <Button size="sm" onClick={handleAdd} disabled={addItem.isPending}>Add</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Phase3Page() {
  const { data: features, isLoading } = useFeatures();
  const del = useDeleteFeature();
  const [filterCat, setFilterCat] = useState("all");

  const filtered = filterCat === "all" ? features : features?.filter(f => f.category === filterCat);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">Phase 3 · Weeks 5–7</p>
        <h1 className="text-2xl font-bold tracking-tight">Feature Engineering & Preprocessing</h1>
        <p className="text-muted-foreground mt-1">Catalog behavioral features, set time windows, and manage your preprocessing pipeline.</p>
      </div>

      <Tabs defaultValue="catalog">
        <TabsList>
          <TabsTrigger value="catalog" className="gap-1"><Cpu className="h-3.5 w-3.5" /> Feature Catalog</TabsTrigger>
          <TabsTrigger value="checklist" className="gap-1"><CheckSquare className="h-3.5 w-3.5" /> Pipeline Checklist</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-4 mt-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-1 flex-wrap">
              <Badge variant={filterCat === "all" ? "default" : "outline"} className="cursor-pointer" onClick={() => setFilterCat("all")}>All</Badge>
              {CATEGORIES.map(c => (
                <Badge key={c} variant={filterCat === c ? "default" : "outline"} className="cursor-pointer capitalize" onClick={() => setFilterCat(c)}>{c.replace("_", " ")}</Badge>
              ))}
            </div>
            <AddFeatureDialog />
          </div>

          {isLoading ? <Skeleton className="h-40" /> : filtered?.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">No features cataloged yet.</CardContent></Card>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {filtered?.map(f => (
                <Card key={f.id} className="group">
                  <CardContent className="p-4 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm">{f.name}</h4>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={() => del.mutate(f.id, { onSuccess: () => toast.success("Deleted") })}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-[10px] capitalize">{f.category.replace("_", " ")}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{f.time_window}</Badge>
                    </div>
                    {f.description && <p className="text-xs text-muted-foreground">{f.description}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="checklist" className="mt-4"><PrepChecklistTab /></TabsContent>
      </Tabs>
    </div>
  );
}
