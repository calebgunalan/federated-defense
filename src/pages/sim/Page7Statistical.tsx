import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DELONG_RESULTS } from "@/data/simulationData";

export default function Page7Statistical() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <Badge variant="outline" className="text-xs font-mono mb-2">Page 7</Badge>
        <h1 className="text-2xl font-bold tracking-tight">Statistical Validation</h1>
        <p className="text-muted-foreground mt-1">DeLong test results comparing AUC-ROC curves across training paradigms.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">DeLong Test Results (LSTM Architecture)</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Comparison</TableHead>
                <TableHead className="text-right">Client 1 (p-value)</TableHead>
                <TableHead className="text-right">Client 2 (p-value)</TableHead>
                <TableHead className="text-right">Client 3 (p-value)</TableHead>
                <TableHead>Significant?</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DELONG_RESULTS.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium text-sm">{r.comparison}</TableCell>
                  <TableCell className={`text-right font-mono text-sm ${r.c1p < 0.05 ? "text-primary font-bold" : ""}`}>
                    {r.c1p < 0.001 ? "< 0.001" : r.c1p.toFixed(3)}
                  </TableCell>
                  <TableCell className={`text-right font-mono text-sm ${r.c2p < 0.05 ? "text-primary font-bold" : ""}`}>
                    {r.c2p.toFixed(3)}
                  </TableCell>
                  <TableCell className={`text-right font-mono text-sm ${r.c3p < 0.05 ? "text-primary font-bold" : ""}`}>
                    {r.c3p.toFixed(3)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={r.significant === "No" ? "secondary" : "default"} className="text-xs">
                      {r.significant}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Interpretation</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            The DeLong test analysis yields two critical findings that substantiate the efficacy of the proposed federated learning framework for insider threat detection.
          </p>
          <div className="space-y-3">
            <div className="border-l-2 border-primary pl-4">
              <p className="text-sm font-medium">Finding 1: FedProx ≈ Centralized</p>
              <p className="text-sm text-muted-foreground">
                The comparison between Centralized and FedProx training showed <strong className="text-foreground">no statistically significant difference</strong> across any client (all p &gt; 0.05). This statistically confirms that our privacy-preserving FedProx model achieves diagnostic performance comparable to centralized data pooling, validating federated learning as a viable alternative to data sharing.
              </p>
            </div>
            <div className="border-l-2 border-accent pl-4">
              <p className="text-sm font-medium">Finding 2: FedProx &gt; Local</p>
              <p className="text-sm text-muted-foreground">
                FedProx significantly outperformed Local-only training for Clients 1 and 3 (p = 0.008 and p = 0.031, respectively). For Client 2, the improvement approached significance (p = 0.072), consistent with Client 2's smaller dataset where statistical power is limited. Combined with the consistent accuracy gains reported in Table 6, these results indicate a <strong className="text-foreground">strong positive trend in generalizability</strong>.
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Overall, FedProx achieves statistically comparable performance to centralized training while significantly outperforming local-only models, confirming the privacy-preserving viability of federated learning for cross-organizational insider threat detection.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
