import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TWO_CLIENT_RESULTS } from "@/data/simulationData";

const INTERPRETATIONS: Record<string, string> = {
  "Client 1 + Client 2": "In the Financial–Healthcare federation, FedProx consistently outperformed FedAvg across all three architectures, with LSTM achieving the highest gains (+2.4% accuracy over FedAvg). The moderate JSD (0.218) between these clients allowed effective knowledge transfer, particularly improving Client 2's recall on malicious insider detection by leveraging Client 1's richer privileged-user behavioral patterns.",
  "Client 1 + Client 3": "The Financial–Manufacturing pairing exhibited the strongest heterogeneity (JSD = 0.312), where FedProx's proximal regularization term proved most beneficial. FedProx on LSTM improved over Local by +6.1% average accuracy, while FedAvg showed a smaller +3.2% gain. Notably, centralized training underperformed FL on Client 3 due to the manufacturing client's distinct shift-based login patterns being diluted by the financial client's data distribution.",
  "Client 2 + Client 3": "The Healthcare–Manufacturing federation, with the lowest heterogeneity (JSD = 0.174), showed the most consistent improvements across all paradigms. Even FedAvg performed well in this setting, achieving within 1.5% of FedProx on average. This supports the theoretical expectation that FedAvg performs comparably to FedProx under mild non-IID conditions, while FedProx maintains an edge through its regularization mechanism.",
};

export default function Page4TwoClient() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <Badge variant="outline" className="text-xs font-mono mb-2">Page 4</Badge>
        <h1 className="text-2xl font-bold tracking-tight">Two-Client Federation Results</h1>
        <p className="text-muted-foreground mt-1">Pairwise federated experiments across all three client combinations.</p>
      </div>

      {Object.entries(TWO_CLIENT_RESULTS).map(([key, data]) => (
        <Card key={key}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              {data.label}
              <Badge variant="secondary" className="text-xs font-mono">JSD = {data.jsd}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>Experiment</TableHead>
                  <TableHead className="text-right">Acc A</TableHead>
                  <TableHead className="text-right">Acc B</TableHead>
                  <TableHead className="text-right">F1 A</TableHead>
                  <TableHead className="text-right">F1 B</TableHead>
                  <TableHead className="text-right">Precision</TableHead>
                  <TableHead className="text-right">Recall</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.rows.map((r, i) => {
                  const isBest = r.experiment === "FedProx";
                  return (
                    <TableRow key={i} className={isBest ? "bg-primary/5" : ""}>
                      <TableCell className="font-mono text-xs">{i % 4 === 0 ? r.model : ""}</TableCell>
                      <TableCell>
                        <Badge variant={isBest ? "default" : "outline"} className="text-xs">{r.experiment}</Badge>
                      </TableCell>
                      <TableCell className={`text-right font-mono text-xs ${isBest ? "font-bold" : ""}`}>{r.accA}</TableCell>
                      <TableCell className={`text-right font-mono text-xs ${isBest ? "font-bold" : ""}`}>{r.accB}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{r.f1A}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{r.f1B}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{r.precision}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{r.recall}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <p className="text-sm text-muted-foreground leading-relaxed">{INTERPRETATIONS[key]}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
