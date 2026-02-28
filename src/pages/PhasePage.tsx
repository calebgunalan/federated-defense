import { useParams, Navigate } from "react-router-dom";
import { usePhases, useUpdatePhase, getWeekRange, Phase } from "@/hooks/usePhases";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const PHASE_DESCRIPTIONS: Record<number, string> = {
  1: "Build your literature foundation across FL methodology, insider threat detection, and FL in cybersecurity. Craft your gap statement.",
  2: "Select and partition datasets (CERT, LANL). Design client profiles and measure non-IID heterogeneity via JSD.",
  3: "Extract behavioral features from raw logs. Choose time windows, handle class imbalance, build preprocessing pipeline.",
  4: "Compare LSTM, MLP, 1D CNN, and Autoencoder architectures. Run centralized baselines and select top models.",
  5: "Implement FL experiments using Flower. Run FedAvg vs FedProx across all client pairings. µ sensitivity analysis.",
  6: "Test threshold calibration: global, per-client local, and federated calibration configurations.",
  7: "Run McNemar's test, bootstrap CIs. Compute ROC curves. Validate statistical significance of results.",
  8: "Write the MDPI-format paper: Abstract, Introduction, Related Work, Methods, Results, Discussion, Conclusions.",
  9: "Prepare submission package: manuscript, cover letter, suggested reviewers. Track review and revision process.",
};

export default function PhasePage() {
  const { phaseNumber } = useParams();
  const num = Number(phaseNumber);
  const { data: phases, isLoading } = usePhases();
  const updatePhase = useUpdatePhase();

  const phase = phases?.find((p) => p.phase_number === num);

  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<string>("not_started");
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    if (phase) {
      setNotes(phase.notes || "");
      setStatus(phase.status);
      setCompletion(phase.completion_percentage);
    }
  }, [phase]);

  if (isNaN(num) || num < 1 || num > 9) return <Navigate to="/" />;

  const handleSave = () => {
    if (!phase) return;
    updatePhase.mutate(
      {
        id: phase.id,
        notes,
        status: status as Phase["status"],
        completion_percentage: completion,
      },
      { onSuccess: () => toast.success("Phase updated!") }
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!phase) return <Navigate to="/" />;

  const statusBadge: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
    not_started: { label: "Not Started", variant: "outline" },
    in_progress: { label: "In Progress", variant: "default" },
    complete: { label: "Complete", variant: "secondary" },
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">
          Phase {num} · {getWeekRange(num)}
        </p>
        <h1 className="text-2xl font-bold tracking-tight">{phase.title}</h1>
        <p className="text-muted-foreground mt-1">{PHASE_DESCRIPTIONS[num]}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progress & Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Status</label>
              <Badge variant={statusBadge[status]?.variant}>{statusBadge[status]?.label}</Badge>
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Completion</label>
              <span className="text-sm font-mono text-muted-foreground">{completion}%</span>
            </div>
            <Slider value={[completion]} onValueChange={([v]) => setCompletion(v)} max={100} step={5} />
            <Progress value={completion} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notes & Progress Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Track your progress, key findings, decisions, and observations for this phase..."
            className="min-h-[200px] font-mono text-sm"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updatePhase.isPending}>
          {updatePhase.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
