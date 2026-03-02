import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ABLATION_RESULTS, CONFUSION_MATRICES } from "@/data/simulationData";

function ConfusionMatrix({ title, data }: { title: string; data: { tp: number; fp: number; fn: number; tn: number } }) {
  const total = data.tp + data.fp + data.fn + data.tn;
  const tpRate = ((data.tp / (data.tp + data.fn)) * 100).toFixed(1);
  const tnRate = ((data.tn / (data.tn + data.fp)) * 100).toFixed(1);

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground text-center">{title}</p>
      <div className="grid grid-cols-3 gap-0.5 max-w-[180px] mx-auto text-xs">
        <div />
        <div className="text-center font-mono text-muted-foreground p-1">Pred N</div>
        <div className="text-center font-mono text-muted-foreground p-1">Pred M</div>

        <div className="text-right font-mono text-muted-foreground p-1 flex items-center justify-end">Act N</div>
        <div className="bg-accent/20 rounded p-2 text-center font-mono font-bold">{data.tn}</div>
        <div className="bg-destructive/15 rounded p-2 text-center font-mono">{data.fp}</div>

        <div className="text-right font-mono text-muted-foreground p-1 flex items-center justify-end">Act M</div>
        <div className="bg-destructive/15 rounded p-2 text-center font-mono">{data.fn}</div>
        <div className="bg-primary/20 rounded p-2 text-center font-mono font-bold">{data.tp}</div>
      </div>
      <p className="text-xs text-center text-muted-foreground font-mono">TPR: {tpRate}% · TNR: {tnRate}%</p>
    </div>
  );
}

export default function Page6Ablation() {
  const strategies = ["global", "perClient", "federated"] as const;
  const strategyLabels = ["Global Fixed (τ=0.5)", "Per-Client Local", "Federated Calibration"];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <Badge variant="outline" className="text-xs font-mono mb-2">Page 6</Badge>
        <h1 className="text-2xl font-bold tracking-tight">Ablation Study</h1>
        <p className="text-muted-foreground mt-1">Client-adaptive threshold calibration with MLP + FedProx.</p>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader><CardTitle className="text-base">Table 7 — Threshold Calibration Results</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Threshold Strategy</TableHead>
                <TableHead className="text-right">Acc C1</TableHead>
                <TableHead className="text-right">Acc C2</TableHead>
                <TableHead className="text-right">Acc C3</TableHead>
                <TableHead className="text-right font-bold">Avg F1</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ABLATION_RESULTS.map((r, i) => {
                const isBest = i === 2;
                return (
                  <TableRow key={i} className={isBest ? "bg-primary/5 font-medium" : ""}>
                    <TableCell className="text-sm">{r.strategy}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{r.accC1}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{r.accC2}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{r.accC3}</TableCell>
                    <TableCell className={`text-right font-mono text-xs ${isBest ? "font-bold text-primary" : ""}`}>{r.avgF1}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px]">{r.notes}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Confusion Matrices */}
      <Card>
        <CardHeader><CardTitle className="text-base">Confusion Matrices by Threshold Strategy</CardTitle></CardHeader>
        <CardContent className="space-y-8">
          {strategies.map((strategy, si) => (
            <div key={strategy} className="space-y-3">
              <h3 className="text-sm font-semibold text-center">{strategyLabels[si]}</h3>
              <div className="grid grid-cols-3 gap-6">
                <ConfusionMatrix title="Client 1 (Financial)" data={CONFUSION_MATRICES[strategy].client1} />
                <ConfusionMatrix title="Client 2 (Healthcare)" data={CONFUSION_MATRICES[strategy].client2} />
                <ConfusionMatrix title="Client 3 (Manufacturing)" data={CONFUSION_MATRICES[strategy].client3} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Interpretation */}
      <Card>
        <CardHeader><CardTitle className="text-base">Interpretation</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The ablation study demonstrates that adaptive thresholding is essential for balanced insider threat detection across organizationally heterogeneous clients. The global fixed threshold (τ = 0.5) provides a reasonable baseline but consistently underperforms on clients with different base rates of malicious activity. Per-client locally tuned thresholds improved detection rates by reducing false negatives on imbalanced clients — Client 2 (Healthcare) saw the largest gain, with true positive rate improving from 77.7% to 85.6%. The federated threshold calibration mechanism, where clients share only aggregate calibration statistics (class-conditional score distributions) rather than raw predictions, achieved the best balanced performance with an average F1-score of 72.5% — a 4.2% improvement over the global baseline — without increasing false positive rates. This approach is particularly significant because it maintains the privacy-preserving properties of the federated framework while enabling client-specific decision boundaries.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
