import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SUBMISSION_CHECKLIST, SUGGESTED_REVIEWERS, COVER_LETTER } from "@/data/simulationData";
import { CheckCircle2, Circle, Users, FileText, Mail } from "lucide-react";

export default function Page9Submission() {
  const completedCount = SUBMISSION_CHECKLIST.filter((c) => c.done).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <Badge variant="outline" className="text-xs font-mono mb-2">Page 9</Badge>
        <h1 className="text-2xl font-bold tracking-tight">Submission Checklist</h1>
        <p className="text-muted-foreground mt-1">Pre-submission requirements for MDPI AI Journal.</p>
      </div>

      {/* Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2"><FileText className="h-4 w-4" /> Submission Requirements</span>
            <Badge variant="secondary" className="font-mono">{completedCount}/{SUBMISSION_CHECKLIST.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {SUBMISSION_CHECKLIST.map((c, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5">
                {c.done ? (
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <span className={`text-sm ${c.done ? "text-foreground" : "text-muted-foreground"}`}>{c.item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Reviewers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" /> Suggested Reviewers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {SUGGESTED_REVIEWERS.map((r, i) => (
              <div key={i} className="border-l-2 border-primary/30 pl-4 space-y-0.5">
                <p className="text-sm font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.affiliation}</p>
                <p className="text-xs text-muted-foreground italic">Key works: {r.papers}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cover Letter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Mail className="h-4 w-4" /> Cover Letter Draft</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed text-muted-foreground bg-muted/30 p-4 rounded-lg">{COVER_LETTER}</pre>
        </CardContent>
      </Card>
    </div>
  );
}
