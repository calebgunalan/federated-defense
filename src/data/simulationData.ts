// ── Simulated research data for the entire paper ──

export const PAPER_META = {
  title: "A Comparative Analysis of Federated Learning for Cross-Organizational Insider Threat Detection",
  authors: [
    { name: "Dr. Khalid M. Al-Rashidi", affiliation: "Department of Computer Science, King Fahd University of Petroleum & Minerals, Dhahran 31261, Saudi Arabia" },
    { name: "Dr. Lena Petrova", affiliation: "Institute for Cybersecurity Research, ETH Zürich, 8092 Zürich, Switzerland" },
    { name: "Prof. James T. Harrington", affiliation: "School of Computing, University of Edinburgh, Edinburgh EH8 9AB, United Kingdom" },
    { name: "Dr. Yuki Tanaka", affiliation: "Graduate School of Information Science, Nagoya University, Nagoya 464-8601, Japan" },
  ],
  journal: "AI — MDPI Open Access Journal",
  year: 2025,
  status: "Under Preparation",
  currentWeek: 18,
  totalWeeks: 22,
  keyStats: { clients: 3, architectures: 4, scenarios: 6, experiments: 47 },
  keywords: [
    "Federated Learning", "Insider Threat Detection", "FedAvg", "FedProx",
    "Non-IID Data", "User Behavior Analytics", "Privacy-Preserving ML", "Cross-Organizational Security"
  ],
  abstract: `Insider threats represent one of the most challenging cybersecurity risks facing modern organizations, responsible for an estimated 34% of data breaches with average remediation costs exceeding $15.4 million per incident. While machine learning approaches have shown promise in detecting anomalous user behavior, they require access to sensitive behavioral logs that organizations are reluctant to share due to privacy regulations and competitive concerns. Federated Learning (FL) offers a compelling alternative by enabling collaborative model training without raw data exchange. This paper presents a comprehensive comparative analysis of FL frameworks for insider threat detection across organizationally heterogeneous clients. We evaluate four neural network architectures — LSTM, MLP, 1D-CNN, and Autoencoder — under Local, Centralized, FedAvg, and FedProx training paradigms using partitions derived from the CERT Insider Threat Dataset (r4.2, r5.2) and the LANL Unified Host and Network Dataset. Three simulated organizational profiles (Financial Firm, Healthcare Organization, Manufacturing Company) with quantified non-IID conditions (Jensen–Shannon Divergence 0.17–0.31) form the experimental basis. Results from 47 experiments demonstrate that FedProx on LSTM achieves the best three-client federation performance with 75.8% average accuracy and 70.4% macro F1-score, statistically comparable to centralized training (DeLong p > 0.05) while significantly outperforming local models. An ablation study on client-adaptive threshold calibration further improves minority-class detection by 4.2% without increasing false positive rates. These findings confirm FL as a viable, privacy-preserving infrastructure for cross-organizational insider threat detection.`,
};

export const DATASET_TABLE = [
  { dataset: "CERT r4.2", client: "Client 1", orgType: "Financial Firm", totalSamples: 4512, normalSamples: 4331, maliciousSamples: 181, maliciousRate: 4.01, split: "70/15/15" },
  { dataset: "CERT r5.2", client: "Client 2", orgType: "Healthcare Organization", totalSamples: 3847, normalSamples: 3693, maliciousSamples: 154, maliciousRate: 4.00, split: "70/15/15" },
  { dataset: "LANL", client: "Client 3", orgType: "Manufacturing Company", totalSamples: 5216, normalSamples: 4955, maliciousSamples: 261, maliciousRate: 5.00, split: "70/15/15" },
];

export const JSD_VALUES = [
  { clientA: "Client 1 (Financial)", clientB: "Client 2 (Healthcare)", jsd: 0.218 },
  { clientA: "Client 1 (Financial)", clientB: "Client 3 (Manufacturing)", jsd: 0.312 },
  { clientA: "Client 2 (Healthcare)", clientB: "Client 3 (Manufacturing)", jsd: 0.174 },
];

export const FEATURE_DISTRIBUTION = [
  { feature: "Login Frequency", client1: 24.3, client2: 18.7, client3: 31.2 },
  { feature: "After-Hours Ratio", client1: 0.38, client2: 0.12, client3: 0.45 },
  { feature: "File Access Count", client1: 156, client2: 287, client3: 94 },
  { feature: "External Email Ratio", client1: 0.22, client2: 0.31, client3: 0.08 },
  { feature: "USB Insertions", client1: 4.7, client2: 1.2, client3: 2.8 },
  { feature: "HTTP Anomaly Score", client1: 0.15, client2: 0.09, client3: 0.21 },
];

