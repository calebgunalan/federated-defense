import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Send, Users, MessageSquare, CheckSquare } from "lucide-react";
import { toast } from "sonner";
import {
  useReviewerSuggestions, useAddReviewer, useDeleteReviewer,
  useRevisionLog, useAddRevisionEntry, useUpdateRevisionEntry, useDeleteRevisionEntry,
} from "@/hooks/usePhases6to9";
import { useChecklist, useAddChecklistItem, useToggleChecklistItem, useDeleteChecklistItem } from "@/hooks/useDatasetDesign";

function SubmissionChecklist() {
  const { data: items, isLoading } = useChecklist(9);
  const addItem = useAddChecklistItem();
  const toggleItem = useToggleChecklistItem();
  const deleteItem = useDeleteChecklistItem();
  const [newLabel, setNewLabel] = useState("");

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    addItem.mutate({ phase_number: 9, label: newLabel, sort_order: (items?.length ?? 0) }, { onSuccess: () => { toast.success("Added"); setNewLabel(""); } });
  };

  if (isLoading) return <Skeleton className="h-40" />;

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Pre-Submission Checklist</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {items?.map(item => (
          <div key={item.id} className="flex items-center gap-2 group">
            <Checkbox checked={item.checked} onCheckedChange={v => toggleItem.mutate({ id: item.id, checked: !!v, phase_number: 9 })} />
            <span className={`text-sm flex-1 ${item.checked ? "line-through text-muted-foreground" : ""}`}>{item.label}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteItem.mutate({ id: item.id, phase_number: 9 })}><Trash2 className="h-3 w-3 text-destructive" /></Button>
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

function ReviewersTab() {
  const { data: reviewers, isLoading } = useReviewerSuggestions();
  const add = useAddReviewer();
  const del = useDeleteReviewer();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", affiliation: "", relevant_papers: "", email: "", notes: "" });

  const handleSubmit = () => {
    if (!form.name.trim()) { toast.error("Name required"); return; }
    add.mutate(form, { onSuccess: () => { toast.success("Reviewer added"); setForm({ name: "", affiliation: "", relevant_papers: "", email: "", notes: "" }); setOpen(false); } });
  };

  if (isLoading) return <Skeleton className="h-40" />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Reviewer</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Suggest a Reviewer</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <Input placeholder="Affiliation" value={form.affiliation} onChange={e => setForm(f => ({ ...f, affiliation: e.target.value }))} />
              <Input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              <Textarea placeholder="Relevant papers" value={form.relevant_papers} onChange={e => setForm(f => ({ ...f, relevant_papers: e.target.value }))} />
              <Textarea placeholder="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              <Button onClick={handleSubmit} disabled={add.isPending} className="w-full">{add.isPending ? "Adding..." : "Add Reviewer"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {reviewers?.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">No reviewers suggested yet.</CardContent></Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {reviewers?.map(r => (
            <Card key={r.id} className="group">
              <CardContent className="p-4 space-y-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-sm">{r.name}</h4>
                    {r.affiliation && <p className="text-xs text-muted-foreground">{r.affiliation}</p>}
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={() => del.mutate(r.id, { onSuccess: () => toast.success("Deleted") })}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                </div>
                {r.relevant_papers && <p className="text-xs text-muted-foreground italic">{r.relevant_papers}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function RevisionLogTab() {
  const { data: entries, isLoading } = useRevisionLog();
  const add = useAddRevisionEntry();
  const update = useUpdateRevisionEntry();
  const del = useDeleteRevisionEntry();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ round_number: "1", reviewer_comment: "", response: "", status: "pending" });

  const handleSubmit = () => {
    if (!form.reviewer_comment.trim()) { toast.error("Comment required"); return; }
    add.mutate({ round_number: Number(form.round_number), reviewer_comment: form.reviewer_comment, response: form.response, status: form.status }, {
      onSuccess: () => { toast.success("Entry added"); setForm({ round_number: "1", reviewer_comment: "", response: "", status: "pending" }); setOpen(false); },
    });
  };

  if (isLoading) return <Skeleton className="h-40" />;

  const statusBadge: Record<string, { label: string; variant: "outline" | "default" | "secondary" }> = {
    pending: { label: "Pending", variant: "outline" },
    addressed: { label: "Addressed", variant: "default" },
    disputed: { label: "Disputed", variant: "secondary" },
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Entry</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Revision Entry</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Round #" type="number" value={form.round_number} onChange={e => setForm(f => ({ ...f, round_number: e.target.value }))} />
              <Textarea placeholder="Reviewer comment *" value={form.reviewer_comment} onChange={e => setForm(f => ({ ...f, reviewer_comment: e.target.value }))} />
              <Textarea placeholder="Your response" value={form.response} onChange={e => setForm(f => ({ ...f, response: e.target.value }))} />
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="addressed">Addressed</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSubmit} disabled={add.isPending} className="w-full">{add.isPending ? "Adding..." : "Add Entry"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {entries?.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">No revision entries yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {entries?.map(e => {
            const b = statusBadge[e.status] ?? statusBadge.pending;
            return (
              <Card key={e.id} className="group">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">Round {e.round_number}</Badge>
                      <Badge variant={b.variant} className="text-[10px]">{b.label}</Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => del.mutate(e.id, { onSuccess: () => toast.success("Deleted") })}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Reviewer:</p>
                    <p className="text-sm">{e.reviewer_comment}</p>
                  </div>
                  {e.response && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Response:</p>
                      <p className="text-sm">{e.response}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Phase9Page() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">Phase 9 · Weeks 20–22</p>
        <h1 className="text-2xl font-bold tracking-tight">Submission & Review</h1>
        <p className="text-muted-foreground mt-1">Prepare submission package, track review, manage point-by-point revision responses.</p>
      </div>

      <Tabs defaultValue="checklist">
        <TabsList>
          <TabsTrigger value="checklist" className="gap-1"><CheckSquare className="h-3.5 w-3.5" /> Checklist</TabsTrigger>
          <TabsTrigger value="reviewers" className="gap-1"><Users className="h-3.5 w-3.5" /> Reviewers</TabsTrigger>
          <TabsTrigger value="revisions" className="gap-1"><MessageSquare className="h-3.5 w-3.5" /> Revision Log</TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="mt-4"><SubmissionChecklist /></TabsContent>
        <TabsContent value="reviewers" className="mt-4"><ReviewersTab /></TabsContent>
        <TabsContent value="revisions" className="mt-4"><RevisionLogTab /></TabsContent>
      </Tabs>
    </div>
  );
}
