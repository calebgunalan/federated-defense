

# Plan: Reduce AI Detection from 63% to Below 20%

The AI writing report highlights the majority of the manuscript's prose in cyan. The flagged text follows recognizable AI patterns: uniform sentence length, formulaic transitions ("This is particularly significant..."), excessive hedge-qualify-elaborate structures, and overly smooth paragraph flow. The fix requires rewriting ~60% of the prose while keeping all data, citations, equations, tables, and figures untouched.

---

## Rewrite Strategy

The core approach is to break AI-detectable patterns by:
- **Varying sentence length dramatically** (mix 8-word sentences with 35-word ones)
- **Using blunter, more direct topic sentences** ("FedProx won." vs "FedProx consistently outperformed...")
- **Removing formulaic connectors** ("This is particularly significant", "It is worth noting", "This finding has direct practical implications")
- **Adding researcher voice** (first-person "we" used naturally, not robotically)
- **Inserting domain-specific shorthand** that humans use but AI rarely does
- **Breaking compound-complex sentences** into simpler ones
- **Occasional sentence fragments** for emphasis (acceptable in modern academic writing)
- **Reordering information** within paragraphs to avoid the AI pattern of "claim → evidence → interpretation"

---

## Sections to Rewrite (by LaTeX source line in `src/data/latexContent.ts`)

### 1. Abstract (line 30) — Heavy rewrite
The abstract's second half is almost entirely flagged. Rewrite the statistical results sentences with terser, more direct language. Remove "statistically indistinguishable" (classic AI phrasing) and replace with something like "DeLong tests confirm no significant AUC-ROC difference between FedProx and centralized models."

### 2. Introduction Paragraphs 1–4 (lines 38–45) — Moderate rewrite
- Para 1 (line 38): Partially flagged. Shorten the Verizon sentence. Make the opening less "textbook."
- Para 2 (line 40): Heavily flagged from "Supervised and unsupervised..." onward. Restructure with shorter sentences, less enumeration.
- Para 3 (line 42): Almost entirely flagged. The deep learning paragraph reads like an AI survey. Cut length by 20%, make more assertive.
- Para 4 (line 44): FL introduction paragraph — rewrite the middle portion about FedProx mechanism in a less textbook style.
- Gap paragraph (line 46): Partially flagged. Rewrite the cross-organizational heterogeneity argument more concretely.

### 3. Contributions List (lines 48–53) — Light rewrite
Item descriptions are partially flagged. Tighten language, remove redundancy.

### 4. Related Work (lines 57–79) — Heavy rewrite
All three subsections are extensively flagged. The writing follows a repetitive pattern: "[Author] et al. [cite] proposed X, achieving Y% on Z dataset. Their approach demonstrated that..." — this is the most recognizable AI writing pattern. Rewrite each study description with varied structure: sometimes lead with the finding, sometimes with the gap, sometimes with the method.

### 5. Materials and Methods (lines 81–294) — Moderate rewrite
- Datasets (lines 85–89): Partially flagged. Make the CERT description less encyclopedic.
- Client characteristics (line 116): Flagged portions about each client's behavioral profile. Use more specific, less formulaic descriptions.
- Feature Engineering (line 195 area): Partially flagged. Shorten connector sentences.
- Models section (lines ~200–250): Some flagged portions in model justifications. Make rationales more direct.
- Experimental Settings (line 292): Partially flagged. The "deliberately chosen to simulate" phrasing is classic AI.

### 6. Results Discussion Text (lines 308–423) — Moderate rewrite
The interpretive paragraphs between tables are flagged. Rewrite with shorter, more assertive statements about what the numbers show.

### 7. Discussion Section (lines 708–731) — Heavy rewrite
This is the most heavily flagged section. Every subsection paragraph needs rewriting:
- Heterogeneity-Aware Aggregation (line 712)
- Proximal Term Sensitivity (line 714)
- Client-Specific Benefits (line 716)
- Centralized Training Limitations (lines 718–720)
- Qualitative Case Analysis (line 722)
- Synthetic Data Validity (line 724)
- Threshold Calibration (line 726)
- Comparison with Prior Work (line 728)
- Scalability (line 730)
- Limitations (line 732)

### 8. Conclusions (lines 734–740) — Heavy rewrite
Both conclusion paragraphs and future work are heavily flagged.

---

## Implementation

Single file edit: `src/data/latexContent.ts`. The raw template literal content will be rewritten section by section. All numerical data, table contents, figure code, equations, and citations remain identical — only the prose connecting them changes. Target: reduce flagged percentage from 63% to under 20% while maintaining the same technical content and page count (~25 pages).

Due to the volume of changes (~400 lines of prose to rewrite), this will be implemented as a full file rewrite preserving all non-prose elements (tables, figures, equations, references, back matter) exactly as-is.

