import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, BookOpen, Target, X } from "lucide-react";
import { toast } from "sonner";
import {
  usePapers, useAddPaper, useDeletePaper,
  useGapStatement, useUpsertGapStatement,
  CIRCLES, Paper,
} from "@/hooks/useLiterature";

const GAP_CHECKLIST_LABELS: Record<string, string> = {
  identifies_fl_gap: "Identifies FL application gap",
  mentions_insider_threat: "Mentions insider threat detection",
  addresses_heterogeneity: "Addresses cross-org heterogeneity",
  cites_privacy_constraint: "Cites privacy / data-sharing constraint",
  differentiates_from_existing: "Differentiates from existing work",
};

function AddPaperDialog() {
  const [open, setOpen] = useState(false);
  const addPaper = useAddPaper();
  const [form, setForm] = useState({
    title: "", authors: "", year: "" as string, source: "",
    circle: "fl_methodology", tags: "", key_takeaways: "", relevance_notes: "",
  });

  const handleSubmit = () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    addPaper.mutate(
      {
        title: form.title,
        authors: form.authors,
        year: form.year ? Number(form.year) : null,
        source: form.source,
        circle: form.circle,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        key_takeaways: form.key_takeaways,
        relevance_notes: form.relevance_notes,
      },
      {
        onSuccess: () => {
          toast.success("Paper added");
          setForm({ title: "", authors: "", year: "", source: "", circle: "fl_methodology", tags: "", key_takeaways: "", relevance_notes: "" });
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Paper</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Add Literature Paper</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Paper title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <Input placeholder="Authors" value={form.authors} onChange={e => setForm(f => ({ ...f, authors: e.target.value }))} />
          <div className="flex gap-2">
            <Input placeholder="Year" type="number" className="w-28" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} />
            <Input placeholder="Source (journal, conference...)" className="flex-1" value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} />
          </div>
          <Select value={form.circle} onValueChange={v => setForm(f => ({ ...f, circle: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CIRCLES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input placeholder="Tags (comma-separated)" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
          <Textarea placeholder="Key takeaways" value={form.key_takeaways} onChange={e => setForm(f => ({ ...f, key_takeaways: e.target.value }))} />
          <Textarea placeholder="Relevance notes" value={form.relevance_notes} onChange={e => setForm(f => ({ ...f, relevance_notes: e.target.value }))} />
          <Button onClick={handleSubmit} disabled={addPaper.isPending} className="w-full">
            {addPaper.isPending ? "Adding..." : "Add Paper"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PaperCard({ paper }: { paper: Paper }) {
  const deletePaper = useDeletePaper();
  const circleLabel = CIRCLES.find(c => c.value === paper.circle)?.label ?? paper.circle;

  return (
    <Card className="group">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm leading-tight">{paper.title}</h4>
            {paper.authors && <p className="text-xs text-muted-foreground mt-0.5">{paper.authors}{paper.year ? ` (${paper.year})` : ""}</p>}
          </div>
          <Button
            variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            onClick={() => deletePaper.mutate(paper.id, { onSuccess: () => toast.success("Deleted") })}
          >
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-[10px]">{circleLabel}</Badge>
          {paper.tags?.map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
        </div>
        {paper.key_takeaways && <p className="text-xs text-muted-foreground line-clamp-2">{paper.key_takeaways}</p>}
      </CardContent>
    </Card>
  );
}

function GapStatementBuilder() {
  const { data: gap, isLoading } = useGapStatement();
  const upsert = useUpsertGapStatement();
  const [content, setContent] = useState("");
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [initialized, setInitialized] = useState(false);

  if (!initialized && gap !== undefined) {
    setContent(gap?.content ?? "");
    setChecklist(gap?.checklist ?? Object.fromEntries(Object.keys(GAP_CHECKLIST_LABELS).map(k => [k, false])));
    setInitialized(true);
  }

  if (isLoading) return <Skeleton className="h-48" />;

  const handleSave = () => {
    upsert.mutate({ content, checklist }, { onSuccess: () => toast.success("Gap statement saved") });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2"><Target className="h-4 w-4" /> Gap Statement Builder</CardTitle>
        <CardDescription>Craft the spine of your paper — the gap your research fills.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="While federated learning has been applied to network intrusion detection and malware classification, its application to insider threat detection across organizationally heterogeneous clients..."
          className="min-h-[140px] text-sm"
        />
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Strength Checklist</p>
          {Object.entries(GAP_CHECKLIST_LABELS).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={checklist[key] ?? false}
                onCheckedChange={v => setChecklist(c => ({ ...c, [key]: !!v }))}
              />
              {label}
            </label>
          ))}
        </div>
        <Button onClick={handleSave} disabled={upsert.isPending} size="sm">
          {upsert.isPending ? "Saving..." : "Save Gap Statement"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Phase1Page() {
  const { data: papers, isLoading } = usePapers();
  const [activeCircle, setActiveCircle] = useState("all");

  const filtered = activeCircle === "all" ? papers : papers?.filter(p => p.circle === activeCircle);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">Phase 1 · Weeks 1–3</p>
        <h1 className="text-2xl font-bold tracking-tight">Deep Literature Foundation</h1>
        <p className="text-muted-foreground mt-1">
          Build your reading foundation across FL methodology, insider threat detection, and FL in cybersecurity.
        </p>
      </div>

      <Tabs defaultValue="papers">
        <TabsList>
          <TabsTrigger value="papers" className="gap-1"><BookOpen className="h-3.5 w-3.5" /> Papers</TabsTrigger>
          <TabsTrigger value="gap" className="gap-1"><Target className="h-3.5 w-3.5" /> Gap Statement</TabsTrigger>
        </TabsList>

        <TabsContent value="papers" className="space-y-4 mt-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-1 flex-wrap">
              <Badge
                variant={activeCircle === "all" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveCircle("all")}
              >All</Badge>
              {CIRCLES.map(c => (
                <Badge
                  key={c.value}
                  variant={activeCircle === c.value ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setActiveCircle(c.value)}
                >{c.label}</Badge>
              ))}
            </div>
            <AddPaperDialog />
          </div>

          {isLoading ? (
            <div className="grid gap-3 md:grid-cols-2">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
            </div>
          ) : filtered?.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">No papers yet. Add your first reading.</CardContent></Card>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {filtered?.map(p => <PaperCard key={p.id} paper={p} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="gap" className="mt-4">
          <GapStatementBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}
