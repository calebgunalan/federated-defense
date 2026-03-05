import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, Play, Download, FileText, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LATEX_CODE } from "@/data/latexContent";

export default function Page8Latex() {
  const [code, setCode] = useState(LATEX_CODE);
  const [copied, setCopied] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [compileLogs, setCompileLogs] = useState<string | null>(null);
  const [editorExpanded, setEditorExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("LaTeX copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const handleCompile = useCallback(async () => {
    setCompiling(true);
    setCompileLogs(null);
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);

    try {
      const { data, error } = await supabase.functions.invoke("compile-latex", {
        body: { latex: code },
      });

      if (error) {
        toast.error("Compilation failed: " + error.message);
        setCompileLogs(error.message);
        return;
      }

      // data could be a Blob (PDF) or JSON (error)
      if (data instanceof Blob && data.type === "application/pdf") {
        const url = URL.createObjectURL(data);
        setPdfUrl(url);
        toast.success("PDF compiled successfully");
      } else if (data instanceof Blob) {
        // might be error JSON returned as blob
        const text = await data.text();
        try {
          const json = JSON.parse(text);
          setCompileLogs(json.logs || json.error || "Unknown error");
          toast.error("Compilation failed");
        } catch {
          setCompileLogs(text.substring(0, 3000));
          toast.error("Compilation failed");
        }
      } else if (typeof data === "object" && data.error) {
        setCompileLogs(data.logs || data.error);
        toast.error("Compilation failed");
      }
    } catch (e: any) {
      toast.error("Failed to reach compiler");
      setCompileLogs(e.message);
    } finally {
      setCompiling(false);
    }
  }, [code, pdfUrl]);

  const handleDownloadPdf = useCallback(() => {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "manuscript.pdf";
    a.click();
    toast.success("PDF downloaded");
  }, [pdfUrl]);

  const handleDownloadTex = useCallback(() => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "manuscript.tex";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("LaTeX file downloaded");
  }, [code]);

  const lineCount = code.split("\n").length;

  return (
    <div className="max-w-[1600px] mx-auto space-y-4">
      <div>
        <Badge variant="outline" className="text-xs font-mono mb-2">Page 8</Badge>
        <h1 className="text-2xl font-bold tracking-tight">LaTeX Editor & Compiler</h1>
        <p className="text-muted-foreground mt-1">
          Edit the manuscript source and compile to PDF. Uses TikZ/pgfplots for all figures.
        </p>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="py-3 flex flex-wrap items-center gap-2">
          <Button onClick={handleCompile} disabled={compiling} className="gap-1.5">
            {compiling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {compiling ? "Compiling…" : "Compile PDF"}
          </Button>
          <Button variant="outline" onClick={handleCopy} className="gap-1.5">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            Copy LaTeX
          </Button>
          <Button variant="outline" onClick={handleDownloadTex} className="gap-1.5">
            <FileText className="h-4 w-4" />
            Download .tex
          </Button>
          {pdfUrl && (
            <Button variant="outline" onClick={handleDownloadPdf} className="gap-1.5">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          )}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">{lineCount} lines</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setEditorExpanded(!editorExpanded)}
            >
              {editorExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Split View */}
      <div className={`grid gap-4 ${pdfUrl ? "lg:grid-cols-2" : "grid-cols-1"}`}>
        {/* Editor */}
        <Card className="overflow-hidden">
          <CardHeader className="py-2 px-4 border-b">
            <CardTitle className="text-xs font-mono text-muted-foreground">manuscript.tex</CardTitle>
          </CardHeader>
          <CardContent className="p-0 relative">
            <div className="flex">
              {/* Line numbers */}
              <div
                className="select-none text-right pr-2 pl-3 py-3 text-[11px] font-mono text-muted-foreground/50 leading-[1.4] bg-muted/30 border-r overflow-hidden"
                style={{ minWidth: 48, height: editorExpanded ? "80vh" : "60vh" }}
              >
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="flex-1 p-3 font-mono text-[12px] leading-[1.4] bg-background text-foreground resize-none focus:outline-none"
                style={{ height: editorExpanded ? "80vh" : "60vh", tabSize: 2 }}
              />
            </div>
          </CardContent>
        </Card>

        {/* PDF Preview */}
        {pdfUrl && (
          <Card className="overflow-hidden">
            <CardHeader className="py-2 px-4 border-b">
              <CardTitle className="text-xs font-mono text-muted-foreground">PDF Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <iframe
                src={pdfUrl}
                className="w-full border-0"
                style={{ height: editorExpanded ? "80vh" : "60vh" }}
                title="PDF Preview"
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Compilation Logs */}
      {compileLogs && (
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-xs text-destructive font-mono">Compilation Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-[11px] font-mono text-muted-foreground whitespace-pre-wrap max-h-60 overflow-y-auto bg-muted/30 rounded p-3">
              {compileLogs}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
