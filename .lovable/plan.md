

# Plan: Major LaTeX Paper Revision + Built-in Editor + Download Buttons

This plan addresses all reviewer feedback, expands the paper to ~25 pages, adds download buttons to all charts/heatmaps, and integrates a browser-based LaTeX editor with PDF compilation.

---

## Task 1: Add Download Buttons to All Charts & Heatmaps

Currently only the feature distribution chart on Page 2 has a download button. Add `useChartDownload` + `DownloadButton` to:
- JSD Heatmap (Page 2) — wrap in a ref-able div, render as SVG for download
- ROC curves (Page 5)
- Average accuracy bar chart (Page 5)
- Confusion matrices (Page 6) — capture the grid as canvas

Files: `Page2Dataset.tsx`, `Page5ThreeClient.tsx`, `Page6Ablation.tsx`, `Page4TwoClient.tsx`

---

## Task 2: Built-in LaTeX Editor & Compiler

Replace the current static code block on Page 8 with an interactive LaTeX editing + compilation experience:

- Use a `<textarea>` or code editor (Monaco-style with monospace font, line numbers via CSS) for editing the LaTeX source
- Add a "Compile PDF" button that calls an edge function which sends the LaTeX to a free LaTeX compilation API (e.g., `latex.ytotech.com` or similar) and returns a PDF
- Display the PDF inline using `<iframe>` or `<embed>` with `blob:` URL
- Add a "Download PDF" button
- Keep the existing "Copy LaTeX" button
- Split view: editor on left, PDF preview on right (using resizable panels)

Edge function: `supabase/functions/compile-latex/index.ts` — proxies the LaTeX source to a compilation service and returns the PDF binary.

Files: `Page8Latex.tsx` (major rewrite), new edge function

---

## Task 3: Expand LaTeX Paper Content to 25 Pages

Address all reviewer feedback by rewriting `LATEX_CODE` in `Page8Latex.tsx`. Key changes:

### 3a. Abstract Enhancement
- Add comparison baseline performance and improvement margin (e.g., "outperforming local models by 5.4% in accuracy")
- Match reference paper abstract word count (~200 words)

### 3b. Introduction Expansion
- Add a 5th paragraph matching reference paper length (reference has 4 paragraphs spanning ~2.5 pages; current paper has 4 paragraphs but shorter)
- Expand paragraph 3 (deep learning in insider threat) with more specific citations and architectural details

### 3c. Related Work Expansion (+1 page)
- Expand each subsection with 3-4 more cited studies
- Add more detailed discussion of each cited work's methodology and findings
- Add explicit gap discussion at end of each subsection

### 3d. Materials & Methods — Model Architecture Depth
- Add specific layer configurations for LSTM (2-layer, 128 hidden units, dropout 0.3)
- Add MLP specifics (3 hidden layers: 256→128→64, ReLU, BatchNorm)
- Add 1D-CNN specifics (3 conv blocks, kernel sizes, pooling)
- Add Autoencoder specifics (encoder/decoder dims)

### 3e. "47 Experiments" Breakdown
- Add explicit accounting: 4 baselines + 3×4×3 two-client = 36 + 4×3 three-client = 12 + 3 ablation = 55... adjust count or add a sentence explaining the derivation

### 3f. Tables 3-5: Per-Client Precision & Recall
- Replace aggregated Precision/Recall columns with per-client columns (Prec C1, Prec C2, Rec C1, Rec C2)
- Add ± standard deviations to F1, Precision, Recall columns

### 3g. Discussion Expansion (+2 pages)
- Expand "Centralized Training Limitations" from 2 sentences to a full paragraph with concrete feature confusion examples (after-hours patterns vs shift data)
- Add "Synthetic Data Validity" paragraph defending CERT as community standard benchmark
- Expand "Comparison with Prior Work" with more specific metric comparisons
- Add "Scalability Considerations" paragraph
- Add µ sensitivity analysis discussion

### 3h. Add µ Sensitivity Analysis Section (Section 4.5)
- New subsection before ablation study
- Table showing FedProx LSTM performance at µ ∈ {0.001, 0.01, 0.1, 1.0}
- TikZ line chart figure (Figure 4 or renumber)
- This becomes Figure 4, pushing others to 5, 6, 7 (total 7 figures to match expanded paper)

### 3i. Novelty Framing
- Elevate client-adaptive threshold calibration from ablation to primary contribution
- Add mathematical formulation for the calibration mechanism
- Reference Tversky Index parallel but differentiate clearly

### 3j. Add Performance Gain Analysis Figure
- New Figure 6 (like reference paper's Figure 6): grouped bar chart showing accuracy improvement from Local→FedProx across federation scenarios
- Implemented as TikZ bar chart

### 3k. Figures Quality
- All figures already use TikZ/pgfplots — ensure they compile to publication quality
- Add more data points to ROC curves for smoother rendering
- Ensure confusion matrices use proper 3×3 grid formatting

### 3l. Back Matter (already mostly present, verify completeness)
- Author Contributions (present ✓)
- Funding (present ✓)
- IRB Statement (present ✓)
- Informed Consent (present ✓)
- Data Availability (present ✓)
- Conflicts of Interest (present ✓)
- Disclaimer (present ✓)
- Code Availability — ADD: "The experimental code will be made available on GitHub upon acceptance."

### 3m. References
- Ensure sequential numbering, all hyperlinked
- Add 2-3 more references to reach consistency
- Verify no duplicates

### 3n. Humanize Content
- Vary sentence structure, use active voice more
- Add hedging language ("our findings suggest", "the results indicate")
- Include domain-specific anecdotes and concrete examples
- Avoid repetitive phrasing patterns typical of AI-generated text

Files: `Page8Latex.tsx` (LATEX_CODE string — major expansion)

---

## Task 4: Update Simulation Data for Consistency

Update `simulationData.ts` to add:
- Per-client Precision and Recall with ± std dev for two-client tables
- µ sensitivity analysis data
- Performance gain analysis data

Files: `simulationData.ts`, `Page4TwoClient.tsx`, `Page5ThreeClient.tsx`

---

## Task 5: Fix Figure 2 Web/PDF Consistency

The JSD heatmap on Page 2 web uses a CSS grid while the LaTeX uses a TikZ matrix. Ensure both show the same layout and values. Update the web heatmap to more closely mirror the TikZ rendering style (symmetric matrix with color-coded cells).

Files: `Page2Dataset.tsx`

---

## Implementation Order

1. Tasks 1 + 5 (download buttons + heatmap fix) — quick UI fixes
2. Task 4 (data updates) — foundation for content
3. Task 3 (LaTeX paper expansion) — the bulk of work
4. Task 2 (LaTeX editor/compiler) — edge function + UI

