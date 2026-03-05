

# Plan: Comprehensive LaTeX Manuscript Revision

After reviewing the full 669-line LaTeX content against all reviewer feedback, many issues are already addressed (back matter, code availability, std deviations, 47-experiment breakdown, negative transfer discussion, synthetic data defense). The remaining gaps are:

---

## Changes to `src/data/latexContent.ts`

### 1. Tables 3–5: Add Per-Client Precision & Recall
Replace aggregated `Prec` and `Recall` columns with `Prec C1`, `Prec C2`, `Rec C1`, `Rec C2` (or C3 depending on pairing) with ± std dev, matching the per-client Accuracy and F1 columns. This is the most critical table consistency fix.

### 2. Add Feature Summary Table (new Table 2)
Insert a table after Section 3.4 (Feature Engineering) listing all 24 features organized by the 6 categories (Authentication, File Access, Communication, Device, Network, Temporal), with feature name and description. Renumber subsequent tables.

### 3. Add µ Sensitivity Analysis Subsection (Section 4.5)
Currently only mentioned in Discussion text. Add a dedicated subsection with:
- A table showing LSTM+FedProx three-client results at µ ∈ {0.001, 0.01, 0.1, 1.0}
- A TikZ line chart figure showing accuracy/F1 vs µ
- Brief interpretive text

### 4. Elevate Client-Adaptive Threshold Calibration
- Rename current Section 4.5 → 4.6 "Ablation Study" to "Client-Adaptive Threshold Calibration" as a primary results section (not framed as ablation)
- In the Introduction contributions list, move item 4 (threshold calibration) to item 1 or 2 and strengthen language
- Add a paragraph in the Introduction emphasizing this as the paper's primary methodological novelty beyond the comparative framework

### 5. Add Performance Gain Analysis Figure
Insert a TikZ grouped bar chart (Figure 7) showing accuracy improvement (Local→FedProx) across all federation scenarios and architectures, placed after the three-client results table.

### 6. Expand Related Work (+~15 lines)
- Add 2-3 more studies per subsection with methodology details
- Add explicit gap discussion paragraphs at end of each subsection
- Target ~1 additional page of content

### 7. Expand Discussion (+~20 lines)
- Lengthen "Centralized Training Limitations" further with a second concrete example
- Add a "Qualitative Case Analysis" paragraph describing specific detection successes/failures
- Expand "Comparison with Prior Work" with quantitative metric comparisons against specific cited studies
- Expand "Scalability Considerations" with communication cost estimates

### 8. Expand Conclusions (+~5 lines)
- Add summary of per-metric improvements
- Strengthen future work directions with more specificity

### 9. Model Rationale Enhancement (Section 3.5)
Add 1-2 sentences per model explaining why each is specifically suited to insider threat behavioral data (e.g., why 1D-CNN's local receptive fields capture behavioral bursts better than MLPs for this domain).

### 10. Add Footnote to Tables 3-5
Even with per-client metrics, add a footnote clarifying the evaluation methodology for transparency.

---

## Implementation Approach

All changes are in a single file: `src/data/latexContent.ts`. The raw template literal will be updated with the expanded LaTeX content. The target is ~25 compiled pages (currently ~17), requiring approximately 40% more content across the sections listed above.