export const BASELINE_RESULTS = [
  { model: "LSTM", params: 2.34, accuracy: 76.4, f1: 71.2, precision: 73.8, recall: 69.1, aucRoc: 0.887, epochs: 14, selected: true },
  { model: "MLP", params: 0.89, accuracy: 73.1, f1: 68.5, precision: 70.2, recall: 67.1, aucRoc: 0.861, epochs: 11, selected: true },
  { model: "1D-CNN", params: 1.67, accuracy: 74.8, f1: 70.1, precision: 71.9, recall: 68.4, aucRoc: 0.874, epochs: 13, selected: true },
  { model: "Autoencoder", params: 1.12, accuracy: 71.3, f1: 65.8, precision: 68.4, recall: 63.5, aucRoc: 0.842, epochs: 9, selected: false },
];

// Two-client federation results
export const TWO_CLIENT_RESULTS = {
  "Client 1 + Client 2": {
    label: "Client 1 (Financial) + Client 2 (Healthcare)",
    jsd: 0.218,
    rows: [
      { model: "LSTM", experiment: "Local", accA: "72.3 ± 4.1", accB: "68.9 ± 4.8", f1A: 67.4, f1B: 63.2, precision: 69.8, recall: 65.1 },
      { model: "LSTM", experiment: "Centralized", accA: "74.1 ± 3.9", accB: "71.5 ± 4.2", f1A: 69.8, f1B: 66.4, precision: 72.1, recall: 67.9 },
      { model: "LSTM", experiment: "FedAvg", accA: "76.8 ± 3.7", accB: "73.4 ± 4.0", f1A: 72.5, f1B: 68.9, precision: 74.2, recall: 70.3 },
      { model: "LSTM", experiment: "FedProx", accA: "79.2 ± 3.4", accB: "75.8 ± 3.6", f1A: 75.1, f1B: 71.6, precision: 76.8, recall: 72.9 },
      { model: "MLP", experiment: "Local", accA: "69.4 ± 4.5", accB: "66.1 ± 5.1", f1A: 64.2, f1B: 60.8, precision: 66.9, recall: 62.1 },
      { model: "MLP", experiment: "Centralized", accA: "71.8 ± 4.2", accB: "69.2 ± 4.5", f1A: 67.1, f1B: 64.3, precision: 69.5, recall: 65.4 },
      { model: "MLP", experiment: "FedAvg", accA: "73.5 ± 3.9", accB: "70.8 ± 4.1", f1A: 69.2, f1B: 66.1, precision: 71.4, recall: 67.8 },
      { model: "MLP", experiment: "FedProx", accA: "75.1 ± 3.6", accB: "72.4 ± 3.8", f1A: 71.0, f1B: 68.2, precision: 73.1, recall: 69.5 },
      { model: "1D-CNN", experiment: "Local", accA: "70.8 ± 4.3", accB: "67.5 ± 4.9", f1A: 65.9, f1B: 62.1, precision: 68.2, recall: 63.7 },
      { model: "1D-CNN", experiment: "Centralized", accA: "73.2 ± 4.0", accB: "70.1 ± 4.3", f1A: 68.7, f1B: 65.3, precision: 70.9, recall: 66.8 },
      { model: "1D-CNN", experiment: "FedAvg", accA: "74.9 ± 3.7", accB: "71.8 ± 4.0", f1A: 70.6, f1B: 67.4, precision: 72.8, recall: 68.9 },
      { model: "1D-CNN", experiment: "FedProx", accA: "77.1 ± 3.5", accB: "73.9 ± 3.7", f1A: 73.2, f1B: 69.8, precision: 75.1, recall: 71.2 },
    ],
  },
  "Client 1 + Client 3": {
    label: "Client 1 (Financial) + Client 3 (Manufacturing)",
    jsd: 0.312,
    rows: [
      { model: "LSTM", experiment: "Local", accA: "72.3 ± 4.1", accB: "70.1 ± 4.6", f1A: 67.4, f1B: 65.8, precision: 68.9, recall: 66.2 },
      { model: "LSTM", experiment: "Centralized", accA: "73.5 ± 4.0", accB: "72.8 ± 4.2", f1A: 68.9, f1B: 68.1, precision: 70.4, recall: 68.1 },
      { model: "LSTM", experiment: "FedAvg", accA: "75.2 ± 3.8", accB: "73.9 ± 4.0", f1A: 70.8, f1B: 69.4, precision: 72.5, recall: 69.8 },
      { model: "LSTM", experiment: "FedProx", accA: "78.4 ± 3.3", accB: "76.7 ± 3.5", f1A: 74.2, f1B: 72.8, precision: 75.9, recall: 73.1 },
      { model: "MLP", experiment: "Local", accA: "69.4 ± 4.5", accB: "67.8 ± 4.9", f1A: 64.2, f1B: 63.1, precision: 66.1, recall: 63.2 },
      { model: "MLP", experiment: "Centralized", accA: "70.9 ± 4.3", accB: "69.5 ± 4.5", f1A: 66.1, f1B: 64.8, precision: 67.8, recall: 64.9 },
      { model: "MLP", experiment: "FedAvg", accA: "72.1 ± 4.0", accB: "71.3 ± 4.2", f1A: 67.8, f1B: 66.9, precision: 69.4, recall: 67.0 },
      { model: "MLP", experiment: "FedProx", accA: "74.8 ± 3.7", accB: "73.2 ± 3.9", f1A: 70.5, f1B: 69.1, precision: 72.1, recall: 69.4 },
      { model: "1D-CNN", experiment: "Local", accA: "70.8 ± 4.3", accB: "69.2 ± 4.7", f1A: 65.9, f1B: 64.5, precision: 67.5, recall: 64.8 },
      { model: "1D-CNN", experiment: "Centralized", accA: "72.4 ± 4.1", accB: "71.0 ± 4.3", f1A: 67.8, f1B: 66.5, precision: 69.4, recall: 66.8 },
      { model: "1D-CNN", experiment: "FedAvg", accA: "73.8 ± 3.8", accB: "72.5 ± 4.0", f1A: 69.4, f1B: 68.1, precision: 71.2, recall: 68.4 },
      { model: "1D-CNN", experiment: "FedProx", accA: "76.2 ± 3.5", accB: "74.8 ± 3.7", f1A: 72.1, f1B: 70.6, precision: 73.8, recall: 70.9 },
    ],
  },
  "Client 2 + Client 3": {
    label: "Client 2 (Healthcare) + Client 3 (Manufacturing)",
    jsd: 0.174,
    rows: [
      { model: "LSTM", experiment: "Local", accA: "68.9 ± 4.8", accB: "70.1 ± 4.6", f1A: 63.2, f1B: 65.8, precision: 66.4, recall: 64.1 },
      { model: "LSTM", experiment: "Centralized", accA: "71.2 ± 4.4", accB: "73.1 ± 4.1", f1A: 66.1, f1B: 68.5, precision: 69.2, recall: 66.9 },
      { model: "LSTM", experiment: "FedAvg", accA: "74.1 ± 3.9", accB: "75.4 ± 3.7", f1A: 69.8, f1B: 71.2, precision: 72.4, recall: 70.1 },
      { model: "LSTM", experiment: "FedProx", accA: "75.6 ± 3.6", accB: "77.2 ± 3.4", f1A: 71.4, f1B: 73.1, precision: 73.8, recall: 71.8 },
      { model: "MLP", experiment: "Local", accA: "66.1 ± 5.1", accB: "67.8 ± 4.9", f1A: 60.8, f1B: 63.1, precision: 63.8, recall: 61.5 },
      { model: "MLP", experiment: "Centralized", accA: "68.5 ± 4.7", accB: "70.2 ± 4.5", f1A: 63.5, f1B: 65.8, precision: 66.5, recall: 64.2 },
      { model: "MLP", experiment: "FedAvg", accA: "70.2 ± 4.3", accB: "71.8 ± 4.1", f1A: 65.4, f1B: 67.5, precision: 68.2, recall: 66.1 },
      { model: "MLP", experiment: "FedProx", accA: "72.1 ± 4.0", accB: "73.5 ± 3.8", f1A: 67.8, f1B: 69.4, precision: 70.4, recall: 68.2 },
      { model: "1D-CNN", experiment: "Local", accA: "67.5 ± 4.9", accB: "69.2 ± 4.7", f1A: 62.1, f1B: 64.5, precision: 65.1, recall: 62.9 },
      { model: "1D-CNN", experiment: "Centralized", accA: "70.1 ± 4.4", accB: "71.8 ± 4.2", f1A: 65.3, f1B: 67.2, precision: 68.1, recall: 65.8 },
      { model: "1D-CNN", experiment: "FedAvg", accA: "72.4 ± 4.0", accB: "73.5 ± 3.8", f1A: 67.8, f1B: 69.1, precision: 70.2, recall: 68.1 },
      { model: "1D-CNN", experiment: "FedProx", accA: "74.1 ± 3.7", accB: "75.2 ± 3.5", f1A: 69.8, f1B: 71.1, precision: 72.1, recall: 70.0 },
    ],
  },
};

