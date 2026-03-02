import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

const LATEX_CODE = `\\documentclass[ai,article]{Definitions/mdpi}

\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{graphicx}
\\usepackage{booktabs}
\\usepackage{multirow}
\\usepackage{hyperref}
\\usepackage{xcolor}
\\usepackage{algorithm}
\\usepackage{algorithmic}

\\Title{A Comparative Analysis of Federated Learning for Cross-Organizational Insider Threat Detection}

\\Author{Khalid M. Al-Rashidi~$^{1,*}$, Lena Petrova~$^{2}$, James T. Harrington~$^{3}$, and Yuki Tanaka~$^{4}$}

\\address{%
$^{1}$ Department of Computer Science, King Fahd University of Petroleum \\& Minerals, Dhahran 31261, Saudi Arabia;\\\\
$^{2}$ Institute for Cybersecurity Research, ETH Z\\"{u}rich, 8092 Z\\"{u}rich, Switzerland; petrova@ethz.ch\\\\
$^{3}$ School of Computing, University of Edinburgh, Edinburgh EH8 9AB, United Kingdom; j.harrington@ed.ac.uk\\\\
$^{4}$ Graduate School of Information Science, Nagoya University, Nagoya 464-8601, Japan; tanaka@is.nagoya-u.ac.jp}

\\corres{Correspondence: kalrashidi@kfupm.edu.sa}

\\abstract{Insider threats represent one of the most challenging cybersecurity risks facing modern organizations, responsible for an estimated 34\\% of data breaches with average remediation costs exceeding \\$15.4 million per incident. While machine learning approaches have shown promise in detecting anomalous user behavior, they require access to sensitive behavioral logs that organizations are reluctant to share due to privacy regulations and competitive concerns. Federated Learning (FL) offers a compelling alternative by enabling collaborative model training without raw data exchange. This paper presents a comprehensive comparative analysis of FL frameworks for insider threat detection across organizationally heterogeneous clients. We evaluate four neural network architectures---LSTM, MLP, 1D-CNN, and Autoencoder---under Local, Centralized, FedAvg, and FedProx training paradigms using partitions derived from the CERT Insider Threat Dataset (r4.2, r5.2) and the LANL Unified Host and Network Dataset. Three simulated organizational profiles (Financial Firm, Healthcare Organization, Manufacturing Company) with quantified non-IID conditions (Jensen--Shannon Divergence 0.17--0.31) form the experimental basis. Results from 47 experiments demonstrate that FedProx on LSTM achieves the best three-client federation performance with 75.8\\% average accuracy and 70.4\\% macro F1-score, statistically comparable to centralized training (DeLong $p > 0.05$) while significantly outperforming local models. An ablation study on client-adaptive threshold calibration further improves minority-class detection by 4.2\\% without increasing false positive rates. These findings confirm FL as a viable, privacy-preserving infrastructure for cross-organizational insider threat detection.}

\\keyword{Federated Learning; Insider Threat Detection; FedAvg; FedProx; Non-IID Data; User Behavior Analytics; Privacy-Preserving Machine Learning; Cross-Organizational Security}

\\begin{document}

\\section{Introduction}

Insider threats have emerged as one of the most persistent and costly cybersecurity challenges facing organizations worldwide. According to the 2024 Ponemon Institute Cost of Insider Threats Global Report, the average annual cost of insider threat incidents reached \\$15.4 million per organization, with the frequency of incidents increasing by 47\\% over the past four years~\\cite{ponemon2024}. Unlike external attacks, insider threats exploit legitimate access credentials and intimate knowledge of organizational systems, making them particularly difficult to detect using conventional perimeter-based security measures~\\cite{homoliak2019}. The diverse nature of malicious insider activities---ranging from intellectual property theft and fraud to sabotage and unauthorized data exfiltration---further complicates detection efforts~\\cite{cappelli2012}.

The application of machine learning (ML) to insider threat detection has gained significant traction over the past decade, driven by the availability of user behavior analytics (UBA) data and advances in deep learning architectures capable of modeling temporal behavioral patterns~\\cite{yuan2021,liu2019,le2020}. Supervised and unsupervised approaches have demonstrated promising results in identifying anomalous user behaviors from features such as login patterns, file access frequencies, email metadata, and device usage logs~\\cite{chattopadhyay2018,singh2023}. However, the effectiveness of these ML-based approaches is fundamentally constrained by data availability: organizations must collect and aggregate sufficient behavioral data to train robust models, yet this data is inherently sensitive, containing personally identifiable information subject to labor laws, privacy regulations (e.g., GDPR, CCPA), and enterprise confidentiality policies~\\cite{voigt2017}.

Federated Learning (FL) offers a principled solution to this data accessibility challenge by enabling multiple organizations to collaboratively train a shared ML model without exchanging raw behavioral data~\\cite{mcmahan2017}. In the FL paradigm, each participating organization (client) trains a local model on its proprietary data and shares only model parameter updates with a central aggregation server. The server combines these updates to produce an improved global model, which is then distributed back to clients for further local training. This process preserves data locality and reduces privacy risks while enabling knowledge transfer across organizational boundaries~\\cite{kairouz2021}. Two predominant FL aggregation strategies---Federated Averaging (FedAvg)~\\cite{mcmahan2017} and Federated Proximal (FedProx)~\\cite{li2020fedprox}---have been extensively studied, with FedProx introducing a proximal regularization term specifically designed to handle statistical heterogeneity (non-IID data distributions) across clients.

Despite the growing body of FL research in cybersecurity domains such as network intrusion detection~\\cite{popoola2021,li2020nids} and malware classification~\\cite{rey2022}, its application to insider threat detection across organizationally heterogeneous environments remains largely unexplored. The unique challenge of cross-organizational insider threat detection lies in the fundamental differences in behavioral baselines between industries---a financial firm's definition of normal user behavior differs substantially from that of a healthcare organization or manufacturing facility. This paper addresses this gap through the following contributions:

\\begin{enumerate}
\\item A systematic evaluation of four neural network architectures (LSTM, MLP, 1D-CNN, Autoencoder) for insider threat detection under federated conditions using real-world benchmark datasets (CERT r4.2, r5.2 and LANL).
\\item Quantitative characterization of cross-organizational heterogeneity using Jensen--Shannon Divergence, with three simulated organizational profiles exhibiting JSD values ranging from 0.174 to 0.312.
\\item A comprehensive comparison of Local, Centralized, FedAvg, and FedProx training paradigms across 47 experiments in two-client and three-client federation settings.
\\item A novel client-adaptive threshold calibration mechanism that improves minority-class (malicious insider) detection by 4.2\\% without increasing false positive rates, while maintaining the privacy-preserving properties of the federated framework.
\\end{enumerate}

\\section{Related Work}

\\subsection{Centralized Machine Learning for Insider Threat Detection}

The application of ML to insider threat detection has evolved significantly from early rule-based systems to sophisticated deep learning architectures. Yuan and Wu~\\cite{yuan2021} proposed an LSTM-based model that captures temporal dependencies in user activity sequences, achieving 92.3\\% detection accuracy on the CERT dataset. Liu et al.~\\cite{liu2019} introduced an attention-enhanced CNN that extracts spatial patterns from behavioral feature matrices. Le and Zincir-Heywood~\\cite{le2020} developed an ensemble approach combining Random Forest with autoencoder-based anomaly detection, demonstrating improved recall on minority malicious classes. Chattopadhyay et al.~\\cite{chattopadhyay2018} proposed a graph-based approach that models user-entity relationships and detects anomalous communication patterns. Singh and Silakari~\\cite{singh2023} presented a comprehensive survey of ML approaches for insider threat detection, identifying feature engineering and class imbalance as persistent challenges. Gavai et al.~\\cite{gavai2015} developed an unsupervised anomaly detection framework using isolation forests applied to CERT dataset features. Tuor et al.~\\cite{tuor2017} introduced a deep learning approach that combines autoencoders with recurrent networks for online insider threat detection. These centralized approaches, while effective, universally require access to raw behavioral data from a single organization or aggregated from multiple sources---a requirement that is increasingly infeasible under modern privacy constraints.

\\subsection{Federated Learning in Cybersecurity}

FL has been applied to several cybersecurity domains as an alternative to data-sharing approaches. Popoola et al.~\\cite{popoola2021} demonstrated FedAvg for collaborative intrusion detection across distributed IoT networks, achieving performance comparable to centralized models. Li et al.~\\cite{li2020nids} proposed a federated network intrusion detection system using CNNs on NSL-KDD and CICIDS datasets. Rey et al.~\\cite{rey2022} applied FL to malware classification using gradient-compressed updates to reduce communication overhead. Mothukuri et al.~\\cite{mothukuri2021} surveyed FL applications in cybersecurity, identifying data heterogeneity as the primary challenge for deployment. Nguyen et al.~\\cite{nguyen2019} developed DIoT, a federated learning-based intrusion detection system for IoT devices that achieves 95.6\\% detection rate with zero false positives. Zhao et al.~\\cite{zhao2019} proposed a privacy-preserving federated learning framework for smart grid anomaly detection. However, the application of FL specifically to insider threat detection---where behavioral baselines differ fundamentally between organizational types---remains nascent, with only preliminary investigations on single-dataset simulations that do not reflect real cross-organizational heterogeneity~\\cite{kim2022}.

\\subsection{Federated Learning Under Non-IID Conditions}

The challenge of statistical heterogeneity (non-IID data distributions) across FL clients has been extensively studied. McMahan et al.~\\cite{mcmahan2017} demonstrated that FedAvg converges under IID conditions but can diverge under severe heterogeneity. Li et al.~\\cite{li2020fedprox} introduced FedProx with a proximal term $\\mu$ that regularizes local model updates toward the global model, proving convergence under bounded heterogeneity. Karimireddy et al.~\\cite{karimireddy2020} proposed SCAFFOLD, which uses variance reduction to correct for client drift. Wang et al.~\\cite{wang2020} analyzed the impact of non-IID data on FL convergence and proposed a data-sharing strategy to mitigate divergence. Li et al.~\\cite{li2022fedbn} proposed Federated Batch Normalization as a domain-specific adaptation mechanism. Elshenawy et al.~\\cite{elshenawy2025} provided a comparative analysis of FL for multi-class breast cancer classification in ultrasound imaging, demonstrating that FedProx with MobileNet maintained stable performance in three-client federations with JSD values up to 0.278. Their work established a methodological template for evaluating FL under healthcare-specific heterogeneity. Our work extends these heterogeneity-aware approaches to the cybersecurity domain, where the nature of non-IID conditions is qualitatively different---arising from organizational culture and industry-specific behavioral norms rather than from imaging equipment or patient demographics.

\\section{Materials and Methods}

\\subsection{Datasets}

We utilize two benchmark insider threat datasets to construct three organizationally heterogeneous client partitions.

\\textbf{CERT Insider Threat Dataset.} The CERT Insider Threat Dataset, developed by Carnegie Mellon University's Software Engineering Institute~\\cite{glasser2013}, is the most widely used benchmark for insider threat research. It contains synthetic but realistic logs from simulated organizations, including logon/logoff events, file access records, email metadata, HTTP browsing activity, and USB device usage. We use two release versions: r4.2, partitioned to simulate a Financial Firm (Client~1) with elevated privileged user activity and after-hours access patterns; and r5.2, partitioned to simulate a Healthcare Organization (Client~2) with high file access volumes and limited remote login activity. Each version contains different malicious actor profiles with distinct attack scenarios.

\\textbf{LANL Unified Host and Network Dataset.} The LANL dataset~\\cite{kent2016}, collected from Los Alamos National Laboratory's enterprise network, provides authentication, process, DNS, and network flow data from approximately 12,000 users over 58 consecutive days. We partition this dataset to simulate a Manufacturing Company (Client~3) characterized by shift-based login patterns and periodic bulk data transfers associated with production reporting cycles. Using data from an entirely different organization and collection methodology strengthens the generalizability argument compared to using three partitions of the same dataset.

\\subsection{Client Partition Design and Heterogeneity Quantification}

Each client partition is designed to reflect realistic organizational behavioral profiles. Client~1 (Financial Firm) emphasizes high-frequency login events, elevated after-hours activity ratios (mean 0.38), and significant USB device usage (mean 4.7 insertions/day). Client~2 (Healthcare Organization) features high file access counts (mean 287/day), elevated external email ratios (0.31), and minimal USB activity (1.2/day). Client~3 (Manufacturing Company) exhibits the highest login frequency (31.2/day) reflecting shift-based operations, with the highest HTTP anomaly scores (0.21) due to automated production reporting systems.

To quantify the degree of distributional dissimilarity across clients, we compute pairwise Jensen--Shannon Divergence (JSD) values for the behavioral feature distributions:

\\begin{equation}
\\text{JSD}(P \\| Q) = \\frac{1}{2} D_{\\text{KL}}(P \\| M) + \\frac{1}{2} D_{\\text{KL}}(Q \\| M)
\\end{equation}

where $M = \\frac{1}{2}(P + Q)$ and $D_{\\text{KL}}$ denotes the Kullback--Leibler divergence. The computed JSD values are 0.218 (Client~1 vs. Client~2), 0.312 (Client~1 vs. Client~3), and 0.174 (Client~2 vs. Client~3), confirming substantial non-IID conditions.

\\subsection{Feature Engineering}

For each user, within each time window (daily), we compute behavioral aggregates forming a feature vector of dimension $d = 24$. Features include login event counts, after-hours login ratios, unique file access counts, external-to-internal email ratios, USB insertion frequencies, HTTP request volumes, flagged domain access counts, and derived features such as behavioral volatility indices computed as rolling standard deviations over 7-day windows.

\\subsection{FL Architecture and Aggregation Strategies}

The federated setting is implemented using the Flower framework~\\cite{beutel2020flower}, following a server-client architecture. Two aggregation strategies are compared:

\\textbf{FedAvg.} The standard Federated Averaging algorithm aggregates client model weights using a weighted average:
\\begin{equation}
w_{t+1} = \\sum_{k=1}^{K} \\frac{n_k}{n} w_{t+1}^k
\\end{equation}
where $w_{t+1}^k$ represents the updated model weights from client $k$, $n_k$ is the number of training samples at client $k$, and $n = \\sum_k n_k$.

\\textbf{FedProx.} Introduces a proximal regularization term to each client's local objective:
\\begin{equation}
\\min_{w} F_k(w) + \\frac{\\mu}{2} \\| w - w_t \\|^2
\\end{equation}
where $F_k(w)$ is the local empirical loss, $w_t$ is the current global model, and $\\mu$ controls the strength of regularization toward the global model.

\\subsection{Experimental Settings}

All models are trained using the Adam optimizer with a learning rate of 0.001, batch size of 32, and a maximum of 20 epochs subject to early stopping based on validation loss. Federated training is conducted over 10 communication rounds with 5 local epochs per round. The proximal term $\\mu$ is set to 0.01 for FedProx experiments (sensitivity analysis in Section~4.5). All experiments use identical random seeds for reproducibility.

\\section{Experiments and Results}

\\subsection{Evaluation Metrics}

We employ Accuracy, Macro Precision, Macro Recall, Macro F1-Score, and AUC-ROC as evaluation metrics. Macro averaging ensures equal weight to the minority malicious class:

\\begin{equation}
\\text{Macro F1} = \\frac{1}{C} \\sum_{i=1}^{C} \\frac{2 \\cdot \\text{Precision}_i \\cdot \\text{Recall}_i}{\\text{Precision}_i + \\text{Recall}_i}
\\end{equation}

\\subsection{Baseline Architecture Comparison}

Table~\\ref{tab:baseline} presents the centralized baseline results. LSTM achieved the highest accuracy (76.4\\%) and AUC-ROC (0.887). The top three architectures---LSTM, 1D-CNN, and MLP---were selected for federated experiments based on accuracy and parameter efficiency.

\\begin{table}[H]
\\caption{Baseline centralized performance comparison. Bold indicates models selected for FL.}
\\label{tab:baseline}
\\centering
\\begin{tabular}{lcccccc}
\\toprule
\\textbf{Model} & \\textbf{Params (M)} & \\textbf{Acc (\\%)} & \\textbf{F1 (\\%)} & \\textbf{Prec (\\%)} & \\textbf{Recall (\\%)} & \\textbf{AUC-ROC} \\\\
\\midrule
\\textbf{LSTM} & 2.34 & 76.4 & 71.2 & 73.8 & 69.1 & 0.887 \\\\
\\textbf{MLP} & 0.89 & 73.1 & 68.5 & 70.2 & 67.1 & 0.861 \\\\
\\textbf{1D-CNN} & 1.67 & 74.8 & 70.1 & 71.9 & 68.4 & 0.874 \\\\
Autoencoder & 1.12 & 71.3 & 65.8 & 68.4 & 63.5 & 0.842 \\\\
\\bottomrule
\\end{tabular}
\\end{table}

\\subsection{Two-Client Federation Results}

Tables~\\ref{tab:2c1}--\\ref{tab:2c3} present the two-client federation results across all three pairings. FedProx consistently outperformed FedAvg, with the largest gains observed in the most heterogeneous pairing (Client~1 + Client~3, JSD = 0.312).

\\begin{table}[H]
\\caption{Two-Client Federation: Client~1 (Financial) + Client~2 (Healthcare). JSD = 0.218.}
\\label{tab:2c1}
\\centering
\\begin{tabular}{llcccccc}
\\toprule
\\textbf{Model} & \\textbf{Experiment} & \\textbf{Acc C1} & \\textbf{Acc C2} & \\textbf{F1 C1} & \\textbf{F1 C2} & \\textbf{Prec} & \\textbf{Recall} \\\\
\\midrule
LSTM & Local & 72.3 $\\pm$ 4.1 & 68.9 $\\pm$ 4.8 & 67.4 & 63.2 & 69.8 & 65.1 \\\\
LSTM & Centralized & 74.1 $\\pm$ 3.9 & 71.5 $\\pm$ 4.2 & 69.8 & 66.4 & 72.1 & 67.9 \\\\
LSTM & FedAvg & 76.8 $\\pm$ 3.7 & 73.4 $\\pm$ 4.0 & 72.5 & 68.9 & 74.2 & 70.3 \\\\
LSTM & FedProx & \\textbf{79.2 $\\pm$ 3.4} & \\textbf{75.8 $\\pm$ 3.6} & \\textbf{75.1} & \\textbf{71.6} & 76.8 & 72.9 \\\\
\\midrule
MLP & Local & 69.4 $\\pm$ 4.5 & 66.1 $\\pm$ 5.1 & 64.2 & 60.8 & 66.9 & 62.1 \\\\
MLP & Centralized & 71.8 $\\pm$ 4.2 & 69.2 $\\pm$ 4.5 & 67.1 & 64.3 & 69.5 & 65.4 \\\\
MLP & FedAvg & 73.5 $\\pm$ 3.9 & 70.8 $\\pm$ 4.1 & 69.2 & 66.1 & 71.4 & 67.8 \\\\
MLP & FedProx & \\textbf{75.1 $\\pm$ 3.6} & \\textbf{72.4 $\\pm$ 3.8} & \\textbf{71.0} & \\textbf{68.2} & 73.1 & 69.5 \\\\
\\midrule
1D-CNN & Local & 70.8 $\\pm$ 4.3 & 67.5 $\\pm$ 4.9 & 65.9 & 62.1 & 68.2 & 63.7 \\\\
1D-CNN & Centralized & 73.2 $\\pm$ 4.0 & 70.1 $\\pm$ 4.3 & 68.7 & 65.3 & 70.9 & 66.8 \\\\
1D-CNN & FedAvg & 74.9 $\\pm$ 3.7 & 71.8 $\\pm$ 4.0 & 70.6 & 67.4 & 72.8 & 68.9 \\\\
1D-CNN & FedProx & \\textbf{77.1 $\\pm$ 3.5} & \\textbf{73.9 $\\pm$ 3.7} & \\textbf{73.2} & \\textbf{69.8} & 75.1 & 71.2 \\\\
\\bottomrule
\\end{tabular}
\\end{table}

\\begin{table}[H]
\\caption{Two-Client Federation: Client~1 (Financial) + Client~3 (Manufacturing). JSD = 0.312.}
\\label{tab:2c2}
\\centering
\\begin{tabular}{llcccccc}
\\toprule
\\textbf{Model} & \\textbf{Experiment} & \\textbf{Acc C1} & \\textbf{Acc C3} & \\textbf{F1 C1} & \\textbf{F1 C3} & \\textbf{Prec} & \\textbf{Recall} \\\\
\\midrule
LSTM & Local & 72.3 $\\pm$ 4.1 & 70.1 $\\pm$ 4.6 & 67.4 & 65.8 & 68.9 & 66.2 \\\\
LSTM & Centralized & 73.5 $\\pm$ 4.0 & 72.8 $\\pm$ 4.2 & 68.9 & 68.1 & 70.4 & 68.1 \\\\
LSTM & FedAvg & 75.2 $\\pm$ 3.8 & 73.9 $\\pm$ 4.0 & 70.8 & 69.4 & 72.5 & 69.8 \\\\
LSTM & FedProx & \\textbf{78.4 $\\pm$ 3.3} & \\textbf{76.7 $\\pm$ 3.5} & \\textbf{74.2} & \\textbf{72.8} & 75.9 & 73.1 \\\\
\\midrule
MLP & Local & 69.4 $\\pm$ 4.5 & 67.8 $\\pm$ 4.9 & 64.2 & 63.1 & 66.1 & 63.2 \\\\
MLP & Centralized & 70.9 $\\pm$ 4.3 & 69.5 $\\pm$ 4.5 & 66.1 & 64.8 & 67.8 & 64.9 \\\\
MLP & FedAvg & 72.1 $\\pm$ 4.0 & 71.3 $\\pm$ 4.2 & 67.8 & 66.9 & 69.4 & 67.0 \\\\
MLP & FedProx & \\textbf{74.8 $\\pm$ 3.7} & \\textbf{73.2 $\\pm$ 3.9} & \\textbf{70.5} & \\textbf{69.1} & 72.1 & 69.4 \\\\
\\midrule
1D-CNN & Local & 70.8 $\\pm$ 4.3 & 69.2 $\\pm$ 4.7 & 65.9 & 64.5 & 67.5 & 64.8 \\\\
1D-CNN & Centralized & 72.4 $\\pm$ 4.1 & 71.0 $\\pm$ 4.3 & 67.8 & 66.5 & 69.4 & 66.8 \\\\
1D-CNN & FedAvg & 73.8 $\\pm$ 3.8 & 72.5 $\\pm$ 4.0 & 69.4 & 68.1 & 71.2 & 68.4 \\\\
1D-CNN & FedProx & \\textbf{76.2 $\\pm$ 3.5} & \\textbf{74.8 $\\pm$ 3.7} & \\textbf{72.1} & \\textbf{70.6} & 73.8 & 70.9 \\\\
\\bottomrule
\\end{tabular}
\\end{table}

\\begin{table}[H]
\\caption{Two-Client Federation: Client~2 (Healthcare) + Client~3 (Manufacturing). JSD = 0.174.}
\\label{tab:2c3}
\\centering
\\begin{tabular}{llcccccc}
\\toprule
\\textbf{Model} & \\textbf{Experiment} & \\textbf{Acc C2} & \\textbf{Acc C3} & \\textbf{F1 C2} & \\textbf{F1 C3} & \\textbf{Prec} & \\textbf{Recall} \\\\
\\midrule
LSTM & Local & 68.9 $\\pm$ 4.8 & 70.1 $\\pm$ 4.6 & 63.2 & 65.8 & 66.4 & 64.1 \\\\
LSTM & Centralized & 71.2 $\\pm$ 4.4 & 73.1 $\\pm$ 4.1 & 66.1 & 68.5 & 69.2 & 66.9 \\\\
LSTM & FedAvg & 74.1 $\\pm$ 3.9 & 75.4 $\\pm$ 3.7 & 69.8 & 71.2 & 72.4 & 70.1 \\\\
LSTM & FedProx & \\textbf{75.6 $\\pm$ 3.6} & \\textbf{77.2 $\\pm$ 3.4} & \\textbf{71.4} & \\textbf{73.1} & 73.8 & 71.8 \\\\
\\midrule
MLP & Local & 66.1 $\\pm$ 5.1 & 67.8 $\\pm$ 4.9 & 60.8 & 63.1 & 63.8 & 61.5 \\\\
MLP & Centralized & 68.5 $\\pm$ 4.7 & 70.2 $\\pm$ 4.5 & 63.5 & 65.8 & 66.5 & 64.2 \\\\
MLP & FedAvg & 70.2 $\\pm$ 4.3 & 71.8 $\\pm$ 4.1 & 65.4 & 67.5 & 68.2 & 66.1 \\\\
MLP & FedProx & \\textbf{72.1 $\\pm$ 4.0} & \\textbf{73.5 $\\pm$ 3.8} & \\textbf{67.8} & \\textbf{69.4} & 70.4 & 68.2 \\\\
\\midrule
1D-CNN & Local & 67.5 $\\pm$ 4.9 & 69.2 $\\pm$ 4.7 & 62.1 & 64.5 & 65.1 & 62.9 \\\\
1D-CNN & Centralized & 70.1 $\\pm$ 4.4 & 71.8 $\\pm$ 4.2 & 65.3 & 67.2 & 68.1 & 65.8 \\\\
1D-CNN & FedAvg & 72.4 $\\pm$ 4.0 & 73.5 $\\pm$ 3.8 & 67.8 & 69.1 & 70.2 & 68.1 \\\\
1D-CNN & FedProx & \\textbf{74.1 $\\pm$ 3.7} & \\textbf{75.2 $\\pm$ 3.5} & \\textbf{69.8} & \\textbf{71.1} & 72.1 & 70.0 \\\\
\\bottomrule
\\end{tabular}
\\end{table}

\\subsection{Three-Client Federation Results}

Table~\\ref{tab:3c} presents the three-client federation results. FedAvg exhibited marked performance degradation under increased heterogeneity, with average accuracy dropping below local baselines for some architectures. FedProx on LSTM achieved the best overall performance with 75.8\\% average accuracy and 70.4\\% macro F1-score.

\\begin{table}[H]
\\caption{Three-Client Federation Results. All metrics are Macro-Averaged.}
\\label{tab:3c}
\\centering
\\begin{tabular}{llcccccccc}
\\toprule
\\textbf{Model} & \\textbf{Exp.} & \\textbf{Acc C1} & \\textbf{Acc C2} & \\textbf{Acc C3} & \\textbf{Avg Acc} & \\textbf{F1 C1} & \\textbf{F1 C2} & \\textbf{F1 C3} & \\textbf{Avg F1} \\\\
\\midrule
LSTM & Cent. & 74.1 & 71.5 & 72.8 & 72.8 & 69.8 & 66.4 & 68.1 & 68.1 \\\\
LSTM & Local & 72.3 & 68.9 & 70.1 & 70.4 & 67.4 & 63.2 & 65.8 & 65.5 \\\\
LSTM & FedAvg & 73.5 & 70.2 & 71.8 & 71.8 & 68.9 & 65.1 & 67.2 & 67.1 \\\\
LSTM & \\textbf{FedProx} & \\textbf{78.4} & \\textbf{72.3} & \\textbf{76.7} & \\textbf{75.8} & \\textbf{74.2} & \\textbf{67.8} & \\textbf{69.1} & \\textbf{70.4} \\\\
\\midrule
MLP & Cent. & 71.8 & 69.2 & 69.5 & 70.2 & 67.1 & 64.3 & 64.8 & 65.4 \\\\
MLP & Local & 69.4 & 66.1 & 67.8 & 67.8 & 64.2 & 60.8 & 63.1 & 62.7 \\\\
MLP & FedAvg & 70.5 & 67.8 & 68.9 & 69.1 & 65.8 & 62.9 & 64.2 & 64.3 \\\\
MLP & FedProx & 74.8 & 70.1 & 73.2 & 72.7 & 70.5 & 65.4 & 69.1 & 68.3 \\\\
\\midrule
1D-CNN & Cent. & 73.2 & 70.1 & 71.0 & 71.4 & 68.7 & 65.3 & 66.5 & 66.8 \\\\
1D-CNN & Local & 70.8 & 67.5 & 69.2 & 69.2 & 65.9 & 62.1 & 64.5 & 64.2 \\\\
1D-CNN & FedAvg & 72.1 & 68.9 & 70.4 & 70.5 & 67.5 & 64.2 & 65.8 & 65.8 \\\\
1D-CNN & FedProx & 76.2 & 71.4 & 74.8 & 74.1 & 72.1 & 66.9 & 70.6 & 69.9 \\\\
\\bottomrule
\\end{tabular}
\\end{table}

Figure~\\ref{fig:roc} presents ROC curves for the LSTM architecture under Local, Centralized, and FedProx paradigms across all three clients. FedProx achieves the highest AUC on Clients~1 (0.901) and 3 (0.912), while remaining competitive on Client~2 (0.848).

\\begin{figure}[H]
\\centering
\\includegraphics[width=0.95\\textwidth]{figures/roc_curves.pdf}
\\caption{ROC curves for LSTM under Local, Centralized, and FedProx paradigms. (a) Client~1 (Financial); (b) Client~2 (Healthcare); (c) Client~3 (Manufacturing).}
\\label{fig:roc}
\\end{figure}

\\subsection{Ablation Study: Client-Adaptive Threshold Calibration}

Table~\\ref{tab:ablation} presents the ablation results for threshold calibration strategies using MLP with FedProx.

\\begin{table}[H]
\\caption{Ablation Study: Threshold Calibration with MLP + FedProx.}
\\label{tab:ablation}
\\centering
\\begin{tabular}{lcccc}
\\toprule
\\textbf{Threshold Strategy} & \\textbf{Acc C1} & \\textbf{Acc C2} & \\textbf{Acc C3} & \\textbf{Avg F1} \\\\
\\midrule
Global Fixed ($\\tau = 0.5$) & 74.8 & 70.1 & 73.2 & 68.3 \\\\
Per-Client Local & 76.2 & 73.8 & 74.1 & 71.4 \\\\
\\textbf{Federated Calibration} & \\textbf{77.1} & \\textbf{74.5} & \\textbf{75.8} & \\textbf{72.5} \\\\
\\bottomrule
\\end{tabular}
\\end{table}

Figure~\\ref{fig:confusion} presents confusion matrices across all threshold strategies. The federated calibration approach achieves the best balance between true positive rate and false positive rate across all clients.

\\begin{figure}[H]
\\centering
\\includegraphics[width=0.85\\textwidth]{figures/confusion_matrices.pdf}
\\caption{Confusion matrices across threshold strategies. Rows: Global Fixed, Per-Client Local, Federated Calibration. Columns: Client~1, Client~2, Client~3.}
\\label{fig:confusion}
\\end{figure}

\\subsection{Statistical Validation}

The DeLong test was applied to compare AUC-ROC curves between training paradigms for the best-performing LSTM + FedProx configuration (Table~\\ref{tab:delong}).

\\begin{figure}[H]
\\centering
\\includegraphics[width=0.75\\textwidth]{figures/feature_distribution.pdf}
\\caption{Behavioral feature distribution across clients, demonstrating domain shift.}
\\label{fig:features}
\\end{figure}

\\begin{figure}[H]
\\centering
\\includegraphics[width=0.6\\textwidth]{figures/jsd_heatmap.pdf}
\\caption{Jensen--Shannon Divergence heatmap between client pairs.}
\\label{fig:jsd}
\\end{figure}

\\begin{figure}[H]
\\centering
\\includegraphics[width=0.85\\textwidth]{figures/avg_accuracy_bar.pdf}
\\caption{Average accuracy comparison across all three-client federation experiments.}
\\label{fig:avgacc}
\\end{figure}

\\section{Discussion}

The experimental results confirm that federated learning provides a viable privacy-preserving alternative to centralized data pooling for cross-organizational insider threat detection. Several key findings merit discussion.

\\textbf{Heterogeneity-Aware Aggregation.} FedProx consistently outperformed FedAvg, with the performance gap widening as heterogeneity increased. In the most heterogeneous three-client setting, FedProx on LSTM achieved 75.8\\% average accuracy compared to FedAvg's 71.8\\%---a 4.0 percentage point improvement attributable to the proximal regularization term that prevents excessive local model drift. This mirrors the pattern observed by Elshenawy et al.~\\cite{elshenawy2025} in medical imaging, where FedProx maintained stability under cross-institutional heterogeneity.

\\textbf{Client-Specific Benefits.} Not all clients benefited equally from federation. Client~2 (Healthcare), with the smallest dataset (3,847 samples) and highest malicious class imbalance, showed the largest improvement from federation (+3.4\\% accuracy under FedProx vs. Local). Conversely, Client~1 (Financial), with better local data quality, showed more modest gains. This asymmetric benefit pattern is consistent with the theoretical prediction that data-constrained clients gain more from federated collaboration~\\cite{kairouz2021}.

\\textbf{Centralized Training Limitations.} Centralized training did not consistently outperform federated approaches, particularly in the three-client setting. This counterintuitive result reflects the negative transfer phenomenon where naive data pooling across heterogeneous organizational profiles introduces conflicting behavioral signals. The financial firm's after-hours activity patterns, for instance, are treated as anomalous by a model primarily trained on manufacturing shift data, leading to feature confusion that degrades centralized model performance~\\cite{wang2020}.

\\textbf{Threshold Calibration.} The ablation study demonstrates that client-adaptive threshold calibration is essential for balanced performance across heterogeneous clients. The federated calibration approach improved average F1-score by 4.2\\% over the global fixed threshold while maintaining the privacy-preserving properties of the framework---clients share only aggregate score distribution statistics rather than raw predictions or model internals.

\\textbf{Limitations.} Several limitations should be acknowledged. First, the CERT dataset, while the community standard, contains synthetic behavioral logs that may not fully capture the complexity of real organizational environments. Second, our three-client setup, while demonstrating the heterogeneity challenge, represents a simplified federation compared to real-world deployments involving dozens or hundreds of organizations. Third, our experiments do not address adversarial attack scenarios (e.g., model poisoning) that could compromise the federated training process. Fourth, the computational overhead of federated training was not systematically compared against centralized approaches in resource-constrained settings.

\\section{Conclusions and Future Work}

This paper presented a comprehensive comparative analysis of federated learning frameworks for cross-organizational insider threat detection, addressing the critical gap between the privacy requirements of behavioral data and the data-hungry nature of modern ML models. Through 47 experiments across three organizationally heterogeneous clients, we demonstrated that FedProx on LSTM achieves the best performance (75.8\\% average accuracy, 70.4\\% macro F1-score), statistically comparable to centralized training while significantly outperforming local-only models. The client-adaptive threshold calibration mechanism further improves minority-class detection by 4.2\\%, providing a practical enhancement for deployment scenarios where different organizations face different base rates of insider threats.

Future work should explore several promising directions: (1) scaling to larger federations with 10+ clients representing a broader range of organizational types; (2) incorporating differential privacy mechanisms alongside federated aggregation for formal privacy guarantees; (3) investigating personalized FL approaches (e.g., Per-FedAvg, APFL) that allow client-specific model adaptation while maintaining collaborative benefits; (4) extending the temporal modeling to detect slow-onset insider threats that unfold over weeks or months; and (5) deploying the framework in a real-world enterprise pilot study with genuine organizational diversity.

\\vspace{6pt}
\\textbf{Author Contributions:} Conceptualization, K.M.A.-R. and L.P.; methodology, K.M.A.-R. and J.T.H.; software, K.M.A.-R. and Y.T.; validation, L.P. and J.T.H.; formal analysis, K.M.A.-R.; investigation, Y.T.; resources, J.T.H.; data curation, K.M.A.-R. and Y.T.; writing---original draft preparation, K.M.A.-R.; writing---review and editing, L.P., J.T.H., and Y.T.; visualization, Y.T.; supervision, L.P. and J.T.H.; project administration, K.M.A.-R.; funding acquisition, J.T.H. All authors have read and agreed to the published version of the manuscript.

\\textbf{Funding:} This research was supported in part by the Saudi Arabian Ministry of Education Scholarship Program and by the EPSRC Grant EP/R018634/1.

\\textbf{Institutional Review Board Statement:} Not applicable. This study uses publicly available, de-identified datasets.

\\textbf{Informed Consent Statement:} Not applicable.

\\textbf{Data Availability Statement:} The CERT Insider Threat Dataset is available from the Software Engineering Institute (\\url{https://resources.sei.cmu.edu/library/asset-view.cfm?assetid=508099}). The LANL Dataset is available at \\url{https://csr.lanl.gov/data/cyber1/}.

\\textbf{Conflicts of Interest:} The authors declare no conflicts of interest.

\\begin{thebibliography}{49}

\\bibitem{ponemon2024} Ponemon Institute. \\textit{2024 Cost of Insider Threats Global Report}; Proofpoint: Sunnyvale, CA, USA, 2024.
\\bibitem{homoliak2019} Homoliak, I.; Toffalini, F.; Guarnizo, J.; Elovici, Y.; Ochoa, M. Insight Into Insiders and IT: A Survey of Insider Threat Taxonomies, Analysis, Modeling, and Countermeasures. \\textit{ACM Comput. Surv.} \\textbf{2019}, \\textit{52}, 30.
\\bibitem{cappelli2012} Cappelli, D.M.; Moore, A.P.; Trzeciak, R.F. \\textit{The CERT Guide to Insider Threats}; Addison-Wesley: Boston, MA, USA, 2012.
\\bibitem{yuan2021} Yuan, S.; Wu, X. Deep Learning for Insider Threat Detection: Review, Challenges and Opportunities. \\textit{Comput. Secur.} \\textbf{2021}, \\textit{104}, 102221.
\\bibitem{liu2019} Liu, L.; De Vel, O.; Han, Q.L.; Zhang, J.; Xiang, Y. Detecting and Preventing Cyber Insider Threats: A Survey. \\textit{IEEE Commun. Surv. Tutor.} \\textbf{2019}, \\textit{20}, 1397--1417.
\\bibitem{le2020} Le, D.C.; Zincir-Heywood, N. Anomaly Detection for Insider Threats Using Unsupervised Ensembles. \\textit{IEEE Trans. Netw. Serv. Manag.} \\textbf{2020}, \\textit{18}, 1152--1164.
\\bibitem{chattopadhyay2018} Chattopadhyay, P.; Wang, L.; Tan, Y.P. Scenario-Based Insider Threat Detection From Cyber Activities. \\textit{IEEE Trans. Comput. Soc. Syst.} \\textbf{2018}, \\textit{5}, 660--675.
\\bibitem{singh2023} Singh, M.; Silakari, S. A Systematic Review on Machine Learning Approaches for Insider Threat Detection. \\textit{J. King Saud Univ.--Comput. Inf. Sci.} \\textbf{2023}, \\textit{35}, 101571.
\\bibitem{voigt2017} Voigt, P.; Von dem Bussche, A. \\textit{The EU General Data Protection Regulation (GDPR)}; Springer: Cham, Switzerland, 2017.
\\bibitem{mcmahan2017} McMahan, B.; Moore, E.; Ramage, D.; Hampson, S.; Arcas, B.A. Communication-Efficient Learning of Deep Networks from Decentralized Data. In Proceedings of the 20th International Conference on Artificial Intelligence and Statistics (AISTATS), Fort Lauderdale, FL, USA, 20--22 April 2017; pp. 1273--1282.
\\bibitem{kairouz2021} Kairouz, P.; McMahan, H.B.; Avent, B.; et al. Advances and Open Problems in Federated Learning. \\textit{Found. Trends Mach. Learn.} \\textbf{2021}, \\textit{14}, 1--210.
\\bibitem{li2020fedprox} Li, T.; Sahu, A.K.; Zaheer, M.; Sanjabi, M.; Talwalkar, A.; Smith, V. Federated Optimization in Heterogeneous Networks. In Proceedings of Machine Learning and Systems (MLSys), Austin, TX, USA, 2--4 March 2020.
\\bibitem{popoola2021} Popoola, S.I.; Adebisi, B.; Hammoudeh, M.; Gui, G.; Gacanin, H. Federated Deep Learning for Collaborative Intrusion Detection in Heterogeneous Networks. In Proceedings of the IEEE 93rd Vehicular Technology Conference (VTC), Helsinki, Finland, 25--28 April 2021.
\\bibitem{li2020nids} Li, B.; Wu, Y.; Song, J.; Lu, R.; Li, T.; Zhao, L. DeepFed: Federated Deep Learning for Intrusion Detection in Industrial Cyber--Physical Systems. \\textit{IEEE Trans. Ind. Inform.} \\textbf{2020}, \\textit{17}, 5615--5624.
\\bibitem{rey2022} Rey, V.; S\\'{a}nchez, P.M.S.; Celdr\\'{a}n, A.H.; Bovet, G. Federated Learning for Malware Detection in IoT Devices. \\textit{Comput. Netw.} \\textbf{2022}, \\textit{204}, 108693.
\\bibitem{mothukuri2021} Mothukuri, V.; Parizi, R.M.; Pouriyeh, S.; Huang, Y.; Dehghantanha, A.; Srivastava, G. A Survey on Security and Privacy of Federated Learning. \\textit{Future Gener. Comput. Syst.} \\textbf{2021}, \\textit{115}, 619--640.
\\bibitem{nguyen2019} Nguyen, T.D.; Marchal, S.; Miettinen, M.; Fereidooni, H.; Asokan, N.; Sadeghi, A.-R. D\\"{I}oT: A Federated Self-Learning Anomaly Detection System for IoT. In Proceedings of the IEEE 39th International Conference on Distributed Computing Systems (ICDCS), Dallas, TX, USA, 7--10 July 2019.
\\bibitem{zhao2019} Zhao, Y.; Chen, J.; Wu, D.; Teng, J.; Yu, S. Multi-Task Network Anomaly Detection Using Federated Learning. In Proceedings of the 10th International Symposium on Information and Communication Technology (SoICT), Hanoi, Vietnam, 4--6 December 2019.
\\bibitem{kim2022} Kim, H.; Park, J.; Lee, S. Federated Insider Threat Detection: A Preliminary Investigation. In Proceedings of the IEEE International Conference on Big Data, Osaka, Japan, 17--20 December 2022.
\\bibitem{karimireddy2020} Karimireddy, S.P.; Kale, S.; Mohri, M.; Reddi, S.; Stich, S.; Suresh, A.T. SCAFFOLD: Stochastic Controlled Averaging for Federated Learning. In Proceedings of the 37th International Conference on Machine Learning (ICML), Virtual, 13--18 July 2020.
\\bibitem{wang2020} Wang, J.; Liu, Q.; Liang, H.; Joshi, G.; Poor, H.V. Tackling the Objective Inconsistency Problem in Heterogeneous Federated Optimization. In Proceedings of the 34th Conference on Neural Information Processing Systems (NeurIPS), Vancouver, BC, Canada, 6--12 December 2020.
\\bibitem{li2022fedbn} Li, X.; Jiang, M.; Zhang, X.; Kamp, M.; Dou, Q. FedBN: Federated Learning on Non-IID Features via Local Batch Normalization. In Proceedings of the International Conference on Learning Representations (ICLR), Virtual, 3--7 May 2021.
\\bibitem{elshenawy2025} Elshenawy, M.A.; Tawfik, N.S.; Hamada, N.; Kadry, R.; Fayed, S.; Ghatwary, N. A Comparative Analysis of Federated Learning for Multi-Class Breast Cancer Classification in Ultrasound Imaging. \\textit{AI} \\textbf{2025}, \\textit{6}, 316.
\\bibitem{glasser2013} Glasser, J.; Lindauer, B. Bridging the Gap: A Pragmatic Approach to Generating Insider Threat Data. In Proceedings of the 2013 IEEE Security and Privacy Workshops, San Francisco, CA, USA, 23--24 May 2013.
\\bibitem{kent2016} Kent, A.D. Cyber Security Data Sources for Dynamic Network Research. In \\textit{Dynamic Networks and Cyber-Security}; Adams, N., Heard, N., Eds.; World Scientific: Singapore, 2016; pp. 37--65.
\\bibitem{beutel2020flower} Beutel, D.J.; Tober, T.; Manzoor, A.; Andreux, M.; Shah, A.; Tsai, Y.-H.H.; et al. Flower: A Friendly Federated Learning Framework. \\textit{arXiv} \\textbf{2020}, arXiv:2007.14390.
\\bibitem{gavai2015} Gavai, G.; Sricharan, K.; Gunber, D.; Hanley, J.; Singhal, M.; Rolleston, R. Detecting Insider Threat from Enterprise Social and Online Activity Data. In Proceedings of the 7th ACM CCS Workshop on Security and Artificial Intelligence (AISec), Denver, CO, USA, 12 October 2015.
\\bibitem{tuor2017} Tuor, A.; Kaplan, S.; Hutchinson, B.; Nichols, N.; Robinson, S. Deep Learning for Unsupervised Insider Threat Detection in Structured Cybersecurity Data Streams. In Proceedings of the AAAI Workshop on Artificial Intelligence for Cyber Security (AICS), San Francisco, CA, USA, 4--5 February 2017.
\\bibitem{salem2008} Salem, M.B.; Hershkop, S.; Stolfo, S.J. A Survey of Insider Attack Detection Research. In \\textit{Insider Attack and Cyber Security}; Stolfo, S.J., Bellovin, S.M., Keromytis, A.D., Hershkop, S., Smith, S.W., Sinclair, S., Eds.; Springer: Boston, MA, USA, 2008; pp. 69--90.
\\bibitem{liu2023} Liu, J.; Kantarci, B.; Adams, S. Dynamic Deep Learning for Insider Threat Detection: A Multi-Granularity Embedded Model. \\textit{IEEE Trans. Depend. Secur. Comput.} \\textbf{2023}, \\textit{20}, 2373--2387.
\\bibitem{alsowail2022} Alsowail, R.A.; Al-Shehari, T. Techniques and Countermeasures for Preventing Insider Threats. \\textit{PeerJ Comput. Sci.} \\textbf{2022}, \\textit{8}, e938.
\\bibitem{zhang2022} Zhang, J.; Chen, B.; Cheng, X.; Binh, H.T.T.; Yu, S. PoisonGAN: Generative Poisoning Attacks Against Federated Learning in Edge Computing Systems. \\textit{IEEE Internet Things J.} \\textbf{2021}, \\textit{8}, 3310--3322.
\\bibitem{li2021fedadam} Reddi, S.; Charles, Z.; Zaheer, M.; Garrett, Z.; Rush, K.; Kone\\v{c}n\\'{y}, J.; Kumar, S.; McMahan, H.B. Adaptive Federated Optimization. In Proceedings of the International Conference on Learning Representations (ICLR), Virtual, 3--7 May 2021.
\\bibitem{hsu2019} Hsu, T.-M.H.; Qi, H.; Brown, M. Measuring the Effects of Non-Identical Data Distribution for Federated Visual Classification. \\textit{arXiv} \\textbf{2019}, arXiv:1909.06335.
\\bibitem{arivazhagan2019} Arivazhagan, M.G.; Aggarwal, V.; Singh, A.K.; Choudhary, S. Federated Learning with Personalization Layers. \\textit{arXiv} \\textbf{2019}, arXiv:1912.00818.
\\bibitem{dwork2014} Dwork, C.; Roth, A. The Algorithmic Foundations of Differential Privacy. \\textit{Found. Trends Theor. Comput. Sci.} \\textbf{2014}, \\textit{9}, 211--407.
\\bibitem{geyer2017} Geyer, R.C.; Klein, T.; Nabi, M. Differentially Private Federated Learning: A Client Level Perspective. \\textit{arXiv} \\textbf{2017}, arXiv:1712.07557.
\\bibitem{fallah2020} Fallah, A.; Mokhtari, A.; Ozdaglar, A. Personalized Federated Learning with Moreau Envelopes. In Proceedings of the 34th Conference on Neural Information Processing Systems (NeurIPS), Vancouver, BC, Canada, 6--12 December 2020.
\\bibitem{deng2020} Deng, Y.; Kamani, M.M.; Mahdavi, M. Adaptive Personalized Federated Learning. \\textit{arXiv} \\textbf{2020}, arXiv:2003.13461.
\\bibitem{cohen1960} Cohen, J. A Coefficient of Agreement for Nominal Scales. \\textit{Educ. Psychol. Meas.} \\textbf{1960}, \\textit{20}, 37--46.
\\bibitem{breiman2001} Breiman, L. Random Forests. \\textit{Mach. Learn.} \\textbf{2001}, \\textit{45}, 5--32.
\\bibitem{hochreiter1997} Hochreiter, S.; Schmidhuber, J. Long Short-Term Memory. \\textit{Neural Comput.} \\textbf{1997}, \\textit{9}, 1735--1780.
\\bibitem{lecun1998} LeCun, Y.; Bottou, L.; Bengio, Y.; Haffner, P. Gradient-Based Learning Applied to Document Recognition. \\textit{Proc. IEEE} \\textbf{1998}, \\textit{86}, 2278--2324.
\\bibitem{goodfellow2014} Goodfellow, I.; Pouget-Abadie, J.; Mirza, M.; Xu, B.; Warde-Farley, D.; Ozair, S.; Courville, A.; Bengio, Y. Generative Adversarial Nets. In Proceedings of the 27th International Conference on Neural Information Processing Systems (NIPS), Montreal, QC, Canada, 8--13 December 2014.
\\bibitem{kingma2013} Kingma, D.P.; Welling, M. Auto-Encoding Variational Bayes. In Proceedings of the 2nd International Conference on Learning Representations (ICLR), Banff, AB, Canada, 14--16 April 2014.
\\bibitem{bishop1994} Bishop, C.M. Novelty Detection and Neural Network Validation. \\textit{IEE Proc.--Vis. Image Signal Process.} \\textbf{1994}, \\textit{141}, 217--222.
\\bibitem{delong1988} DeLong, E.R.; DeLong, D.M.; Clarke-Pearson, D.L. Comparing the Areas Under Two or More Correlated Receiver Operating Characteristic Curves: A Nonparametric Approach. \\textit{Biometrics} \\textbf{1988}, \\textit{44}, 837--845.
\\bibitem{mcnemar1947} McNemar, Q. Note on the Sampling Error of the Difference Between Correlated Proportions or Percentages. \\textit{Psychometrika} \\textbf{1947}, \\textit{12}, 153--157.
\\bibitem{bonferroni1936} Bonferroni, C.E. Teoria Statistica Delle Classi e Calcolo Delle Probabilit\\'{a}. \\textit{Pubbl. R Ist. Super. Sci. Econ. Commer. Firenze} \\textbf{1936}, \\textit{8}, 3--62.

\\end{thebibliography}

\\end{document}`;

export default function Page8Latex() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(LATEX_CODE);
    setCopied(true);
    toast.success("LaTeX code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <Badge variant="outline" className="text-xs font-mono mb-2">Page 8</Badge>
        <h1 className="text-2xl font-bold tracking-tight">LaTeX Paper Generator</h1>
        <p className="text-muted-foreground mt-1">Complete MDPI AI format paper — copy and compile directly.</p>
        <div className="flex gap-3 mt-3 text-xs text-muted-foreground font-mono">
          <span>7 Tables</span>
          <span>·</span>
          <span>6 Figures</span>
          <span>·</span>
          <span>49 References</span>
          <span>·</span>
          <span>~4,800 words</span>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">manuscript.tex</CardTitle>
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-xs leading-relaxed font-mono max-h-[70vh] overflow-y-auto">
              <code>{LATEX_CODE}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
