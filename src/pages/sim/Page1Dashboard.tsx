import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PAPER_META } from "@/data/simulationData";
import { Users, FlaskConical, Database, BarChart3, Clock, FileText } from "lucide-react";

export default function Page1Dashboard() {
  const weekProgress = Math.round((PAPER_META.currentWeek / PAPER_META.totalWeeks) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Paper Header */}
      <div className="space-y-3">
        <Badge variant="outline" className="text-xs font-mono">MDPI AI · 2025 · Research Paper</Badge>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">{PAPER_META.title}</h1>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
          {PAPER_META.authors.map((a, i) => (
            <span key={i} className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span className="font-medium text-foreground">{a.name}</span>
              {a.corresponding && <span className="text-xs text-primary">*</span>}
              {a.orcid && (
                <a href={`https://orcid.org/${a.orcid}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-mono">
                  ({a.orcid})
                </a>
              )}
            </span>
          ))}
        </div>
        <div className="text-xs text-muted-foreground space-y-0.5">
          <p><span className="font-mono text-muted-foreground/70">[1]</span> {PAPER_META.authors[0].affiliation}</p>
          <p className="mt-1 text-xs">* Correspondence: calebgunalan2005@gmail.com; deepa.kumar@klu.ac.in</p>
        </div>
      </div>

      {/* Status & Timeline */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Project Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Week {PAPER_META.currentWeek} of {PAPER_META.totalWeeks}</span>
              <span className="font-mono text-muted-foreground">{weekProgress}%</span>
            </div>
            <Progress value={weekProgress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Literature Review</span>
              <span>Writing & Submission</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Submission Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{PAPER_META.status}</Badge>
              <span className="text-sm text-muted-foreground">→ {PAPER_META.journal}</span>
            </div>
            <p className="text-xs text-muted-foreground">Target: Q4 2025 submission window</p>
          </CardContent>
        </Card>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Database, label: "Clients", value: PAPER_META.keyStats.clients },
          { icon: FlaskConical, label: "Architectures", value: PAPER_META.keyStats.architectures },
          { icon: BarChart3, label: "Federation Scenarios", value: PAPER_META.keyStats.scenarios },
          { icon: FlaskConical, label: "Total Experiments", value: PAPER_META.keyStats.experiments },
        ].map((s, i) => (
          <Card key={i}>
            <CardContent className="pt-6 text-center">
              <s.icon className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold font-mono">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Keywords */}
      <div className="flex flex-wrap gap-2">
        {PAPER_META.keywords.map((kw, i) => (
          <Badge key={i} variant="secondary" className="text-xs">{kw}</Badge>
        ))}
      </div>

      {/* Abstract */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Abstract</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">{PAPER_META.abstract}</p>
        </CardContent>
      </Card>
    </div>
  );
}