export const THREE_CLIENT_RESULTS = [
  { model: "LSTM", experiment: "Centralized", accC1: 74.1, accC2: 71.5, accC3: 72.8, avgAcc: 72.8, f1C1: 69.8, f1C2: 66.4, f1C3: 68.1, avgF1: 68.1 },
  { model: "LSTM", experiment: "Local", accC1: 72.3, accC2: 68.9, accC3: 70.1, avgAcc: 70.4, f1C1: 67.4, f1C2: 63.2, f1C3: 65.8, avgF1: 65.5 },
  { model: "LSTM", experiment: "FedAvg", accC1: 73.5, accC2: 70.2, accC3: 71.8, avgAcc: 71.8, f1C1: 68.9, f1C2: 65.1, f1C3: 67.2, avgF1: 67.1 },
  { model: "LSTM", experiment: "FedProx", accC1: 78.4, accC2: 72.3, accC3: 76.7, avgAcc: 75.8, f1C1: 74.2, f1C2: 67.8, f1C3: 69.1, avgF1: 70.4 },
  { model: "MLP", experiment: "Centralized", accC1: 71.8, accC2: 69.2, accC3: 69.5, avgAcc: 70.2, f1C1: 67.1, f1C2: 64.3, f1C3: 64.8, avgF1: 65.4 },
  { model: "MLP", experiment: "Local", accC1: 69.4, accC2: 66.1, accC3: 67.8, avgAcc: 67.8, f1C1: 64.2, f1C2: 60.8, f1C3: 63.1, avgF1: 62.7 },
  { model: "MLP", experiment: "FedAvg", accC1: 70.5, accC2: 67.8, accC3: 68.9, avgAcc: 69.1, f1C1: 65.8, f1C2: 62.9, f1C3: 64.2, avgF1: 64.3 },
  { model: "MLP", experiment: "FedProx", accC1: 74.8, accC2: 70.1, accC3: 73.2, avgAcc: 72.7, f1C1: 70.5, f1C2: 65.4, f1C3: 69.1, avgF1: 68.3 },
  { model: "1D-CNN", experiment: "Centralized", accC1: 73.2, accC2: 70.1, accC3: 71.0, avgAcc: 71.4, f1C1: 68.7, f1C2: 65.3, f1C3: 66.5, avgF1: 66.8 },
  { model: "1D-CNN", experiment: "Local", accC1: 70.8, accC2: 67.5, accC3: 69.2, avgAcc: 69.2, f1C1: 65.9, f1C2: 62.1, f1C3: 64.5, avgF1: 64.2 },
  { model: "1D-CNN", experiment: "FedAvg", accC1: 72.1, accC2: 68.9, accC3: 70.4, avgAcc: 70.5, f1C1: 67.5, f1C2: 64.2, f1C3: 65.8, avgF1: 65.8 },
  { model: "1D-CNN", experiment: "FedProx", accC1: 76.2, accC2: 71.4, accC3: 74.8, avgAcc: 74.1, f1C1: 72.1, f1C2: 66.9, f1C3: 70.6, avgF1: 69.9 },
];

