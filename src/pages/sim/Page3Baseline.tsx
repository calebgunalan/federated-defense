import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BASELINE_RESULTS } from "@/data/simulationData";

export default function Page3Baseline() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <Badge variant="outline" className="text-xs font-mono mb-2">Page 3</Badge>
        <h1 className="text-2xl font-bold tracking-tight">Baseline Architecture Comparison</h1>
        <p className="text-muted-foreground mt-1">Centralized baseline results to identify top-performing architectures for federated deployment.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Table 2 — Centralized Baseline Performance</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead className="text-right">Parameters (M)</TableHead>
                <TableHead className="text-right">Accuracy (%)</TableHead>
                <TableHead className="text-right">F1-Score (%)</TableHead>
                <TableHead className="text-right">Precision (%)</TableHead>
                <TableHead className="text-right">Recall (%)</TableHead>
                <TableHead className="text-right">AUC-ROC</TableHead>
                <TableHead className="text-right">Epochs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BASELINE_RESULTS.map((r, i) => (
                <TableRow key={i} className={r.selected ? "font-medium" : "text-muted-foreground"}>
                  <TableCell className={r.selected ? "font-bold" : ""}>{r.model}{r.selected && " ✓"}</TableCell>
                  <TableCell className="text-right font-mono">{r.params}</TableCell>
                  <TableCell className="text-right font-mono">{r.accuracy}</TableCell>
                  <TableCell className="text-right font-mono">{r.f1}</TableCell>
                  <TableCell className="text-right font-mono">{r.precision}</TableCell>
                  <TableCell className="text-right font-mono">{r.recall}</TableCell>
                  <TableCell className="text-right font-mono">{r.aucRoc}</TableCell>
                  <TableCell className="text-right font-mono">{r.epochs}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Architecture Selection Rationale</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Based on the centralized baseline evaluation, <strong className="text-foreground">LSTM</strong>, <strong className="text-foreground">1D-CNN</strong>, and <strong className="text-foreground">MLP</strong> were selected as the top three architectures for subsequent federated learning experiments. LSTM achieved the highest overall accuracy (76.4%) and AUC-ROC (0.887), demonstrating its capacity to capture temporal dependencies in sequential behavioral data. The 1D-CNN, while slightly behind LSTM in accuracy (74.8%), offered a compelling alternative by treating feature sequences as signals and detecting behavioral bursts with fewer parameters than LSTM. MLP, despite its simplicity, delivered competitive results (73.1% accuracy) with the smallest parameter footprint (0.89M), making it an efficient baseline for resource-constrained deployment scenarios. The Autoencoder, while conceptually appealing for unsupervised anomaly detection, yielded the lowest discriminative performance (71.3% accuracy, 0.842 AUC-ROC) under supervised evaluation conditions and was therefore excluded from the federated experiments. This selection balances accuracy, parameter efficiency, and architectural diversity to provide a comprehensive comparison under federated conditions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
