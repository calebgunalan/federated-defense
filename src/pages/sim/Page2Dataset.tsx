import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DATASET_TABLE, JSD_VALUES, FEATURE_DISTRIBUTION } from "@/data/simulationData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useChartDownload, DownloadButton } from "@/components/ChartDownload";

function JSDHeatmap() {
  const clients = ["Client 1", "Client 2", "Client 3"];
  const getJSD = (a: string, b: string) => {
    if (a === b) return 1.0;
    const pair = JSD_VALUES.find(
      (v) => (v.clientA.includes(a.split(" ")[1]) && v.clientB.includes(b.split(" ")[1])) ||
             (v.clientA.includes(b.split(" ")[1]) && v.clientB.includes(a.split(" ")[1]))
    );
    return pair?.jsd ?? 0;
  };
  const getColor = (v: number) => {
    if (v >= 1) return "bg-primary/10";
    if (v >= 0.3) return "bg-destructive/30";
    if (v >= 0.2) return "bg-amber-500/30";
    return "bg-accent/30";
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-1 max-w-md">
        <div />
        {clients.map((c) => <div key={c} className="text-xs font-mono text-center text-muted-foreground p-2">{c}</div>)}
        {clients.map((row) => (
          <>
            <div key={`label-${row}`} className="text-xs font-mono text-muted-foreground p-2 flex items-center">{row}</div>
            {clients.map((col) => {
              const v = getJSD(row, col);
              return (
                <div key={`${row}-${col}`} className={`${getColor(v)} rounded-md flex items-center justify-center p-3`}>
                  <span className="text-sm font-mono font-medium">{v === 1 ? "—" : v.toFixed(3)}</span>
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}

export default function Page2Dataset() {
  const [featureRef, downloadFeature] = useChartDownload("feature_distribution");

  const featureChartData = FEATURE_DISTRIBUTION.map((f) => ({
    name: f.feature.length > 12 ? f.feature.substring(0, 12) + "…" : f.feature,
    fullName: f.feature,
    "Client 1 (Financial)": f.client1,
    "Client 2 (Healthcare)": f.client2,
    "Client 3 (Manufacturing)": f.client3,
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <Badge variant="outline" className="text-xs font-mono mb-2">Page 2</Badge>
        <h1 className="text-2xl font-bold tracking-tight">Dataset & Heterogeneity Analysis</h1>
        <p className="text-muted-foreground mt-1">Three organizational profiles with quantified non-IID conditions across CERT and LANL benchmarks.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Dataset Description</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dataset</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Organization Type</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Normal</TableHead>
                <TableHead className="text-right">Malicious</TableHead>
                <TableHead className="text-right">Mal. Rate</TableHead>
                <TableHead>Split</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DATASET_TABLE.map((d, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-xs">{d.dataset}</TableCell>
                  <TableCell>{d.client}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{d.orgType}</Badge></TableCell>
                  <TableCell className="text-right font-mono">{d.totalSamples.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">{d.normalSamples.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">{d.maliciousSamples}</TableCell>
                  <TableCell className="text-right font-mono">{d.maliciousRate.toFixed(1)}%</TableCell>
                  <TableCell className="font-mono text-xs">{d.split}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Jensen–Shannon Divergence Heatmap</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <JSDHeatmap />
          <p className="text-sm text-muted-foreground leading-relaxed">
            The pairwise Jensen–Shannon Divergence (JSD) values quantify the degree of distributional dissimilarity across client data partitions. The highest divergence is observed between Client 1 (Financial) and Client 3 (Manufacturing) at JSD = 0.312, reflecting fundamentally different behavioral baselines — financial firms exhibit high after-hours and USB activity, while manufacturing environments are characterized by shift-based login patterns. The moderate divergence between Client 1 and Client 2 (JSD = 0.218) and the relatively lower divergence between Client 2 and Client 3 (JSD = 0.174) indicate that healthcare and manufacturing organizations share some behavioral overlap in file access patterns, though they diverge significantly in external communication profiles. These heterogeneity levels confirm genuine non-IID conditions that challenge standard federated aggregation methods.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Behavioral Feature Distribution Across Clients</CardTitle>
          <DownloadButton onClick={downloadFeature} />
        </CardHeader>
        <CardContent>
          <div className="h-80" ref={featureRef}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 11 }} />
                <YAxis className="text-xs" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Client 1 (Financial)" fill="hsl(215 70% 55%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Client 2 (Healthcare)" fill="hsl(165 60% 45%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Client 3 (Manufacturing)" fill="hsl(32 85% 50%)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