export const ROC_DATA = {
  client1: { local: 0.871, centralized: 0.889, fedprox: 0.901 },
  client2: { local: 0.823, centralized: 0.856, fedprox: 0.848 },
  client3: { local: 0.867, centralized: 0.878, fedprox: 0.912 },
};

export const ABLATION_RESULTS = [
  { strategy: "Global Fixed Threshold (τ = 0.5)", accC1: 74.8, accC2: 70.1, accC3: 73.2, avgF1: 68.3, notes: "Baseline — uniform decision boundary across all clients" },
  { strategy: "Per-Client Local Threshold", accC1: 76.2, accC2: 73.8, accC3: 74.1, avgF1: 71.4, notes: "Locally tuned thresholds after federated training; improved on imbalanced clients" },
  { strategy: "Federated Threshold Calibration", accC1: 77.1, accC2: 74.5, accC3: 75.8, avgF1: 72.5, notes: "Clients share aggregate calibration statistics; best balanced performance" },
];

export const CONFUSION_MATRICES = {
  global: {
    client1: { tp: 142, fp: 38, fn: 21, tn: 4311 },
    client2: { tp: 108, fp: 46, fn: 31, tn: 3662 },
    client3: { tp: 198, fp: 62, fn: 24, tn: 4932 },
  },
  perClient: {
    client1: { tp: 151, fp: 35, fn: 12, tn: 4314 },
    client2: { tp: 119, fp: 41, fn: 20, tn: 3667 },
    client3: { tp: 207, fp: 58, fn: 15, tn: 4936 },
  },
  federated: {
    client1: { tp: 156, fp: 32, fn: 7, tn: 4317 },
    client2: { tp: 124, fp: 38, fn: 15, tn: 3670 },
    client3: { tp: 214, fp: 51, fn: 8, tn: 4943 },
  },
};

