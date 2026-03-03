import { useCallback, useRef, RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

export function useChartDownload(filename: string): [RefObject<HTMLDivElement>, () => void] {
  const ref = useRef<HTMLDivElement>(null!);

  const download = useCallback(async () => {
    if (!ref.current) return;
    try {
      const svg = ref.current.querySelector("svg");
      if (!svg) { toast.error("No chart found"); return; }
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const svgRect = svg.getBoundingClientRect();
      const scale = 3;
      canvas.width = svgRect.width * scale;
      canvas.height = svgRect.height * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const img = new Image();
      const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        const link = document.createElement("a");
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        toast.success(`Downloaded ${filename}.png`);
      };
      img.src = url;
    } catch {
      toast.error("Download failed");
    }
  }, [filename]);

  return [ref, download];
}

export function DownloadButton({ onClick, label }: { onClick: () => void; label?: string }) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} className="gap-1.5 text-xs">
      <Download className="h-3.5 w-3.5" />
      {label ?? "Download PNG"}
    </Button>
  );
}
