

# Research-to-Publication Suite
## Federated Learning for Cross-Organizational Insider Threat Detection

A comprehensive web application to manage your entire research journey — from literature review through paper submission — with progress tracking, note-taking, and structured workflows across all 9 phases.

---

### Authentication & User Profile
- Email/password login and signup via Supabase Auth
- Personal dashboard showing overall research progress at a glance

---

### Phase Tracker & Interactive Timeline
- Visual timeline/roadmap showing all 9 phases with their week ranges (Weeks 1–22)
- Each phase displayed as a card with completion percentage, status (Not Started / In Progress / Complete), and deadline
- Progress bar showing overall journey completion
- Ability to adjust start date and have all phase deadlines auto-calculate

---

### Phase 1: Literature Manager
- Organize readings into the three concentric circles: FL Methodology, Insider Threat Detection, FL in Cybersecurity
- Add papers with title, authors, year, source, key takeaways, and relevance notes
- Tag papers (e.g., "CERT dataset", "FedAvg", "FedProx", "gap evidence")
- **Gap Statement Builder** — a dedicated rich text area to draft and iterate on your gap statement, with a checklist of what a strong gap statement needs

---

### Phase 2: Dataset & Experiment Design
- Document dataset choices (CERT versions, LANL) with notes on why each was selected
- Client partition designer — describe each simulated client (e.g., "Financial Firm", "Healthcare Org", "Manufacturing Co") with their characteristics
- JSD measurement log — record heterogeneity measurements between client pairs
- Checklist for dataset preparation tasks

---

### Phase 3: Feature Engineering Tracker
- Feature catalog — list all behavioral features you're extracting (logon events, after-hours ratio, USB insertions, etc.)
- Time window decision log with rationale
- Class imbalance strategy notes
- Preprocessing pipeline checklist

---

### Phase 4: Model Architecture Selection
- Architecture comparison table for candidates (LSTM, MLP, 1D CNN, Autoencoder)
- Log centralized baseline results: accuracy, macro precision, macro recall, macro F1 per model
- Selection rationale notes for which models advance to FL experiments

---

### Phase 5: FL Experiment Dashboard
- Experiment matrix showing all conditions: Local, Centralized, FedAvg, FedProx across all client pairings (A+B, A+C, B+C, A+B+C)
- Results entry for each experiment with key metrics
- µ Sensitivity Analysis section — log results for µ ∈ {0.001, 0.01, 0.1, 1.0}
- Notes area for observations and unexpected findings

---

### Phase 6: Ablation Study
- Track three threshold calibration configurations (global, per-client local, federated calibration)
- Results comparison table
- Findings and interpretation notes

---

### Phase 7: Statistical Validation
- Log statistical test results (McNemar's test, bootstrap CIs) with p-values
- ROC curve reference notes
- Checklist for all required statistical validations

---

### Phase 8: Writing Progress
- Section-by-section writing tracker for the MDPI format: Abstract, Introduction, Related Work, Materials & Methods, Results, Discussion, Conclusions
- Status per section (Draft / Review / Final)
- Key points checklist for each section (e.g., Introduction needs 4-paragraph arc, Discussion needs 4 elements)
- Word count tracking per section

---

### Phase 9: Submission Checklist
- Pre-submission checklist: manuscript, cover letter, suggested reviewers, final literature sweep
- Reviewer suggestions list with name, affiliation, and relevant papers
- Post-submission tracker: desk review status, peer review status, revision rounds
- Revision response log — track each reviewer comment and your point-by-point response

---

### Design & Experience
- Clean, professional academic aesthetic with a dark/light mode toggle
- Sidebar navigation for quick access to any phase
- Dashboard home page with at-a-glance progress across all phases
- Mobile-responsive for on-the-go note updates
- Uses Supabase for database and authentication (via Lovable Cloud)

