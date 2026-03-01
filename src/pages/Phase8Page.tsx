import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Plus, PenTool, Save } from "lucide-react";
import { toast } from "sonner";
import { useWritingSections, useAddWritingSection, useUpdateWritingSection } from "@/hooks/usePhases6to9";
import { useAuth } from "@/contexts/AuthContext";

const MDPI_SECTIONS = [
  { name: "Abstract", order: 0, points: ["Summarize problem, method, key results", "Under 250 words"] },
  { name: "Introduction", order: 1, points: ["P1: Insider threat landscape", "P2: ML + data sharing obstacle", "P3: FL as solution", "P4: Numbered contributions"] },
  { name: "Related Work", order: 2, points: ["Centralized ML for insider threats", "FL in cybersecurity", "FL aggregation under non-IID"] },
  { name: "Materials & Methods", order: 3, points: ["Dataset description", "Client partition design", "Feature engineering", "FL setup with Flower"] },
  { name: "Experiments & Results", order: 4, points: ["Centralized baselines", "Two-client pairings", "Three-client federation", "µ sensitivity", "Ablation"] },
  { name: "Discussion", order: 5, points: ["Why FedProx outperforms", "Which clients benefit most", "Limitations", "Future work"] },
  { name: "Conclusions", order: 6, points: ["Restate contributions", "Practical implications", "Call to action"] },
];

const STATUS_OPTIONS = ["not_started", "draft", "review", "final"];
const statusBadge: Record<string, { label: string; variant: "outline" | "default" | "secondary" }> = {
  not_started: { label: "Not Started", variant: "outline" },
  draft: { label: "Draft", variant: "default" },
  review: { label: "Review", variant: "secondary" },
  final: { label: "Final", variant: "secondary" },
};

export default function Phase8Page() {
  const { data: sections, isLoading } = useWritingSections();
  const addSection = useAddWritingSection();
  const updateSection = useUpdateWritingSection();
  const { user } = useAuth();
  const [initialized, setInitialized] = useState(false);

  // Auto-initialize MDPI sections on first visit
  useEffect(() => {
    if (sections && sections.length === 0 && user && !initialized) {
      setInitialized(true);
      MDPI_SECTIONS.forEach(s => {
        addSection.mutate({
          section_name: s.name,
          section_order: s.order,
          key_points: s.points.map(p => ({ text: p, done: false })),
        });
      });
    }
  }, [sections, user, initialized]);

  const totalSections = sections?.length ?? 0;
  const completedSections = sections?.filter(s => s.status === "final").length ?? 0;
  const overallProgress = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">Phase 8 · Weeks 16–20</p>
        <h1 className="text-2xl font-bold tracking-tight">Writing the Paper</h1>
        <p className="text-muted-foreground mt-1">MDPI format: Abstract → Introduction → Related Work → Methods → Results → Discussion → Conclusions.</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Writing Progress</span>
            <span className="text-sm font-mono text-muted-foreground">{completedSections}/{totalSections} sections final</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-40" />)}</div>
      ) : (
        <div className="space-y-4">
          {sections?.map(section => (
            <SectionCard key={section.id} section={section} onUpdate={updateSection.mutate} />
          ))}
        </div>
      )}
    </div>
  );
}

function SectionCard({ section, onUpdate }: { section: any; onUpdate: (data: any) => void }) {
  const [status, setStatus] = useState(section.status);
  const [wordCount, setWordCount] = useState(section.word_count);
  const [notes, setNotes] = useState(section.notes ?? "");
  const [dirty, setDirty] = useState(false);

  const handleSave = () => {
    onUpdate({ id: section.id, status, word_count: wordCount, notes });
    setDirty(false);
    toast.success(`${section.section_name} updated`);
  };

  const badge = statusBadge[status] ?? statusBadge.not_started;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <PenTool className="h-4 w-4" />
            {section.section_name}
          </CardTitle>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {section.key_points && section.key_points.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Key Points</p>
            <ul className="text-xs text-muted-foreground space-y-0.5">
              {(section.key_points as { text: string; done: boolean }[]).map((kp, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-muted-foreground shrink-0" />
                  {kp.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground">Status</label>
            <Select value={status} onValueChange={v => { setStatus(v); setDirty(true); }}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{STATUS_OPTIONS.map(s => <SelectItem key={s} value={s} className="capitalize">{statusBadge[s]?.label ?? s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="w-28">
            <label className="text-xs font-medium text-muted-foreground">Words</label>
            <Input type="number" className="mt-1" value={wordCount} onChange={e => { setWordCount(Number(e.target.value)); setDirty(true); }} />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Notes</label>
          <Textarea value={notes} onChange={e => { setNotes(e.target.value); setDirty(true); }} placeholder="Section notes..." className="mt-1 text-sm min-h-[80px]" />
        </div>

        {dirty && (
          <Button onClick={handleSave} size="sm" className="gap-1">
            <Save className="h-3.5 w-3.5" /> Save
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
