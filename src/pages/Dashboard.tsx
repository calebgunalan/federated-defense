import { usePhases, getWeekRange } from "@/hooks/usePhases";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Database, Cpu, Brain, FlaskConical, Layers, BarChart3, PenTool, Send,
} from "lucide-react";

const PHASE_ICONS = [BookOpen, Database, Cpu, Brain, FlaskConical, Layers, BarChart3, PenTool, Send];

const STATUS_BADGE: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  not_started: { label: "Not Started", variant: "outline" },
  in_progress: { label: "In Progress", variant: "default" },
  complete: { label: "Complete", variant: "secondary" },
};

export default function Dashboard() {
  const { user } = useAuth();
  const { data: phases, isLoading } = usePhases();
  const navigate = useNavigate();

  const overallProgress = phases
    ? Math.round(phases.reduce((sum, p) => sum + p.completion_percentage, 0) / phases.length)
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Research Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Federated Learning for Cross-Organizational Insider Threat Detection
        </p>
      </div>

      {/* Overall progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-mono text-muted-foreground">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2">
            {phases?.filter((p) => p.status === "complete").length ?? 0} of 9 phases complete
          </p>
        </CardContent>
      </Card>

      {/* Phase cards */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {phases?.map((phase) => {
            const Icon = PHASE_ICONS[phase.phase_number - 1];
            const badge = STATUS_BADGE[phase.status];
            return (
              <Card
                key={phase.id}
                className="cursor-pointer hover:border-primary/40 transition-colors"
                onClick={() => navigate(`/phase/${phase.phase_number}`)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-mono text-muted-foreground">Phase {phase.phase_number}</p>
                        <CardTitle className="text-sm">{phase.title}</CardTitle>
                      </div>
                    </div>
                    <Badge variant={badge.variant} className="text-xs">{badge.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{getWeekRange(phase.phase_number)}</span>
                      <span className="font-mono">{phase.completion_percentage}%</span>
                    </div>
                    <Progress value={phase.completion_percentage} className="h-1.5" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