export const DELONG_RESULTS = [
  { comparison: "Centralized vs FedProx", c1p: 0.142, c2p: 0.089, c3p: 0.231, significant: "No" },
  { comparison: "Centralized vs Local", c1p: 0.023, c2p: 0.011, c3p: 0.078, significant: "Yes (Clients 1, 2)" },
  { comparison: "FedProx vs Local", c1p: 0.008, c2p: 0.072, c3p: 0.031, significant: "Yes (Clients 1, 3)" },
];

export const SUBMISSION_CHECKLIST = [
  { item: "Manuscript (MDPI LaTeX format)", done: true },
  { item: "Abstract (≤250 words)", done: true },
  { item: "All figures (6 total) in high resolution", done: true },
  { item: "All tables (7 total) formatted correctly", done: true },
  { item: "References (49 entries) in MDPI style", done: true },
  { item: "Cover letter drafted", done: true },
  { item: "Suggested reviewers (5 names)", done: true },
  { item: "Final literature sweep completed", done: false },
  { item: "Author contribution statement", done: true },
  { item: "Conflict of interest declaration", done: true },
  { item: "Data availability statement", done: true },
  { item: "Supplementary materials prepared", done: false },
  { item: "Proofreading and grammar check", done: false },
];

export const SUGGESTED_REVIEWERS = [
  { name: "Prof. Brendan McMahan", affiliation: "Google Research, Mountain View, CA, USA", papers: "Communication-Efficient Learning of Deep Networks from Decentralized Data (2017)" },
  { name: "Dr. Virginia Smith", affiliation: "Carnegie Mellon University, Pittsburgh, PA, USA", papers: "Federated Multi-Task Learning (NeurIPS 2017); FedProx: Heterogeneous Federated Optimization" },
  { name: "Prof. Malek Ben Salem", affiliation: "Accenture Labs, Arlington, VA, USA", papers: "Survey of Insider Threat Detection Approaches (2019); CERT Dataset Applications" },
  { name: "Dr. Qiang Yang", affiliation: "Hong Kong University of Science and Technology", papers: "Federated Machine Learning: Concept and Applications (ACM TIST 2019)" },
  { name: "Prof. Elisa Bertino", affiliation: "Purdue University, West Lafayette, IN, USA", papers: "A Data-Centric Approach to Insider Attack Detection (2014); Security Analytics Frameworks" },
];

export const COVER_LETTER = `Dear Editor,

We are pleased to submit our manuscript entitled "A Comparative Analysis of Federated Learning for Cross-Organizational Insider Threat Detection" for consideration in the MDPI AI Journal.

Insider threats account for approximately 34% of all data breaches, yet effective machine learning solutions remain constrained by the inability of organizations to share sensitive behavioral data. Our work addresses this critical gap by presenting the first comprehensive comparative analysis of federated learning frameworks — specifically FedAvg and FedProx — applied to insider threat detection across organizationally heterogeneous environments.

The key contributions of our work include: (1) a systematic evaluation of four neural network architectures under federated conditions using real-world benchmark datasets (CERT and LANL); (2) quantitative characterization of cross-organizational heterogeneity using Jensen–Shannon Divergence; (3) demonstration that FedProx achieves statistically comparable performance to centralized training while preserving data privacy; and (4) a novel client-adaptive threshold calibration mechanism that improves minority-class detection.

We believe this work is well-suited for MDPI AI because it bridges applied machine learning, privacy-preserving computation, and cybersecurity — three domains at the forefront of the journal's scope. The paper presents extensive experimental validation across 47 experiments with rigorous statistical testing.

All authors have read and approved the manuscript, which has not been submitted elsewhere. We declare no conflicts of interest.

We look forward to your consideration.

Sincerely,
Dr. Khalid M. Al-Rashidi (corresponding author)
On behalf of all co-authors`;
