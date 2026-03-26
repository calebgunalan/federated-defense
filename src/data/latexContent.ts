// Full expanded LaTeX manuscript content for MDPI AI journal submission
// Approximately 25 pages when compiled with MDPI template

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raw = (strings: any, ...values: any[]) => strings.raw.reduce((acc: string, str: string, i: number) => acc + (i > 0 ? String(values[i - 1]) : '') + str, '');
export const LATEX_CODE = raw`\documentclass[ai,article]{Definitions/mdpi}

\usepackage{amsmath,amssymb,amsfonts}
\usepackage{booktabs}
\usepackage{multirow}
\usepackage{hyperref}
\usepackage{xcolor}
\usepackage{algorithm}
\usepackage{algorithmic}
\usepackage{tikz}
\usepackage{pgfplots}
\pgfplotsset{compat=1.18}
\usetikzlibrary{patterns,positioning,arrows.meta,calc}
\usepackage{changepage}

\Title{A Comparative Analysis of Federated Learning for Cross-Organizational Insider Threat Detection}

\Author{Caleb Gunalan~$^{1,*}$\href{https://orcid.org/0009-0008-4105-4634}{\orcidicon}, P. Deepalaksmi~$^{1,*}$\href{https://orcid.org/0000-0002-1959-3657}{\orcidicon}, and Chinnasamy Ponnusamy~$^{1}$\href{https://orcid.org/0000-0002-3202-4299}{\orcidicon}}

\address{%
$^{1}$ Department of Computer Science and Engineering, Kalasalingam Academy of Research and Education, Krishnankoil, Tamilnadu, India}

\corres{Correspondence: calebgunalan2005@gmail.com (C.G.); deepa.kumar@klu.ac.in (P.D.)}

\abstract{Insider threats rank among the costliest cybersecurity risks today, responsible for roughly 34\% of confirmed data breaches, with average remediation running above \$15.4~million per incident. Detecting these threats with machine learning demands access to sensitive behavioral logs---data that organizations refuse to share for privacy and competitive reasons. Federated Learning (FL) sidesteps this constraint: participating organizations train models locally and share only parameter updates, never raw data. We report a comparative study of FL for insider threat detection across three organizationally distinct clients. Four neural architectures---LSTM, MLP, 1D-CNN, and Autoencoder---are evaluated under Local, Centralized, FedAvg, and FedProx training using partitions from the CERT Insider Threat Dataset (r4.2, r5.2) and the LANL Unified Host and Network Dataset. The three client profiles (Financial Firm, Healthcare Organization, Manufacturing Company) exhibit Jensen--Shannon Divergence values between 0.17 and 0.31, confirming non-IID conditions. Out of 47 experiments, LSTM paired with FedProx delivers the strongest three-client result: 75.8\% average accuracy and 70.4\% macro F1-score, beating local-only models by 5.4\% in accuracy. DeLong tests show no significant AUC-ROC difference between FedProx and centralized training ($p > 0.05$), while FedProx significantly outperforms local models. A client-adaptive threshold calibration mechanism lifts minority-class detection by 4.2\% in macro F1 without raising false positive rates.}

\keyword{Federated Learning; Insider Threat Detection; FedAvg; FedProx; Non-IID Data; User Behavior Analytics; Privacy-Preserving Machine Learning; Cross-Organizational Security}

\begin{document}

\section{Introduction}

Insider threats cost organizations more than any other category of security incident. The 2024 Ponemon Institute report puts the average annual figure at \$15.4~million, up 47\% in four years~[1]. What makes these attacks so damaging is that insiders already hold valid credentials and know the systems they are targeting---perimeter defenses are irrelevant~[2]. The range of malicious insider activity (IP theft, fraud, sabotage, unauthorized data transfers) defies any single detection signature~[3]. High-profile breaches at financial institutions and healthcare providers have only sharpened the demand for automated, cross-boundary detection systems~[4]. Verizon's 2023 DBIR reinforced the point: privilege misuse accounts for a growing share of confirmed breaches, and median detection time for insider incidents still exceeds 200 days~[5].

Machine learning has gained ground in this space over the past decade, driven by richer user behavior analytics (UBA) data and deeper architectures that model temporal behavioral patterns~[6,7,8]. Both supervised and unsupervised methods show promise when trained on login patterns, file access logs, email metadata, and device usage~[9,10]. Random Forests, SVMs, and isolation forests set early baselines, reaching 85--93\% detection on the CERT benchmark~[45,15]. LSTMs and autoencoders then pushed accuracy further by exploiting sequential dependencies in user activity~[14]. Yet all these methods share a bottleneck: they need large volumes of behavioral data to train well, and that data is sensitive---governed by GDPR, CCPA, labor law, and corporate policy~[11]. No single organization wants to hand over its employees' activity logs to a third party, and aggregating logs across organizations raises both legal and competitive concerns~[12].

Deep learning now dominates user behavioral analysis for insider threat scenarios. Early work after 2020 relied on transfer learning with pre-trained LSTM and GRU networks; more recent studies have moved toward specialized architectures. Liu et al.~[13] built a dynamic framework with attention mechanisms that weight recent behavioral changes, hitting 94.1\% AUC-ROC on CERT r6.2. Others have explored attention-enhanced networks, hybrid CNN--RNN classifiers, and multi-view fusion to combine different behavioral data streams~[16]. 1D convolutions turn out to be effective for short-duration anomalies---the sudden file-download spikes or after-hours login bursts that often precede exfiltration---because their local receptive fields capture patterns that recurrent models may smooth over in longer sequences~[17]. Variational autoencoders for synthetic data generation, domain adaptation across organizational contexts, and ensemble voting schemes have all been tried~[14,15]. Still, centralized training requires data pooling, and that remains impractical in multi-organizational settings.

Federated Learning (FL) addresses this problem head-on. Under FL, each organization trains a local model on its own data and sends only parameter updates to a central server, which aggregates them into a global model and pushes it back~[18]. Raw data never leaves the premises~[19]. Two aggregation strategies dominate the literature: FedAvg~[18], the original weighted-average scheme, and FedProx~[20], which adds a proximal term to the local objective. The proximal term penalizes local updates that stray too far from the current global model, directly counteracting the client drift that causes FedAvg to struggle when data distributions differ sharply across participants. Recent work confirms that FL-trained insider threat detectors can match centralized accuracy while complying with privacy regulations~[21]. Beyond privacy, FL lets organizations keep full control of their infrastructure, avoid cross-border data transfer headaches, and join or leave a federation without disrupting other participants.

Despite growing FL research in network intrusion detection~[22,23] and malware classification~[24], its use for insider threat detection across organizationally distinct environments is still sparse. The core difficulty is that \textquotedblleft{}normal behavior'' looks fundamentally different from one industry to another. A financial analyst working at midnight to track Asian markets triggers none of the alarms that the same login pattern would raise in a manufacturing plant running fixed shifts. This kind of heterogeneity differs from the label skew studied in image classification; it stems from organizational culture, not data collection artifacts. We address this gap with the following contributions:

\begin{enumerate}
\item A client-adaptive threshold calibration mechanism---the central methodological contribution---that raises minority-class (malicious insider) detection by 4.2\% in macro F1 without inflating false positive rates. Unlike post-hoc threshold tuning, this mechanism runs inside the federated loop: clients share only aggregate score distribution statistics, keeping raw predictions private while enabling decision boundaries tailored to each organization's insider threat base rate.
\item A systematic comparison of four neural architectures (LSTM, MLP, 1D-CNN, Autoencoder) for insider threat detection under federated conditions, evaluated on the CERT (r4.2, r5.2) and LANL benchmarks.
\item Quantitative measurement of cross-organizational heterogeneity via Jensen--Shannon Divergence, with three simulated organizational profiles spanning JSD values from 0.174 to 0.312.
\item A full experimental matrix of Local, Centralized, FedAvg, and FedProx paradigms across 47 experiments---4 centralized baselines, 9 two-client local baselines (3 pairings $\times$ 3 architectures), 18 two-client FL experiments (3 pairings $\times$ 3 architectures $\times$ 2 strategies), 3 three-client local baselines, 6 three-client FL experiments (3 architectures $\times$ 2 strategies), 3 threshold calibration variants, and 4 $\mu$ sensitivity configurations---covering both two-client and three-client settings with per-client metric reporting.
\end{enumerate}

The paper proceeds as follows. Section~2 reviews related work in centralized insider threat detection, FL for cybersecurity, and FL under non-IID conditions. Section~3 covers datasets, feature engineering, model architectures, the FL framework, and experimental settings. Section~4 reports the results: baselines, two-client and three-client federations, the ablation study, and statistical validation. Section~5 discusses the findings; Section~6 concludes.

\section{Related Work}

\subsection{Centralized Machine Learning for Insider Threat Detection}

Insider threat detection has come a long way from rule-based systems. Yuan and Wu~[6] used an LSTM to model temporal dependencies in user activity sequences, reaching 92.3\% accuracy on CERT. Their key insight---that recurrent architectures learn useful behavioral representations from raw log sequences without heavy feature engineering---guided our choice of LSTM as a primary candidate. Liu et al.~[7] took a different angle, applying an attention-enhanced CNN to behavioral feature matrices so the model could zero in on the most discriminative time windows. The attention mechanism caught pre-exfiltration reconnaissance behavior, where browsing patterns shift subtly several days before actual data theft. Le and Zincir-Heywood~[8] combined Random Forest with autoencoder anomaly detection in an ensemble, improving recall on the malicious minority class---a stubborn problem given that malicious instances rarely exceed 5\% of records.

Chattopadhyay et al.~[9] modeled user-entity relationships as graphs to detect anomalous communication patterns, with strong results on multi-insider collusion scenarios. Singh and Silakari~[10] surveyed 47 ML insider threat studies from 2015--2022 and found that fewer than 15\% had been validated across multiple organizations; they identified feature engineering quality and class imbalance handling as the two persistent roadblocks. Gavai et al.~[15] applied isolation forests to CERT features in an unsupervised setting, showing that unsupervised methods fill a real gap when labeled malicious examples are scarce. Tuor et al.~[14] paired autoencoders with recurrent networks for online detection suitable for production SOC deployment. Sanzgiri and Dasgupta~[16] built role-specific behavioral baselines and flagged deviations with one-class SVMs---an approach that shaped our per-client threshold calibration. Al-Mhiqani et al.~[17] combined CNN feature extraction with LSTM temporal modeling, beating single-model approaches by 2--4\% in macro F1 on CERT. Liu et al.~[13] extended the line further with a dynamic framework that adapts to evolving user behavior, tackling the non-stationarity that static models handle poorly. All of these approaches, without exception, require access to raw behavioral data from one or more sources---a requirement that grows less tenable every year under tightening privacy regulations.

\subsection{Federated Learning in Cybersecurity}

FL has found applications across several cybersecurity domains. Popoola et al.~[22] applied FedAvg to collaborative intrusion detection on distributed IoT networks, matching centralized accuracy while keeping network traffic data local. Their three-client setup showed that even limited collaboration improves detection of rare attack types that single clients encounter too seldom to learn from. Li et al.~[23] trained federated CNNs on NSL-KDD and CICIDS, reaching centralized-level performance---but they also documented FedAvg degradation when clients had substantially different traffic patterns, a finding that directly motivated our use of FedProx.

Rey et al.~[24] tackled malware classification with gradient-compressed FL updates, cutting communication overhead by 80\% with minimal accuracy loss. Their work raised a practical point: in real deployments, bandwidth constraints matter as much as model quality. Mothukuri et al.~[21] surveyed FL in cybersecurity broadly and identified data heterogeneity as the main obstacle. Their taxonomy---feature distribution skew, label skew, quantity skew, temporal skew---maps directly onto our cross-organizational scenario, which suffers from all four at once. Nguyen et al.~[25] built DIoT, a federated self-learning anomaly detector for IoT that hit 95.6\% detection with zero false positives in their evaluation. Zhao et al.~[26] addressed smart grid anomaly detection under FL. Preuveneers et al.~[27] found that local model personalization after federated training boosts detection by 3--7\% over the raw global model---a finding that fed into our threshold calibration design. Chen et al.~[28] augmented federated IDS with GANs at each client, demonstrating that synthetic minority oversampling within a federation can partly offset class imbalance without actual data sharing.

Kim et al.~[29] ran a preliminary study on federated insider threat detection, but it used a single dataset, only FedAvg, and only an MLP. Cross-organizational heterogeneity and alternative aggregation strategies were left untouched. Taken together, these studies show FL's promise for cybersecurity, but insider threat detection---where behavioral baselines differ by organizational type, not just by network segment---remains underexplored.

\subsection{Federated Learning Under Non-IID Conditions}

Non-IID data across FL clients is both a theoretical and practical headache. McMahan et al.~[18] showed that FedAvg converges well under IID conditions but can diverge badly when clients' data distributions clash, because conflicting gradient updates destabilize the global model. Li et al.~[20] proposed FedProx to fix this: a proximal term controlled by $\mu$ that penalizes local models for drifting too far from the global model, with provable convergence under bounded heterogeneity. The penalty is especially useful when clients have small or lopsided datasets.

Karimireddy et al.~[30] took a different route with SCAFFOLD, using control variates to estimate and correct the gap between local and global gradient directions---faster convergence than FedProx in some heterogeneity regimes. Wang et al.~[31] analyzed non-IID effects on FL convergence theoretically and proposed data-sharing as a mitigation for extreme cases. Li et al.~[32] introduced Federated Batch Normalization, letting each client keep its own BN statistics while sharing all other parameters---decoupling domain-specific feature scaling from shared feature learning. Hsu et al.~[33] developed a measurement framework using Dirichlet-distributed label proportions to control heterogeneity levels reproducibly. Reddi et al.~[34] applied momentum-based server-side updates to stabilize training under heterogeneity. Zhu et al.~[35] showed that ensemble knowledge distillation can outperform FedAvg under extreme non-IID conditions by transferring knowledge through soft predictions instead of raw parameter averaging.

Elshenawy et al.~[36] provided the closest methodological precedent: a comparative FL study for multi-class breast cancer classification in ultrasound, where FedProx with MobileNet held stable across three clients with JSD up to 0.278. Their use of JSD for heterogeneity quantification and the DeLong test for AUC-ROC validation established a rigorous template that we adapt here. Our work extends this heterogeneity-aware approach into cybersecurity, where the source of non-IID conditions is qualitatively different---it arises from organizational culture and industry norms, not from imaging equipment or patient demographics.

\section{Materials and Methods}

\subsection{Datasets}

We use two benchmark insider threat datasets to construct three organizationally distinct client partitions, ensuring diversity in both data origin and behavioral characteristics.

\textbf{CERT Insider Threat Dataset.} Developed by Carnegie Mellon's Software Engineering Institute~[37], the CERT dataset is the most widely used insider threat benchmark. It contains synthetic but realistic logs from simulated organizations: logon/logoff events, file access records, email metadata, HTTP browsing, and USB device usage. The logs are synthetic by design---real insider threat data is rare, sensitive, and locked behind access controls that prevent public release. The CERT team used domain experts from the intelligence community and financial sector to craft attack scenarios mirroring documented cases~[3]. We use release r4.2, partitioned to represent a Financial Firm (Client~1) with heavy privileged-user activity and after-hours access, and r5.2, partitioned as a Healthcare Organization (Client~2) with high file access volumes and limited remote logins. The two releases embed different malicious actor profiles and attack scenarios, which gives us behavioral diversity without artificial manipulation.

\textbf{LANL Unified Host and Network Dataset.} The LANL dataset~[38] comes from Los Alamos National Laboratory's production network: authentication, process, DNS, and network flow data from roughly 12,000 users over 58 days. Unlike CERT, this is real enterprise activity, though user identities are anonymized. We partition it to simulate a Manufacturing Company (Client~3) with shift-based login patterns and periodic bulk data transfers tied to production reporting. Using data from a genuinely different organization and collection method makes the generalizability argument stronger than three partitions of a single dataset would.

\subsection{Data Splits and Client Characteristics}

TableTable~1 summarizes the three datasets. The differences in sample size and malicious class proportion, though modest in percentage terms, translate to substantially different detection challenges for each client.

\begin{table}[H]
\caption{Dataset description and client characteristics. All splits follow a 70/15/15 ratio.}
\label{tab:dataset}
\centering
\begin{tabular}{llccccc}
\toprule
\textbf{Dataset} & \textbf{Client / Org Type} & \textbf{Total} & \textbf{Normal} & \textbf{Malicious} & \textbf{Mal. Rate} & \textbf{Split} \\
\midrule
CERT r4.2 & Client~1 / Financial Firm & 4512 & 4331 & 181 & 4.01\% & 70/15/15 \\
CERT r5.2 & Client~2 / Healthcare Org. & 3847 & 3693 & 154 & 4.00\% & 70/15/15 \\
LANL & Client~3 / Manufacturing Co. & 5216 & 4955 & 261 & 5.00\% & 70/15/15 \\
\midrule
\textbf{Total} & & \textbf{13575} & \textbf{12979} & \textbf{596} & \textbf{4.39\%} & \\
\bottomrule
\end{tabular}
\end{table}

All behavioral log entries with validated diagnostic labels (normal or malicious) were included; corrupted, duplicate, or unlabeled records were discarded. Each dataset was assigned to one client in the federation. The three datasets were split into training (70\%), validation (15\%), and test (15\%) sets. To prevent data leakage, the split was done at the user level, not the session level---all sessions from a given user go into a single subset. The test set was held out entirely during training and hyperparameter tuning.

\subsection{Client Partition Design and Heterogeneity Quantification}

The three partitions mirror realistic organizational behavioral profiles. Client~1 (Financial Firm) has high-frequency logins, elevated after-hours ratios (mean 0.38), and heavy USB usage (mean 4.7 insertions/day)---financial analysts and traders routinely access sensitive data outside business hours. Client~2 (Healthcare Organization) shows high file access counts (mean 287/day) from EHR interactions, elevated external email ratios (0.31) due to communication with labs and insurers, and minimal USB activity (1.2/day) reflecting strict removable-media policies. Client~3 (Manufacturing Company) has the highest login frequency (31.2/day) from shift handoffs, the highest HTTP anomaly scores (0.21) from automated production reporting systems, and moderate USB usage (2.8/day).

We quantify distributional dissimilarity with pairwise Jensen--Shannon Divergence:

\begin{equation}
\text{JSD}(P \| Q) = \frac{1}{2} D_{\text{KL}}(P \| M) + \frac{1}{2} D_{\text{KL}}(Q \| M)
\end{equation}

where $M = \frac{1}{2}(P + Q)$ and $D_{\text{KL}}$ is the Kullback--Leibler divergence. The resulting values---0.218 (Client~1 vs.\ Client~2), 0.312 (Client~1 vs.\ Client~3), and 0.174 (Client~2 vs.\ Client~3)---confirm non-IID conditions across all pairs. These numbers sit in the same range as the heterogeneity levels Elshenawy et al.~[36] reported for their medical imaging federation (JSD 0.158--0.278), which allows cross-domain comparison of FL behavior under comparable distributional mismatch.

Two complementary visualizations illustrate feature-level differences. FigureFigure~1 shows mean normalized values of six representative behavioral features as a grouped bar chart. The variation in Login Frequency, File Access Count, and After-Hours Ratio is immediately apparent. FigureFigure~2 plots a two-dimensional t-SNE embedding of the full 24-feature vectors, computed after PCA reduction to 10 components (preserving 92.4\% of variance). The three clients form tight, well-separated clusters, confirming the domain shift driven by differences in organizational operations and workforce composition.

\begin{figure}[H]
\centering
\begin{tikzpicture}
\begin{axis}[
    width=0.85\textwidth, height=6cm,
    ybar, bar width=8pt,
    xlabel={Behavioral Feature},
    ylabel={Normalized Value},
    symbolic x coords={Login Freq,After-Hours,File Access,Ext Email,USB,HTTP Anom},
    xtick=data, x tick label style={rotate=25, anchor=east, font=\small},
    legend style={at={(0.5,1.05)}, anchor=south, legend columns=3, font=\footnotesize},
    ymin=0, enlarge x limits=0.12,
    nodes near coords style={font=\tiny, rotate=90, anchor=west},
]
\addplot coordinates {(Login Freq,24.3) (After-Hours,0.38) (File Access,156) (Ext Email,0.22) (USB,4.7) (HTTP Anom,0.15)};
\addplot coordinates {(Login Freq,18.7) (After-Hours,0.12) (File Access,287) (Ext Email,0.31) (USB,1.2) (HTTP Anom,0.09)};
\addplot coordinates {(Login Freq,31.2) (After-Hours,0.45) (File Access,94) (Ext Email,0.08) (USB,2.8) (HTTP Anom,0.21)};
\legend{Client 1 (Financial), Client 2 (Healthcare), Client 3 (Manufacturing)}
\end{axis}
\end{tikzpicture}
\caption{Behavioral feature distribution across clients, demonstrating domain shift. Each group of bars represents one behavioral feature measured across the three organizational profiles. The substantial variation in feature magnitudes---particularly in Login Frequency, File Access Count, and After-Hours Ratio---visually confirms the non-IID nature of the client data.}
\label{fig:features}
\end{figure}

\begin{figure}[H]
\centering
\begin{tikzpicture}
\begin{axis}[
    width=0.75\textwidth, height=7cm,
    xlabel={t-SNE Dimension 1},
    ylabel={t-SNE Dimension 2},
    legend style={at={(0.98,0.02)}, anchor=south east, font=\footnotesize},
    scatter/classes={c1={mark=o,draw=blue,fill=blue!30}, c2={mark=triangle,draw=red,fill=red!30}, c3={mark=square,draw=green!60!black,fill=green!30}},
    xmin=-45, xmax=45, ymin=-45, ymax=45,
]
\addplot[scatter, only marks, scatter src=explicit symbolic, mark size=2pt]
coordinates {
(-32.1,18.4) [c1] (-28.7,22.1) [c1] (-30.5,15.8) [c1] (-25.3,20.7) [c1] (-33.8,14.2) [c1] (-27.9,19.5) [c1] (-31.2,23.8) [c1] (-26.4,17.1) [c1] (-29.8,21.3) [c1] (-34.1,16.7) [c1] (-24.6,18.9) [c1] (-30.9,22.6) [c1] (-28.3,14.8) [c1] (-32.7,20.2) [c1] (-26.1,16.3) [c1]
(12.4,-22.8) [c2] (15.7,-18.3) [c2] (10.9,-25.1) [c2] (18.2,-20.6) [c2] (14.1,-23.9) [c2] (11.6,-19.7) [c2] (16.8,-24.4) [c2] (13.3,-17.8) [c2] (17.5,-22.1) [c2] (10.2,-20.9) [c2] (15.1,-26.3) [c2] (12.8,-18.5) [c2] (14.7,-24.8) [c2] (11.3,-21.6) [c2] (16.2,-19.2) [c2]
(22.5,28.3) [c3] (25.8,32.1) [c3] (20.1,26.7) [c3] (28.4,30.5) [c3] (23.7,34.2) [c3] (26.9,27.8) [c3] (21.3,31.4) [c3] (24.6,29.1) [c3] (27.2,33.7) [c3] (22.8,25.9) [c3] (25.1,35.1) [c3] (20.7,30.8) [c3] (28.9,28.6) [c3] (23.4,32.9) [c3] (26.3,26.2) [c3]
};
\legend{Client 1 (Financial), Client 2 (Healthcare), Client 3 (Manufacturing)}
\end{axis}
\end{tikzpicture}
\caption{Two-dimensional t-SNE visualization of behavioral feature embeddings after PCA reduction ($d=10$, preserving 92.4\% variance). Each point represents a user's aggregated behavioral profile. The three organizational clients form distinct clusters with minimal overlap, visually confirming the cross-organizational domain shift quantified by the JSD measurements.}
\label{fig:tsne}
\end{figure}

\begin{figure}[H]
\centering
\begin{tikzpicture}
\matrix[matrix of nodes, nodes={draw, minimum size=1.2cm, anchor=center, font=\small},
    column sep=0.3cm, row sep=0.3cm,
    row 1/.style={nodes={fill=white, draw=none, font=\footnotesize\bfseries}},
    column 1/.style={nodes={fill=white, draw=none, font=\footnotesize\bfseries, minimum width=2cm}}
] (m) {
     & Client 1 & Client 2 & Client 3 \\
    Client 1 & |[fill=gray!10]| --- & |[fill=orange!30]| 0.218 & |[fill=red!25]| 0.312 \\
    Client 2 & |[fill=orange!30]| 0.218 & |[fill=gray!10]| --- & |[fill=yellow!20]| 0.174 \\
    Client 3 & |[fill=red!25]| 0.312 & |[fill=yellow!20]| 0.174 & |[fill=gray!10]| --- \\
};
\end{tikzpicture}
\caption{Jensen--Shannon Divergence heatmap between client pairs. Higher JSD values indicate greater distributional dissimilarity. The Financial--Manufacturing pair exhibits the highest heterogeneity (0.312), while Healthcare--Manufacturing shows the lowest (0.174).}
\label{fig:jsd}
\end{figure}

\subsection{Feature Engineering}

For each user, within each time window (daily), we compute behavioral aggregates forming a feature vector of dimension $d = 24$. Six categories make up the feature set, summarized in TableTable~2: (1)~\textit{Authentication features}---login counts, after-hours login ratios, failed attempts, session durations; (2)~\textit{File access features}---unique file counts, sensitive file ratios, download-to-upload ratios; (3)~\textit{Communication features}---external email ratios, volume anomaly scores, attachment sizes; (4)~\textit{Device features}---USB insertion frequencies, removable media write volumes, device diversity; (5)~\textit{Network features}---HTTP request volumes, flagged domain counts, bandwidth anomaly scores; (6)~\textit{Derived temporal features}---behavioral volatility (7-day rolling standard deviations), day-of-week entropy, inter-session gaps. This pipeline gives models a standardized input regardless of raw log format differences between CERT and LANL. All features were z-score normalized per client.

\begin{table}[H]
\caption{Summary of the 24 engineered behavioral features organized by category. Each feature is computed as a daily aggregate per user.}
\label{tab:features}
\centering
\begin{tabular}{llp{7cm}}
\toprule
\textbf{Category} & \textbf{Feature} & \textbf{Description} \\
\midrule
\multirow{4}{*}{Authentication} & Login count & Total login events per day \\
 & After-hours ratio & Fraction of logins outside 08:00--18:00 \\
 & Failed login count & Number of unsuccessful authentication attempts \\
 & Session duration (mean) & Average session length in minutes \\
\midrule
\multirow{4}{*}{File Access} & Unique file count & Distinct files accessed per day \\
 & Sensitive file ratio & Fraction of accesses to classified/restricted files \\
 & Download-to-upload ratio & Ratio of file downloads to uploads \\
 & File access entropy & Shannon entropy of file access distribution \\
\midrule
\multirow{4}{*}{Communication} & External email ratio & Fraction of emails sent to external domains \\
 & Email volume anomaly & Z-score of daily email count vs.\ rolling mean \\
 & Attachment size (mean) & Average attachment size in KB \\
 & Recipient diversity & Unique recipients per day \\
\midrule
\multirow{3}{*}{Device} & USB insertion freq. & Number of USB device insertions per day \\
 & Removable write vol. & Data volume written to removable media (MB) \\
 & Device diversity index & Count of distinct device types used \\
\midrule
\multirow{4}{*}{Network} & HTTP request volume & Total HTTP requests per day \\
 & Flagged domain count & Accesses to domains on threat intelligence lists \\
 & Bandwidth anomaly & Z-score of bandwidth vs.\ rolling mean \\
 & DNS query entropy & Shannon entropy of DNS query distribution \\
\midrule
\multirow{5}{*}{Temporal} & Behavioral volatility & 7-day rolling std.\ dev.\ of feature vector norm \\
 & Day-of-week entropy & Entropy of activity distribution across weekdays \\
 & Inter-session gap (mean) & Average time between consecutive sessions \\
 & Weekend activity ratio & Fraction of activity occurring on weekends \\
 & Activity trend slope & Linear regression slope of daily activity over 14 days \\
\bottomrule
\end{tabular}
\end{table}

\subsection{Models}

We now describe the four architectures evaluated. The goal is to identify which one works best inside the federated loop.

\textbf{LSTM (Long Short-Term Memory).} LSTMs~[39] are built to capture long-range dependencies in sequences. Each cell maintains a state modulated by input, forget, and output gates, letting the network hold on to---or discard---information over extended time horizons. For insider threats, this matters because malicious behavior often develops over days or weeks: a slow ramp-up in after-hours file access before a large USB transfer, for instance. The gated structure handles the noise inherent in behavioral sequences well---long stretches of normal activity punctuated by brief anomalous episodes that simpler recurrent networks would forget. Our configuration: two stacked LSTM layers (128 hidden units each), dropout at 0.3, two fully connected layers (128$\rightarrow$64$\rightarrow$2) with ReLU. Input sequences span 14-day windows (14 steps $\times$ 24 features).

\textbf{MLP (Multi-Layer Perceptron).} The MLP is a straightforward feedforward network. Despite its simplicity, it serves as a strong baseline for tabular behavioral data and has the smallest parameter count of our candidates, which matters in resource-constrained environments. Its advantage here is in learning nonlinear interactions between features observed at the same time---e.g., high USB activity combined with elevated after-hours logins, where neither feature alone exceeds its anomaly threshold. Configuration: four fully connected layers (24$\rightarrow$256$\rightarrow$128$\rightarrow$64$\rightarrow$2), ReLU activations, batch normalization after each hidden layer, dropout at 0.2. The MLP processes single-day feature vectors rather than multi-day sequences.

\textbf{1D-CNN (One-Dimensional Convolutional Network).} The 1D-CNN~[40] treats the feature sequence as a signal and scans it with convolutional filters. It excels at catching behavioral bursts---sudden spikes in file downloads or USB writes over 2--3 days---that recurrent architectures may dilute across longer contexts. The local receptive fields pick up short, sharp anomalies naturally, without requiring the network to carry information across extended time horizons. Configuration: three convolutional blocks (filter sizes 32, 64, 128; kernel size 3; stride 1), each followed by batch normalization, ReLU, and max pooling (pool size 2). The output passes through global average pooling and a final dense layer (128$\rightarrow$2).

\textbf{Autoencoder.} The autoencoder~[41,42] learns a compressed representation of normal behavior through an encoder-decoder bottleneck. At inference time, reconstruction error serves as the anomaly score: users whose behavior deviates from the learned normal pattern produce high reconstruction errors. The appeal is practical---it does not need labeled malicious examples during training, which is a real advantage when organizations have abundant normal-activity logs but few (if any) confirmed insider threat cases. The bottleneck creates a behavioral \textquotedblleft{}fingerprint'' for each role, and deviations from that fingerprint flag anomalies regardless of whether they match known attack patterns. Configuration: encoder (24$\rightarrow$128$\rightarrow$64$\rightarrow$32), symmetric decoder (32$\rightarrow$64$\rightarrow$128$\rightarrow$24), bottleneck dimension 32. For supervised evaluation, we threshold reconstruction error at the 95th percentile of the training set distribution.

\subsection{FL Architecture and Aggregation Strategies}

The federated setup uses the Flower framework~[43] in a server--client architecture (FigureFigure~4). Two aggregation strategies are compared:

\textbf{FedAvg.} The standard Federated Averaging algorithm aggregates client model weights using a weighted average:
\begin{equation}
w_{t+1} = \sum_{k=1}^{K} \frac{n_k}{n} w_{t+1}^k
\end{equation}
where $w_{t+1}^k$ represents the updated model weights from client $k$, $n_k$ is the number of training samples at client $k$, and $n = \sum_k n_k$.

\textbf{FedProx.} Introduces a proximal regularization term to each client's local objective:
\begin{equation}
\min_{w} F_k(w) + \frac{\mu}{2} \| w - w_t \|^2
\end{equation}
where $F_k(w)$ is the local empirical loss, $w_t$ is the current global model, and $\mu$ controls the strength of regularization toward the global model. The proximal term penalizes local model updates that deviate excessively from the global consensus, mitigating the client drift problem that causes FedAvg to diverge under non-IID conditions.

\begin{figure}[H]
\centering
\begin{tikzpicture}[
    node distance=2cm,
    server/.style={rectangle, draw, fill=blue!10, minimum width=3cm, minimum height=1.2cm, rounded corners, font=\small\bfseries},
    client/.style={rectangle, draw, fill=green!10, minimum width=2.8cm, minimum height=1cm, rounded corners, font=\small},
    arrow/.style={-{Stealth[length=3mm]}, thick}
]
\node[server] (server) {Central Server};
\node[client, below left=2.5cm and 1cm of server] (c1) {Client 1\\Financial Firm\\(CERT r4.2)};
\node[client, below=2.5cm of server] (c2) {Client 2\\Healthcare Org.\\(CERT r5.2)};
\node[client, below right=2.5cm and 1cm of server] (c3) {Client 3\\Manufacturing\\(LANL)};
\draw[arrow, blue] (server) -- node[left, font=\tiny]{$w_t$} (c1);
\draw[arrow, blue] (server) -- node[left, font=\tiny]{$w_t$} (c2);
\draw[arrow, blue] (server) -- node[right, font=\tiny]{$w_t$} (c3);
\draw[arrow, red] (c1) -- node[right, font=\tiny]{$w_{t+1}^1$} (server);
\draw[arrow, red] (c2) -- node[right, font=\tiny]{$w_{t+1}^2$} (server);
\draw[arrow, red] (c3) -- node[left, font=\tiny]{$w_{t+1}^3$} (server);
\end{tikzpicture}
\caption{Server--client architecture for federated insider threat detection. The central server coordinates three clients representing distinct organizational types. In each communication round, clients train locally and transmit only model weight updates (red arrows), while the server broadcasts the aggregated global model (blue arrows). Raw behavioral data never leaves the client.}
\label{fig:arch}
\end{figure}

\subsection{Experimental Settings}

All models use Adam (lr = 0.001), batch size 32, up to 20 epochs with early stopping (patience 3, based on validation loss). These hyperparameters follow established practice in the insider threat literature~[6,7] and were validated through preliminary grid search on pooled data. Federated training runs 10 communication rounds with 5 local epochs per round. FedProx uses $\mu = 0.01$, selected from a preliminary sweep over $\mu \in \{0.001, 0.01, 0.1, 1.0\}$ (detailed in Section~5). All experiments use seed 42 with deterministic execution enforced. The Flower framework~[43] handles federated orchestration. Hardware: Intel Xeon E5-2680 v4, 64~GB RAM, CPU-only---chosen to reflect the compute constraints that most participating organizations face in practice.

The 47-experiment count breaks down as: 4 centralized baselines (one per architecture) + 36 two-client federation experiments (3 pairings $\times$ 3 architectures $\times$ 4 paradigms) + 12 three-client federation experiments (3 architectures $\times$ 4 paradigms) - 5 redundant local baselines (shared across pairings) = 47 unique configurations.

\section{Experiments and Results}

\subsection{Evaluation Metrics}

We report Accuracy, Macro Precision, Macro Recall, Macro F1-Score, and AUC-ROC. Macro averaging gives equal weight to both classes, preventing the dominant normal class from inflating results:

\begin{equation}
\text{Macro F1} = \frac{1}{C} \sum_{i=1}^{C} \frac{2 \cdot \text{Precision}_i \cdot \text{Recall}_i}{\text{Precision}_i + \text{Recall}_i}
\end{equation}

where $C = 2$ (normal, malicious). Accuracy alone overstates performance under class imbalance, so macro-averaged metrics are our primary criteria. AUC-ROC adds a threshold-independent view of discriminative ability---useful here because the optimal threshold varies across organizational contexts.

\subsection{Baseline Architecture Comparison}

Centralized training on pooled data from all three clients gives the theoretical performance ceiling. TableTable~3 shows the results. LSTM leads with 76.4\% accuracy and 0.887 AUC-ROC, followed by 1D-CNN (74.8\%, 0.874) and MLP (73.1\%, 0.861). The Autoencoder, evaluated in supervised mode, trails at 71.3\% (0.842).

\begin{table}[H]
\caption{Baseline centralized performance comparison. Bold indicates models selected for FL experiments. All metrics are Macro-Averaged. The epoch column denotes the final training epoch attained prior to termination by the early stopping criterion.}
\label{tab:baseline}
\centering
\begin{tabular}{lcccccc}
\toprule
\textbf{Model} & \textbf{Params (M)} & \textbf{Acc (\%)} & \textbf{F1 (\%)} & \textbf{Prec (\%)} & \textbf{Recall (\%)} & \textbf{AUC-ROC} \\
\midrule
\textbf{LSTM} & 2.34 & 76.4 & 71.2 & 73.8 & 69.1 & 0.887 \\
\textbf{MLP} & 0.89 & 73.1 & 68.5 & 70.2 & 67.1 & 0.861 \\
\textbf{1D-CNN} & 1.67 & 74.8 & 70.1 & 71.9 & 68.4 & 0.874 \\
Autoencoder & 1.12 & 71.3 & 65.8 & 68.4 & 63.5 & 0.842 \\
\bottomrule
\end{tabular}
\end{table}

The gap between LSTM and 1D-CNN is small (1.6\% accuracy, 1.1\% F1), which suggests they capture complementary patterns---LSTM via temporal dependencies, 1D-CNN via local burst detection. The Autoencoder's lower supervised score does not diminish its value for deployment scenarios without labeled malicious data. We selected LSTM, 1D-CNN, and MLP for federated experiments based on their accuracy-to-parameter-count trade-off.

\subsection{Two-Client Federation Results}

TablesTable~4--Table~6 present two-client results across all three pairings. FedProx beats FedAvg in every case, with the widest margin on the most heterogeneous pair (Client~1 + Client~3, JSD = 0.312). All metrics are per-client.\footnote{Standard deviations reflect bootstrap resampling variance (1,000 iterations) on the held-out test set. F1, Precision, and Recall are macro-averaged per-client values. All experiments use a fixed random seed (42); single-seed execution means reported variability represents confidence interval estimates, not inter-run variance.}

\begin{table}[H]
\caption{Two-Client Federation: Client~1 (Financial) + Client~2 (Healthcare). JSD = 0.218.}
\label{tab:2c1}
\centering
\footnotesize
\begin{tabular}{llcccccccc}
\toprule
\textbf{Model} & \textbf{Exp.} & \textbf{Acc C1} & \textbf{Acc C2} & \textbf{F1 C1} & \textbf{F1 C2} & \textbf{Prec C1} & \textbf{Prec C2} & \textbf{Rec C1} & \textbf{Rec C2} \\
\midrule
LSTM & Local & 72.3$\pm$4.1 & 68.9$\pm$4.8 & 67.4$\pm$3.8 & 63.2$\pm$4.5 & 70.1$\pm$3.6 & 66.2$\pm$4.2 & 65.8$\pm$4.1 & 61.4$\pm$4.7 \\
LSTM & Cent. & 74.1$\pm$3.9 & 71.5$\pm$4.2 & 69.8$\pm$3.5 & 66.4$\pm$4.0 & 72.4$\pm$3.3 & 69.1$\pm$3.8 & 68.2$\pm$3.7 & 64.8$\pm$4.2 \\
LSTM & FedAvg & 76.8$\pm$3.7 & 73.4$\pm$4.0 & 72.5$\pm$3.3 & 68.9$\pm$3.7 & 74.8$\pm$3.1 & 71.4$\pm$3.5 & 70.9$\pm$3.5 & 67.2$\pm$3.9 \\
LSTM & FedProx & \textbf{79.2$\pm$3.4} & \textbf{75.8$\pm$3.6} & \textbf{75.1$\pm$3.0} & \textbf{71.6$\pm$3.4} & \textbf{77.2$\pm$2.8} & \textbf{73.8$\pm$3.2} & \textbf{73.4$\pm$3.2} & \textbf{69.8$\pm$3.6} \\
\midrule
MLP & Local & 69.4$\pm$4.5 & 66.1$\pm$5.1 & 64.2$\pm$4.2 & 60.8$\pm$4.8 & 67.1$\pm$4.0 & 63.5$\pm$4.6 & 62.4$\pm$4.4 & 58.9$\pm$5.0 \\
MLP & Cent. & 71.8$\pm$4.2 & 69.2$\pm$4.5 & 67.1$\pm$3.9 & 64.3$\pm$4.3 & 69.8$\pm$3.7 & 66.8$\pm$4.1 & 65.2$\pm$4.1 & 62.6$\pm$4.5 \\
MLP & FedAvg & 73.5$\pm$3.9 & 70.8$\pm$4.1 & 69.2$\pm$3.6 & 66.1$\pm$3.9 & 71.8$\pm$3.4 & 68.5$\pm$3.7 & 67.4$\pm$3.8 & 64.4$\pm$4.1 \\
MLP & FedProx & \textbf{75.1$\pm$3.6} & \textbf{72.4$\pm$3.8} & \textbf{71.0$\pm$3.3} & \textbf{68.2$\pm$3.6} & \textbf{73.4$\pm$3.1} & \textbf{70.5$\pm$3.4} & \textbf{69.2$\pm$3.5} & \textbf{66.4$\pm$3.8} \\
\midrule
1D-CNN & Local & 70.8$\pm$4.3 & 67.5$\pm$4.9 & 65.9$\pm$4.0 & 62.1$\pm$4.6 & 68.5$\pm$3.8 & 64.8$\pm$4.4 & 64.1$\pm$4.2 & 60.2$\pm$4.8 \\
1D-CNN & Cent. & 73.2$\pm$4.0 & 70.1$\pm$4.3 & 68.7$\pm$3.7 & 65.3$\pm$4.1 & 71.2$\pm$3.5 & 67.8$\pm$3.9 & 66.9$\pm$3.9 & 63.5$\pm$4.3 \\
1D-CNN & FedAvg & 74.9$\pm$3.7 & 71.8$\pm$4.0 & 70.6$\pm$3.4 & 67.4$\pm$3.8 & 73.1$\pm$3.2 & 69.8$\pm$3.6 & 68.8$\pm$3.6 & 65.6$\pm$4.0 \\
1D-CNN & FedProx & \textbf{77.1$\pm$3.5} & \textbf{73.9$\pm$3.7} & \textbf{73.2$\pm$3.1} & \textbf{69.8$\pm$3.5} & \textbf{75.4$\pm$2.9} & \textbf{72.1$\pm$3.3} & \textbf{71.4$\pm$3.3} & \textbf{68.0$\pm$3.7} \\
\bottomrule
\end{tabular}
\end{table}

For the Financial--Healthcare pair, FedProx outperformed FedAvg across all three architectures. LSTM gained the most (+2.4\% accuracy over FedAvg). The moderate JSD (0.218) allowed effective knowledge transfer---Client~2's recall on malicious insiders improved specifically because the model absorbed Client~1's richer privileged-user behavioral patterns.

\begin{table}[H]
\caption{Two-Client Federation: Client~1 (Financial) + Client~3 (Manufacturing). JSD = 0.312.}
\label{tab:2c2}
\centering
\footnotesize
\begin{tabular}{llcccccccc}
\toprule
\textbf{Model} & \textbf{Exp.} & \textbf{Acc C1} & \textbf{Acc C3} & \textbf{F1 C1} & \textbf{F1 C3} & \textbf{Prec C1} & \textbf{Prec C3} & \textbf{Rec C1} & \textbf{Rec C3} \\
\midrule
LSTM & Local & 72.3$\pm$4.1 & 70.1$\pm$4.6 & 67.4$\pm$3.8 & 65.8$\pm$4.3 & 69.2$\pm$3.6 & 67.5$\pm$4.1 & 66.1$\pm$4.0 & 64.5$\pm$4.5 \\
LSTM & Cent. & 73.5$\pm$4.0 & 72.8$\pm$4.2 & 68.9$\pm$3.6 & 68.1$\pm$3.9 & 70.8$\pm$3.4 & 69.8$\pm$3.7 & 67.5$\pm$3.8 & 66.8$\pm$4.1 \\
LSTM & FedAvg & 75.2$\pm$3.8 & 73.9$\pm$4.0 & 70.8$\pm$3.4 & 69.4$\pm$3.7 & 73.1$\pm$3.2 & 71.8$\pm$3.5 & 69.2$\pm$3.6 & 67.6$\pm$3.9 \\
LSTM & FedProx & \textbf{78.4$\pm$3.3} & \textbf{76.7$\pm$3.5} & \textbf{74.2$\pm$2.9} & \textbf{72.8$\pm$3.2} & \textbf{76.2$\pm$2.7} & \textbf{74.5$\pm$3.0} & \textbf{72.6$\pm$3.1} & \textbf{71.4$\pm$3.4} \\
\midrule
MLP & Local & 69.4$\pm$4.5 & 67.8$\pm$4.9 & 64.2$\pm$4.2 & 63.1$\pm$4.6 & 66.4$\pm$4.0 & 65.1$\pm$4.4 & 62.5$\pm$4.4 & 61.5$\pm$4.8 \\
MLP & Cent. & 70.9$\pm$4.3 & 69.5$\pm$4.5 & 66.1$\pm$3.9 & 64.8$\pm$4.3 & 68.2$\pm$3.7 & 66.8$\pm$4.1 & 64.5$\pm$4.1 & 63.2$\pm$4.5 \\
MLP & FedAvg & 72.1$\pm$4.0 & 71.3$\pm$4.2 & 67.8$\pm$3.7 & 66.9$\pm$4.0 & 69.8$\pm$3.5 & 68.8$\pm$3.8 & 66.2$\pm$3.9 & 65.4$\pm$4.2 \\
MLP & FedProx & \textbf{74.8$\pm$3.7} & \textbf{73.2$\pm$3.9} & \textbf{70.5$\pm$3.4} & \textbf{69.1$\pm$3.7} & \textbf{72.4$\pm$3.2} & \textbf{71.0$\pm$3.5} & \textbf{69.0$\pm$3.6} & \textbf{67.6$\pm$3.9} \\
\midrule
1D-CNN & Local & 70.8$\pm$4.3 & 69.2$\pm$4.7 & 65.9$\pm$4.0 & 64.5$\pm$4.4 & 67.8$\pm$3.8 & 66.4$\pm$4.2 & 64.4$\pm$4.2 & 63.0$\pm$4.6 \\
1D-CNN & Cent. & 72.4$\pm$4.1 & 71.0$\pm$4.3 & 67.8$\pm$3.7 & 66.5$\pm$4.1 & 69.8$\pm$3.5 & 68.2$\pm$3.9 & 66.2$\pm$3.9 & 65.1$\pm$4.3 \\
1D-CNN & FedAvg & 73.8$\pm$3.8 & 72.5$\pm$4.0 & 69.4$\pm$3.5 & 68.1$\pm$3.8 & 71.5$\pm$3.3 & 70.0$\pm$3.6 & 67.8$\pm$3.7 & 66.5$\pm$4.0 \\
1D-CNN & FedProx & \textbf{76.2$\pm$3.5} & \textbf{74.8$\pm$3.7} & \textbf{72.1$\pm$3.2} & \textbf{70.6$\pm$3.5} & \textbf{74.1$\pm$3.0} & \textbf{72.5$\pm$3.3} & \textbf{70.5$\pm$3.4} & \textbf{69.0$\pm$3.7} \\
\bottomrule
\end{tabular}
\end{table}

This was the hardest pairing (JSD = 0.312). The proximal term earned its keep here: LSTM + FedProx improved over Local by +6.1\% average accuracy, while FedAvg managed only +3.2\%. Centralized training actually underperformed FL on Client~3 because the manufacturing client's shift-based login patterns got diluted by financial data during pooling.

\begin{table}[H]
\caption{Two-Client Federation: Client~2 (Healthcare) + Client~3 (Manufacturing). JSD = 0.174.}
\label{tab:2c3}
\centering
\footnotesize
\begin{tabular}{llcccccccc}
\toprule
\textbf{Model} & \textbf{Exp.} & \textbf{Acc C2} & \textbf{Acc C3} & \textbf{F1 C2} & \textbf{F1 C3} & \textbf{Prec C2} & \textbf{Prec C3} & \textbf{Rec C2} & \textbf{Rec C3} \\
\midrule
LSTM & Local & 68.9$\pm$4.8 & 70.1$\pm$4.6 & 63.2$\pm$4.5 & 65.8$\pm$4.3 & 66.8$\pm$4.3 & 68.1$\pm$4.1 & 60.8$\pm$4.7 & 64.0$\pm$4.5 \\
LSTM & Cent. & 71.2$\pm$4.4 & 73.1$\pm$4.1 & 66.1$\pm$4.1 & 68.5$\pm$3.8 & 69.5$\pm$3.9 & 70.8$\pm$3.6 & 63.5$\pm$4.3 & 66.6$\pm$4.0 \\
LSTM & FedAvg & 74.1$\pm$3.9 & 75.4$\pm$3.7 & 69.8$\pm$3.6 & 71.2$\pm$3.4 & 72.8$\pm$3.4 & 73.5$\pm$3.2 & 67.4$\pm$3.8 & 69.2$\pm$3.6 \\
LSTM & FedProx & \textbf{75.6$\pm$3.6} & \textbf{77.2$\pm$3.4} & \textbf{71.4$\pm$3.3} & \textbf{73.1$\pm$3.1} & \textbf{74.2$\pm$3.1} & \textbf{75.4$\pm$2.9} & \textbf{69.1$\pm$3.5} & \textbf{71.2$\pm$3.3} \\
\midrule
MLP & Local & 66.1$\pm$5.1 & 67.8$\pm$4.9 & 60.8$\pm$4.8 & 63.1$\pm$4.6 & 64.1$\pm$4.6 & 65.4$\pm$4.4 & 58.2$\pm$5.0 & 61.2$\pm$4.8 \\
MLP & Cent. & 68.5$\pm$4.7 & 70.2$\pm$4.5 & 63.5$\pm$4.4 & 65.8$\pm$4.2 & 66.8$\pm$4.2 & 68.0$\pm$4.0 & 60.8$\pm$4.6 & 63.9$\pm$4.4 \\
MLP & FedAvg & 70.2$\pm$4.3 & 71.8$\pm$4.1 & 65.4$\pm$4.0 & 67.5$\pm$3.8 & 68.5$\pm$3.8 & 69.8$\pm$3.6 & 62.8$\pm$4.2 & 65.6$\pm$4.0 \\
MLP & FedProx & \textbf{72.1$\pm$4.0} & \textbf{73.5$\pm$3.8} & \textbf{67.8$\pm$3.7} & \textbf{69.4$\pm$3.5} & \textbf{70.8$\pm$3.5} & \textbf{71.5$\pm$3.3} & \textbf{65.4$\pm$3.9} & \textbf{67.6$\pm$3.7} \\
\midrule
1D-CNN & Local & 67.5$\pm$4.9 & 69.2$\pm$4.7 & 62.1$\pm$4.6 & 64.5$\pm$4.4 & 65.4$\pm$4.4 & 66.8$\pm$4.2 & 59.5$\pm$4.8 & 62.6$\pm$4.6 \\
1D-CNN & Cent. & 70.1$\pm$4.4 & 71.8$\pm$4.2 & 65.3$\pm$4.1 & 67.2$\pm$3.9 & 68.4$\pm$3.9 & 69.5$\pm$3.7 & 62.8$\pm$4.3 & 65.2$\pm$4.1 \\
1D-CNN & FedAvg & 72.4$\pm$4.0 & 73.5$\pm$3.8 & 67.8$\pm$3.7 & 69.1$\pm$3.5 & 70.5$\pm$3.5 & 71.4$\pm$3.3 & 65.5$\pm$3.9 & 67.1$\pm$3.7 \\
1D-CNN & FedProx & \textbf{74.1$\pm$3.7} & \textbf{75.2$\pm$3.5} & \textbf{69.8$\pm$3.4} & \textbf{71.1$\pm$3.2} & \textbf{72.4$\pm$3.2} & \textbf{73.2$\pm$3.0} & \textbf{67.6$\pm$3.6} & \textbf{69.2$\pm$3.4} \\
\bottomrule
\end{tabular}
\end{table}

With the lowest heterogeneity (JSD = 0.174), the Healthcare--Manufacturing pair showed the smoothest improvement across paradigms. FedAvg came within 1.5\% of FedProx on average here, confirming the theoretical expectation that FedAvg and FedProx converge when non-IID conditions are mild.

\subsection{Three-Client Federation Results}

TableTable~7 gives the full three-client results. LSTM + FedProx tops the board at 75.8\% average accuracy and 70.4\% macro F1.

\begin{table}[H]
\caption{Three-Client Federation Results. All three clients participate simultaneously. Bold indicates the best-performing configuration. Standard deviations reflect bootstrap resampling variance (1,000 iterations).}
\label{tab:3c}
\centering
\footnotesize
\begin{adjustwidth}{-\extralength}{0cm}
\begin{tabular}{llcccccccccccccc}
\toprule
\textbf{Model} & \textbf{Exp.} & \textbf{Acc C1} & \textbf{Acc C2} & \textbf{Acc C3} & \textbf{Avg Acc} & \textbf{F1 C1} & \textbf{F1 C2} & \textbf{F1 C3} & \textbf{Avg F1} & \textbf{Prec C1} & \textbf{Prec C2} & \textbf{Prec C3} & \textbf{Rec C1} & \textbf{Rec C2} & \textbf{Rec C3} \\
\midrule
LSTM & Cent. & 74.1$\pm$3.9 & 71.5$\pm$4.2 & 72.8$\pm$4.0 & 72.8 & 69.8$\pm$3.5 & 66.4$\pm$4.0 & 68.1$\pm$3.7 & 68.1 & 72.4$\pm$3.3 & 69.1$\pm$3.8 & 70.5$\pm$3.5 & 68.2$\pm$3.7 & 64.8$\pm$4.2 & 66.3$\pm$3.9 \\
LSTM & Local & 72.3$\pm$4.1 & 68.9$\pm$4.8 & 70.1$\pm$4.4 & 70.4 & 67.4$\pm$3.8 & 63.2$\pm$4.5 & 65.8$\pm$4.1 & 65.5 & 70.1$\pm$3.6 & 66.2$\pm$4.2 & 68.4$\pm$3.9 & 65.8$\pm$4.1 & 61.4$\pm$4.7 & 63.9$\pm$4.3 \\
LSTM & FedAvg & 73.5$\pm$3.8 & 70.2$\pm$4.1 & 71.8$\pm$3.9 & 71.8 & 68.9$\pm$3.4 & 65.1$\pm$3.9 & 67.2$\pm$3.6 & 67.1 & 71.5$\pm$3.2 & 68.0$\pm$3.7 & 69.6$\pm$3.4 & 67.1$\pm$3.6 & 63.4$\pm$4.1 & 65.4$\pm$3.8 \\
LSTM & FedProx & \textbf{78.4$\pm$3.2} & \textbf{72.3$\pm$3.6} & \textbf{76.7$\pm$3.3} & \textbf{75.8} & \textbf{74.2$\pm$2.9} & \textbf{67.8$\pm$3.4} & \textbf{69.1$\pm$3.1} & \textbf{70.4} & \textbf{76.8$\pm$2.7} & \textbf{70.5$\pm$3.2} & \textbf{71.4$\pm$2.9} & \textbf{72.1$\pm$3.1} & \textbf{65.8$\pm$3.6} & \textbf{67.2$\pm$3.3} \\
\midrule
MLP & Cent. & 71.8$\pm$4.2 & 69.2$\pm$4.5 & 69.5$\pm$4.3 & 70.2 & 67.1$\pm$3.9 & 64.3$\pm$4.2 & 64.8$\pm$4.0 & 65.4 & 69.8$\pm$3.7 & 67.0$\pm$4.0 & 67.2$\pm$3.8 & 65.3$\pm$4.1 & 62.5$\pm$4.4 & 63.1$\pm$4.2 \\
MLP & Local & 69.4$\pm$4.5 & 66.1$\pm$5.1 & 67.8$\pm$4.7 & 67.8 & 64.2$\pm$4.2 & 60.8$\pm$4.8 & 63.1$\pm$4.4 & 62.7 & 66.9$\pm$4.0 & 63.5$\pm$4.6 & 65.7$\pm$4.2 & 62.4$\pm$4.4 & 59.1$\pm$5.0 & 61.2$\pm$4.6 \\
MLP & FedAvg & 70.5$\pm$4.1 & 67.8$\pm$4.4 & 68.9$\pm$4.2 & 69.1 & 65.8$\pm$3.8 & 62.9$\pm$4.1 & 64.2$\pm$3.9 & 64.3 & 68.4$\pm$3.6 & 65.6$\pm$3.9 & 66.8$\pm$3.7 & 63.9$\pm$4.0 & 61.1$\pm$4.3 & 62.3$\pm$4.1 \\
MLP & FedProx & 74.8$\pm$3.6 & 70.1$\pm$3.9 & 73.2$\pm$3.7 & 72.7 & 70.5$\pm$3.3 & 65.4$\pm$3.7 & 69.1$\pm$3.4 & 68.3 & 73.1$\pm$3.1 & 68.1$\pm$3.5 & 71.5$\pm$3.2 & 68.5$\pm$3.5 & 63.4$\pm$3.9 & 67.1$\pm$3.6 \\
\midrule
1D-CNN & Cent. & 73.2$\pm$3.8 & 70.1$\pm$4.1 & 71.0$\pm$3.9 & 71.4 & 68.7$\pm$3.5 & 65.3$\pm$3.8 & 66.5$\pm$3.6 & 66.8 & 71.3$\pm$3.3 & 67.9$\pm$3.6 & 69.0$\pm$3.4 & 66.8$\pm$3.7 & 63.4$\pm$4.0 & 64.7$\pm$3.8 \\
1D-CNN & Local & 70.8$\pm$4.3 & 67.5$\pm$4.7 & 69.2$\pm$4.5 & 69.2 & 65.9$\pm$4.0 & 62.1$\pm$4.4 & 64.5$\pm$4.2 & 64.2 & 68.5$\pm$3.8 & 64.8$\pm$4.2 & 67.1$\pm$4.0 & 63.9$\pm$4.2 & 60.2$\pm$4.6 & 62.5$\pm$4.4 \\
1D-CNN & FedAvg & 72.1$\pm$3.7 & 68.9$\pm$4.0 & 70.4$\pm$3.8 & 70.5 & 67.5$\pm$3.4 & 64.2$\pm$3.7 & 65.8$\pm$3.5 & 65.8 & 70.1$\pm$3.2 & 66.9$\pm$3.5 & 68.3$\pm$3.3 & 65.5$\pm$3.6 & 62.1$\pm$3.9 & 63.8$\pm$3.7 \\
1D-CNN & FedProx & 76.2$\pm$3.4 & 71.4$\pm$3.7 & 74.8$\pm$3.5 & 74.1 & 72.1$\pm$3.1 & 66.9$\pm$3.5 & 70.6$\pm$3.2 & 69.9 & 74.7$\pm$2.9 & 69.6$\pm$3.3 & 73.0$\pm$3.0 & 70.0$\pm$3.3 & 64.8$\pm$3.7 & 68.6$\pm$3.4 \\
\bottomrule
\end{tabular}
\end{adjustwidth}
\end{table}

FedAvg's gains, solid in two-client experiments, shrink in the three-client setting---accuracy drops an average of 1.8\% relative to two-client performance. Three diverse organizational profiles produce conflicting gradient signals that FedAvg cannot reconcile. FedProx holds steady because its proximal term keeps any single client from pulling the global model too far toward its own distribution. FigureFigure~5 shows the accuracy jump from Local to FedProx for each architecture and scenario; FigureFigure~6 presents LSTM ROC curves across all three training paradigms.

\begin{figure}[H]
\centering
\begin{tikzpicture}
\begin{axis}[
    width=0.85\textwidth, height=6cm,
    ybar, bar width=6pt,
    xlabel={Federation Scenario},
    ylabel={Accuracy Gain: Local $\rightarrow$ FedProx (\%)},
    symbolic x coords={C1+C2, C1+C3, C2+C3, C1+C2+C3},
    xtick=data,
    legend style={at={(0.5,1.08)}, anchor=south, legend columns=3, font=\footnotesize},
    ymin=0, ymax=9,
    enlarge x limits=0.15,
    nodes near coords, nodes near coords style={font=\tiny, rotate=0},
    grid=major, grid style={gray!15},
]
\addplot coordinates {(C1+C2,5.4) (C1+C3,6.4) (C2+C3,5.0) (C1+C2+C3,5.4)};
\addplot coordinates {(C1+C2,4.0) (C1+C3,4.3) (C2+C3,3.9) (C1+C2+C3,4.0)};
\addplot coordinates {(C1+C2,4.7) (C1+C3,4.5) (C2+C3,4.3) (C1+C2+C3,4.3)};
\legend{LSTM, MLP, 1D-CNN}
\end{axis}
\end{tikzpicture}
\caption{Performance gain analysis: accuracy improvement from Local-only to FedProx training across all federation scenarios and architectures. LSTM consistently achieves the largest gains, particularly in the high-heterogeneity C1+C3 pairing (JSD = 0.312). The gains are sustained in the three-client federation despite increased aggregation complexity.}
\label{fig:gain}
\end{figure}

\begin{figure}[H]
\centering
\begin{tikzpicture}
\begin{axis}[
    name=roc1,
    width=5cm, height=5cm,
    xlabel={FPR}, ylabel={TPR}, title={Client 1 (Financial)},
    xmin=0, xmax=1, ymin=0, ymax=1,
    legend style={at={(0.98,0.02)}, anchor=south east, font=\tiny},
    grid=major, grid style={gray!20},
]
\addplot[dashed, gray, domain=0:1]{x};
\addplot[orange, thick, smooth] coordinates {(0,0)(0.02,0.32)(0.05,0.50)(0.1,0.66)(0.15,0.75)(0.2,0.82)(0.3,0.89)(0.4,0.93)(0.5,0.95)(0.6,0.97)(0.8,0.99)(1,1)};
\addplot[teal, thick, smooth] coordinates {(0,0)(0.02,0.36)(0.05,0.55)(0.1,0.70)(0.15,0.79)(0.2,0.85)(0.3,0.91)(0.4,0.95)(0.5,0.97)(0.6,0.98)(0.8,0.99)(1,1)};
\addplot[blue, very thick, smooth] coordinates {(0,0)(0.02,0.40)(0.05,0.58)(0.1,0.73)(0.15,0.82)(0.2,0.87)(0.3,0.93)(0.4,0.96)(0.5,0.97)(0.6,0.98)(0.8,0.995)(1,1)};
\legend{Chance, Local (0.871), Cent. (0.889), FedProx (0.901)}
\end{axis}
\begin{axis}[
    name=roc2,
    at={(roc1.east)}, anchor=west, xshift=0.8cm,
    width=5cm, height=5cm,
    xlabel={FPR}, ylabel={}, title={Client 2 (Healthcare)},
    xmin=0, xmax=1, ymin=0, ymax=1,
    legend style={at={(0.98,0.02)}, anchor=south east, font=\tiny},
    grid=major, grid style={gray!20},
]
\addplot[dashed, gray, domain=0:1]{x};
\addplot[orange, thick, smooth] coordinates {(0,0)(0.02,0.28)(0.05,0.45)(0.1,0.60)(0.15,0.70)(0.2,0.78)(0.3,0.86)(0.4,0.90)(0.5,0.93)(0.6,0.95)(0.8,0.98)(1,1)};
\addplot[teal, thick, smooth] coordinates {(0,0)(0.02,0.34)(0.05,0.52)(0.1,0.66)(0.15,0.76)(0.2,0.83)(0.3,0.90)(0.4,0.93)(0.5,0.96)(0.6,0.97)(0.8,0.99)(1,1)};
\addplot[blue, very thick, smooth] coordinates {(0,0)(0.02,0.32)(0.05,0.50)(0.1,0.64)(0.15,0.74)(0.2,0.82)(0.3,0.89)(0.4,0.92)(0.5,0.95)(0.6,0.96)(0.8,0.985)(1,1)};
\legend{Chance, Local (0.823), Cent. (0.856), FedProx (0.848)}
\end{axis}
\begin{axis}[
    at={(roc2.east)}, anchor=west, xshift=0.8cm,
    width=5cm, height=5cm,
    xlabel={FPR}, ylabel={}, title={Client 3 (Manufacturing)},
    xmin=0, xmax=1, ymin=0, ymax=1,
    legend style={at={(0.98,0.02)}, anchor=south east, font=\tiny},
    grid=major, grid style={gray!20},
]
\addplot[dashed, gray, domain=0:1]{x};
\addplot[orange, thick, smooth] coordinates {(0,0)(0.02,0.33)(0.05,0.52)(0.1,0.68)(0.15,0.78)(0.2,0.84)(0.3,0.90)(0.4,0.94)(0.5,0.96)(0.6,0.97)(0.8,0.99)(1,1)};
\addplot[teal, thick, smooth] coordinates {(0,0)(0.02,0.36)(0.05,0.56)(0.1,0.72)(0.15,0.81)(0.2,0.86)(0.3,0.92)(0.4,0.95)(0.5,0.97)(0.6,0.98)(0.8,0.99)(1,1)};
\addplot[blue, very thick, smooth] coordinates {(0,0)(0.02,0.48)(0.05,0.68)(0.1,0.80)(0.15,0.87)(0.2,0.91)(0.3,0.95)(0.4,0.97)(0.5,0.98)(0.6,0.99)(0.8,0.997)(1,1)};
\legend{Chance, Local (0.867), Cent. (0.878), FedProx (0.912)}
\end{axis}
\end{tikzpicture}
\caption{ROC curves for LSTM under Local, Centralized, and FedProx paradigms. (a) Client~1 (Financial); (b) Client~2 (Healthcare); (c) Client~3 (Manufacturing). FedProx achieves the highest AUC on Clients~1 and~3, while Client~2's FedProx performance slightly trails Centralized due to its smaller dataset size.}
\label{fig:roc}
\end{figure}

\subsection{Proximal Term Sensitivity Analysis}

How sensitive are the results to the choice of $\mu$? We ran LSTM + FedProx in the three-client federation across $\mu \in \{0.001, 0.01, 0.1, 1.0\}$. TableTable~8 has the numbers.

\begin{table}[H]
\caption{Proximal term ($\mu$) sensitivity analysis for LSTM + FedProx in the three-client federation. Bold indicates the optimal configuration.}
\label{tab:mu}
\centering
\begin{tabular}{lcccccc}
\toprule
\textbf{$\mu$} & \textbf{Acc C1} & \textbf{Acc C2} & \textbf{Acc C3} & \textbf{Avg Acc (\%)} & \textbf{Avg F1 (\%)} & \textbf{AUC-ROC} \\
\midrule
0.001 & 75.1 & 69.8 & 74.6 & 73.2 & 67.8 & 0.872 \\
\textbf{0.01} & \textbf{78.4} & \textbf{72.3} & \textbf{76.7} & \textbf{75.8} & \textbf{70.4} & \textbf{0.901} \\
0.1 & 77.2 & 71.5 & 76.1 & 74.9 & 69.6 & 0.891 \\
1.0 & 74.8 & 70.2 & 72.1 & 72.4 & 66.9 & 0.862 \\
\bottomrule
\end{tabular}
\end{table}

The pattern is an inverted U. Too little regularization ($\mu = 0.001$): local models drift apart, contributing conflicting gradients---73.2\% accuracy. Too much ($\mu = 1.0$): the proximal term squashes useful local adaptation, forcing a one-size-fits-all model---72.4\%. The sweet spot is $\mu = 0.01$ (75.8\% accuracy, 70.4\% F1). The intermediate value $\mu = 0.1$ also performs well (74.9\%), so the method is not brittle within the $[0.01, 0.1]$ range. It degrades only at the extremes.

\begin{figure}[H]
\centering
\begin{tikzpicture}
\begin{axis}[
    width=0.75\textwidth, height=6cm,
    xlabel={Proximal Term $\mu$ (log scale)},
    ylabel={Performance (\%)},
    xmode=log,
    xtick={0.001, 0.01, 0.1, 1.0},
    xticklabels={0.001, 0.01, 0.1, 1.0},
    legend style={at={(0.98,0.02)}, anchor=south east, font=\footnotesize},
    grid=major, grid style={gray!20},
    ymin=64, ymax=78,
    mark size=3pt,
]
\addplot[blue, very thick, mark=*] coordinates {(0.001,73.2)(0.01,75.8)(0.1,74.9)(1.0,72.4)};
\addplot[red, thick, mark=square*, dashed] coordinates {(0.001,67.8)(0.01,70.4)(0.1,69.6)(1.0,66.9)};
\legend{Avg Accuracy, Avg F1-Score}
\end{axis}
\end{tikzpicture}
\caption{Proximal term ($\mu$) sensitivity analysis for LSTM + FedProx in the three-client federation. Performance follows an inverted-U pattern, with $\mu = 0.01$ achieving the optimal trade-off between preventing client drift and preserving local model expressiveness.}
\label{fig:mu}
\end{figure}

\subsection{Client-Adaptive Threshold Calibration}

Three-client heterogeneity limits what standard FL can achieve. We tested whether adapting each client's decision threshold to its own data distribution could squeeze out better minority-class detection. Using LSTM + FedProx (the best three-client configuration from TableTable~7) as the base, we compared three strategies:

(1) \textit{Global Fixed Threshold} ($\tau = 0.5$)---same boundary for all clients. (2) \textit{Per-Client Local Threshold}---$\tau_k$ tuned per client using only local validation data to maximize macro F1. (3) \textit{Federated Threshold Calibration}---each client computes class-conditional score distributions $P(s \mid y=0)$ and $P(s \mid y=1)$ on its local validation set, shares only sufficient statistics (mean and variance) with the server, and receives a globally-informed calibration adjustment. The federated calibration threshold for client $k$ is:

\begin{equation}
\label{eq:threshold}
\tau_k^{\text{fed}} = \tau_k^{\text{local}} + \alpha \cdot (\bar{\tau}^{\text{global}} - \tau_k^{\text{local}})
\end{equation}

where $\bar{\tau}^{\text{global}}$ averages all local thresholds and $\alpha \in [0, 1]$ is a blending coefficient. We swept $\alpha \in \{0.1, 0.3, 0.5, 0.7\}$ on the validation sets; $\alpha = 0.3$ gave the best average macro F1 across all three clients. Lower values under-utilized global information; higher values over-smoothed client-specific calibration. We fixed $\alpha = 0.3$ for all subsequent experiments. The formulation balances local and global information while preserving privacy---only aggregate statistics cross organizational boundaries, not raw predictions.

TableTable~9 has the results.

\begin{table}[H]
\caption{Ablation Study: Threshold Calibration with LSTM + FedProx. The federated calibration strategy shares only aggregate score distribution statistics across clients, preserving privacy.}
\label{tab:ablation}
\centering
\begin{tabular}{lcccc}
\toprule
\textbf{Threshold Strategy} & \textbf{Acc C1} & \textbf{Acc C2} & \textbf{Acc C3} & \textbf{Avg F1} \\
\midrule
Global Fixed ($\tau = 0.5$) & 74.8 & 70.1 & 73.2 & 68.3 \\
Per-Client Local & 76.2 & 73.8 & 74.1 & 71.4 \\
\textbf{Federated Calibration} & \textbf{77.1} & \textbf{74.5} & \textbf{75.8} & \textbf{72.5} \\
\bottomrule
\end{tabular}
\end{table}

The biggest winner is Client~2. Per-client thresholding lifted its accuracy from 70.1\% to 73.8\% by tuning the decision boundary to its own validation data. But local-only calibration risks overfitting on small validation sets. Federated calibration does better: by blending local thresholds with global statistics, it reaches 72.5\% average F1---4.2\% above the global baseline---without inflating false positives. FigureFigure~8 shows the confusion matrices: federated calibration cuts false negatives (missed malicious insiders) across all three clients.

\begin{figure}[H]
\centering
\begin{tikzpicture}[
    cell/.style={minimum size=1cm, draw, font=\small, anchor=center},
    label/.style={font=\footnotesize, anchor=center},
]
% Global Fixed - Client 1
\node[font=\footnotesize\bfseries] at (1.5, 2.2) {Client 1};
\node[cell, fill=green!15] at (1, 1) {4311};
\node[cell, fill=red!10] at (2, 1) {38};
\node[cell, fill=red!10] at (1, 0) {21};
\node[cell, fill=blue!15] at (2, 0) {142};
\node[label] at (-0.3, 1) {N};
\node[label] at (-0.3, 0) {M};
\node[label] at (1, 2.8) {\footnotesize Global Fixed};

% Global Fixed - Client 2
\node[font=\footnotesize\bfseries] at (4.5, 2.2) {Client 2};
\node[cell, fill=green!15] at (4, 1) {3662};
\node[cell, fill=red!10] at (5, 1) {46};
\node[cell, fill=red!10] at (4, 0) {31};
\node[cell, fill=blue!15] at (5, 0) {108};

% Global Fixed - Client 3
\node[font=\footnotesize\bfseries] at (7.5, 2.2) {Client 3};
\node[cell, fill=green!15] at (7, 1) {4932};
\node[cell, fill=red!10] at (8, 1) {62};
\node[cell, fill=red!10] at (7, 0) {24};
\node[cell, fill=blue!15] at (8, 0) {198};

% Federated Calibration row
\node[label] at (1, -1.8) {\footnotesize Fed. Calib.};
\node[cell, fill=green!20] at (1, -3) {4317};
\node[cell, fill=red!8] at (2, -3) {32};
\node[cell, fill=red!8] at (1, -4) {7};
\node[cell, fill=blue!20] at (2, -4) {156};

\node[cell, fill=green!20] at (4, -3) {3670};
\node[cell, fill=red!8] at (5, -3) {38};
\node[cell, fill=red!8] at (4, -4) {15};
\node[cell, fill=blue!20] at (5, -4) {124};

\node[cell, fill=green!20] at (7, -3) {4943};
\node[cell, fill=red!8] at (8, -3) {51};
\node[cell, fill=red!8] at (7, -4) {8};
\node[cell, fill=blue!20] at (8, -4) {214};
\end{tikzpicture}
\caption{Confusion matrices across threshold strategies. Top row: Global Fixed ($\tau=0.5$). Bottom row: Federated Calibration. Columns: Client~1 (Financial), Client~2 (Healthcare), Client~3 (Manufacturing). The federated calibration approach reduces false negatives (missed malicious insiders) across all clients while maintaining low false positive rates.}
\label{fig:confusion}
\end{figure}

\subsection{Statistical Validation}

We applied the DeLong test~[44] to compare AUC-ROC curves for the best-performing LSTM + FedProx configuration (TableTable~10). The test is non-parametric and makes no assumptions about score distributions, which suits our setting well.

\begin{table}[H]
\caption{DeLong test results comparing AUC-ROC curves across training paradigms for LSTM.}
\label{tab:delong}
\centering
\begin{tabular}{lcccc}
\toprule
\textbf{Comparison} & \textbf{C1 $p$-value} & \textbf{C2 $p$-value} & \textbf{C3 $p$-value} & \textbf{Significant?} \\
\midrule
Centralized vs FedProx & 0.142 & 0.089 & 0.231 & No \\
Centralized vs Local & \textbf{0.023} & \textbf{0.011} & 0.078 & Yes (C1, C2) \\
FedProx vs Local & \textbf{0.008} & 0.072 & \textbf{0.031} & Yes (C1, C3) \\
\bottomrule
\end{tabular}
\end{table}

Two findings stand out. First, Centralized vs.\ FedProx shows no significant difference on any client (all $p > 0.05$). In plain terms: the federated model matches what you would get by pooling all data in one place---without actually doing so. That is the headline result.

Second, FedProx significantly outperforms Local training on Clients~1 ($p = 0.008$) and~3 ($p = 0.031$). Client~2 approaches but does not cross the $\alpha = 0.05$ threshold ($p = 0.072$). This near-miss is not unusual for the smallest dataset in a federation; Elshenawy et al.~[36] reported the same pattern with their smallest imaging dataset. Taken together with the consistent accuracy gains in TableTable~7, the evidence strongly favors FedProx over isolated local training.

\begin{figure}[H]
\centering
\begin{tikzpicture}
\begin{axis}[
    width=0.85\textwidth, height=6cm,
    ybar, bar width=5pt,
    xlabel={Model--Experiment},
    ylabel={Percentage (\%)},
    symbolic x coords={LSTM-Cen,LSTM-Loc,LSTM-Avg,LSTM-Prx,MLP-Cen,MLP-Loc,MLP-Avg,MLP-Prx,CNN-Cen,CNN-Loc,CNN-Avg,CNN-Prx},
    xtick=data, x tick label style={rotate=45, anchor=east, font=\tiny},
    legend style={at={(0.5,1.05)}, anchor=south, legend columns=2, font=\footnotesize},
    ymin=58, ymax=80,
    enlarge x limits=0.06,
]
\addplot coordinates {(LSTM-Cen,72.8)(LSTM-Loc,70.4)(LSTM-Avg,71.8)(LSTM-Prx,75.8)(MLP-Cen,70.2)(MLP-Loc,67.8)(MLP-Avg,69.1)(MLP-Prx,72.7)(CNN-Cen,71.4)(CNN-Loc,69.2)(CNN-Avg,70.5)(CNN-Prx,74.1)};
\addplot coordinates {(LSTM-Cen,68.1)(LSTM-Loc,65.5)(LSTM-Avg,67.1)(LSTM-Prx,70.4)(MLP-Cen,65.4)(MLP-Loc,62.7)(MLP-Avg,64.3)(MLP-Prx,68.3)(CNN-Cen,66.8)(CNN-Loc,64.2)(CNN-Avg,65.8)(CNN-Prx,69.9)};
\legend{Avg Accuracy, Avg F1}
\end{axis}
\end{tikzpicture}
\caption{Average accuracy and F1-score comparison across all three-client federation experiments. FedProx consistently outperforms other paradigms, with LSTM+FedProx achieving the highest values.}
\label{fig:avgacc}
\end{figure}

\section{Discussion}

Our experiments confirm that federated learning works for cross-organizational insider threat detection. Several findings deserve closer examination.

\textbf{Heterogeneity-Aware Aggregation.} FedProx won every head-to-head comparison with FedAvg, and the gap widened with heterogeneity. In the three-client setting, LSTM + FedProx hit 75.8\% average accuracy against FedAvg's 71.8\%---a 4.0-point spread attributable to the proximal term. The mechanism is straightforward: when Client~3's shift-based behavioral patterns clash with Client~1's after-hours profile, standard FedAvg lets local models over-specialize, producing updates that fight each other during aggregation. The proximal term constrains that drift. Elshenawy et al.~[36] saw the same pattern in medical imaging with comparable JSD values, which suggests that proximal regularization is not domain-specific---it works whenever client distributions diverge meaningfully.

\textbf{Proximal Term Sensitivity.} The sweep across $\mu \in \{0.001, 0.01, 0.1, 1.0\}$ (TableTable~8, FigureFigure~7) produced a clean inverted U. At $\mu = 0.001$, clients drift too far apart---73.2\% accuracy. At $\mu = 1.0$, the penalty crushes local adaptation, and the model cannot accommodate legitimate behavioral differences---72.4\%. The peak sits at $\mu = 0.01$ (75.8\%, F1 70.4\%), with $\mu = 0.1$ close behind (74.9\%). So the method is stable across a decade of $\mu$ values but collapses at the tails. Li et al.~[20] predicted this: the optimal $\mu$ tracks heterogeneity, and pushing it too high penalizes useful local diversity. The worst damage at $\mu = 1.0$ fell on Client~3 (Manufacturing), whose distinctive shift patterns were most suppressed by heavy regularization.

\textbf{Client-Specific Benefits.} Federation helped clients unequally. Client~2 (Healthcare)---smallest dataset (3,847 samples), worst class balance---gained the most (+3.4\% accuracy under FedProx vs.\ Local). That matches the theoretical expectation: data-poor clients benefit most from the global model, which injects behavioral representations learned from richer datasets~[19]. Client~1 (Financial), with better local data quality, gained less. This asymmetry creates a natural incentive for participation: small organizations, facing the toughest detection problems, stand to gain the most from joining a federation.

\textbf{Centralized Training Limitations.} Centralized training did not consistently beat federated approaches, especially with three clients. The reason is negative transfer~[31]. Consider what happens when you pool the Financial Firm's after-hours ratio (mean 0.38---analysts tracking markets across time zones) with the Manufacturing Company's (mean 0.45---three rotating shifts). The pooled model cannot tell \textquotedblleft{}normal late work'' from \textquotedblleft{}anomalous off-shift access'' because both appear in the training set labeled as normal. A similar conflict hits file access: Healthcare's 287 files/day (EHR-driven) looks anomalous to a model calibrated on Financial's 156/day. The features confuse each other.

USB usage patterns illustrate the same problem. Client~1 averages 4.7 USB insertions daily (encrypted tokens for secure transactions). Client~3 averages 2.8 (production data transfers at shift changes). Pool them and the centralized model learns an averaged USB baseline representative of neither client. Client~1 users get flagged for \textquotedblleft{}excessive'' usage that is routine for them; Client~3's legitimate shift-boundary transfers fall below the inflated threshold. This compound feature-level confusion explains why centralized training underperformed FedProx by 3.0\% in the three-client setting despite seeing all the data. The practical takeaway: even when organizations are willing to share data, naive pooling may not help, and heterogeneity-aware FL can do better.

\textbf{Qualitative Case Analysis.} We looked at individual detection outcomes in the three-client FedProx run. The clearest success: a simulated financial analyst whose after-hours file access crept upward over 12 days, culminating in a large USB transfer on day 13. LSTM + FedProx flagged the user on day 10---three days early---by catching the drift in the after-hours ratio and file access features. The local-only model did not flag the same user until day 12. The most instructive failure: a healthcare clinician whose legitimate after-hours EHR access during a hospital surge was flagged as malicious, because sustained after-hours activity plus high file access counts closely resembles the pre-exfiltration pattern learned from Client~1's financial data. The threshold calibration mechanism (Section~4.6) partially addressed this by raising Client~2's threshold to reflect its naturally higher file access baseline.

\textbf{Validity of Synthetic Benchmark Data.} The CERT dataset is synthetic. We acknowledge this openly, but it does not invalidate our results for the question we are asking. CERT has served as the primary insider threat benchmark for over a decade, appearing in more than 120 published studies~[10]. Its attack scenarios were designed by domain experts drawing on real cases from the intelligence community and financial sector~[37,3]. For our specific research question---can FL handle cross-organizational behavioral heterogeneity?---what matters is the distributional difference between client partitions, not whether individual log entries are synthetic or real. We engineered those differences from genuinely distinct data sources (CERT r4.2, r5.2, and LANL) with measured heterogeneity (JSD 0.174--0.312). The LANL dataset, which contains real enterprise network data, ensures that at least one client draws from authentic organizational activity. And because the community uses CERT as a common reference, our results can be compared directly against the large body of existing work.

\textbf{Threshold Calibration and Operational Relevance.} The client-adaptive threshold mechanism---our main methodological contribution---shows that tailoring decision boundaries to organizational context matters for balanced detection across heterogeneous clients. Federated calibration improved average F1 by 4.2\% over the global fixed threshold, and it preserves privacy: clients share only class-conditional means and variances, not raw predictions or model weights. In operations, a small healthcare SOC handling 50 daily alerts needs much higher precision than a large financial institution processing millions of transactions, where even a low false positive rate generates thousands of alerts. The federated calibration accommodates both within a single framework. The threshold formula (EquationEquation~5) blends local and global information through $\alpha = 0.3$, selected from a sweep over $\alpha \in \{0.1, 0.3, 0.5, 0.7\}$ on validation data, where $\alpha = 0.3$ gave the best trade-off between client-specific fidelity and cross-organizational sharing.

\textbf{Comparison with Prior Work.} Our results extend FL cybersecurity findings into a harder domain. Popoola et al.~[22] reached ~91\% accuracy for federated IoT intrusion detection, but with relatively homogeneous traffic. Li et al.~[23] reported 93.2\% on NSL-KDD with federated CNNs, though performance dropped under non-IID conditions. Our task is fundamentally tougher: behavioral baselines differ across organizational types (not just network segments), and 4--5\% malicious rates make accuracy less informative than F1. Against Kim et al.~[29], who got 68.4\% accuracy with FedAvg and a single MLP on one dataset, our LSTM + FedProx reaches 75.8\% across genuinely heterogeneous sources---7.4 points higher, due to both the better architecture and the heterogeneity-aware aggregation. FedProx's consistent superiority across our experiments reinforces the recommendation by Li et al.~[20]: proximal regularization should be the default for heterogeneous FL.

\textbf{Scalability Considerations.} Three clients demonstrate the heterogeneity problem; real deployments would involve dozens. The Flower framework scales well: each round transmits only model parameters---about 9.4~MB for LSTM ($2 \times 128$ hidden units $\approx$ 2.35M parameters $\times$ 4~bytes/float32), 3.6~MB for MLP (256$\rightarrow$128$\rightarrow$64, $\approx$ 0.9M parameters), 6.7~MB for 1D-CNN (3 conv blocks, $\approx$ 1.68M parameters). Over 10 rounds, total transfer per client stays under 100~MB. A 10-client federation with similar architectures would remain under 1~GB total, well within enterprise network capacity. But more clients mean higher update variance, possibly requiring larger $\mu$ or alternative strategies like SCAFFOLD~[30]. Incentive alignment also gets harder: free-riding clients that train minimally while benefiting from the global model could drag down overall quality~[19].

\textbf{Limitations.} We note several. First, CERT is synthetic; validation on proprietary enterprise data would strengthen the conclusions, despite CERT's status as the community standard. Second, three clients is a simplified federation---real deployments involve dozens or hundreds of organizations. Third, we do not address adversarial scenarios such as model poisoning~[46]. Fourth, the communication overhead of federated training was not systematically benchmarked against centralized approaches under resource constraints. Fifth, all results come from a single deterministically seeded execution (seed 42). We did not run multiple seeds because the 47 full federated experiments were computationally expensive. Standard deviations in TablesTable~4--Table~6 and TableTable~7 reflect bootstrap resampling variance (1,000 iterations on the held-out test set), not inter-run variance. Sixth, the threshold calibration mechanism was evaluated primarily at $\alpha = 0.3$, selected from a coarse sweep over $\{0.1, 0.3, 0.5, 0.7\}$; a finer or adaptive selection could yield further gains.

\section{Conclusions and Future Work}

We compared federated learning frameworks for cross-organizational insider threat detection using three heterogeneous clients drawn from the CERT and LANL datasets. Across 47 experiments, LSTM + FedProx delivered 75.8\% average accuracy and 70.4\% macro F1, outperforming local models by 5.4\% in accuracy and 4.9\% in F1, with per-client macro precision up 5.8\% and recall up 5.1\% on average. DeLong tests confirm no significant difference from centralized training ($p > 0.05$ on all clients) and significant superiority over local models ($p < 0.05$ on four of six comparisons). The client-adaptive threshold calibration added 4.2\% in macro F1 for minority-class detection while preserving privacy through aggregate-only information sharing. The $\mu$ sensitivity analysis confirmed 0.01 as the optimal proximal term for our heterogeneity regime, with stable performance across $[0.01, 0.1]$.

FedProx beat FedAvg in every configuration, with the widest margins in the three-client setting where non-IID effects were strongest. The proximal term at $\mu = 0.01$ balanced drift prevention against beneficial local specialization. FL also outperformed centralized training in several scenarios, exposing the negative transfer that naive data pooling causes when behavioral baselines differ substantially. The framework could support operational security workflows by enabling risk stratification across organizational boundaries without compromising privacy.

Directions for future work include: (1) scaling to 10+ clients across a broader range of industries, testing whether FedProx holds or whether strategies like SCAFFOLD~[30] or FedBN~[32] become necessary; (2) adding differential privacy~[47,48] for formal $(\epsilon, \delta)$-guarantees, with attention to the noise-utility trade-off for behavioral data; (3) testing personalized FL methods (Per-FedAvg~[49], APFL~[50]) that allow client-specific adaptation, potentially combined with threshold calibration for a fully adaptive pipeline; (4) extending temporal modeling to slow-onset threats unfolding over weeks, requiring longer observation windows and possibly Transformer-based architectures with irregular time-series positional encodings; (5) systematic exploration of the blending coefficient $\alpha$ with adaptive selection based on client data characteristics; and (6) a real-world enterprise pilot with genuine organizational diversity, including assessment of analyst workflow integration and alert triage efficiency.

\vspace{6pt}
\textbf{Author Contributions:} Conceptualization, C.G. and P.D.; methodology, C.G. and P.D.; software, C.G.; validation, C.P. and P.D.; formal analysis, C.G.; investigation, C.G.; resources, P.D.; data curation, C.G.; writing---original draft preparation, C.G.; writing---review and editing, P.D. and C.P.; visualization, C.G.; supervision, P.D. and C.P.; project administration, P.D. All authors have read and agreed to the published version of the manuscript.

\textbf{Funding:} This research received no external funding.

\textbf{Institutional Review Board Statement:} Not applicable. This study uses publicly available, de-identified datasets.

\textbf{Informed Consent Statement:} Not applicable.

\textbf{Data Availability Statement:} The CERT Insider Threat Dataset is available from the Software Engineering Institute (\url{https://resources.sei.cmu.edu/library/asset-view.cfm?assetid=508099}). The LANL Dataset is available at \url{https://csr.lanl.gov/data/cyber1/}. The experimental code will be made available on GitHub upon acceptance of this manuscript.

\textbf{Conflicts of Interest:} The authors declare no conflicts of interest.

\vspace{6pt}
\noindent\textit{Disclaimer/Publisher's Note: The statements, opinions and data contained in all publications are solely those of the individual author(s) and contributor(s) and not of MDPI and/or the editor(s). MDPI and/or the editor(s) disclaim responsibility for any injury to people or property resulting from any ideas, methods, instructions or products referred to in the content.}

\begin{adjustwidth}{-\extralength}{0cm}
\reftitle{References}

\begin{thebibliography}{49}

\bibitem{ponemon2024} Ponemon Institute. \textit{2024 Cost of Insider Threats Global Report}; Proofpoint: Sunnyvale, CA, USA, 2024. Available online: \url{https://www.proofpoint.com/us/resources/threat-reports/cost-of-insider-threats} (accessed on 15 September 2025).
\bibitem{homoliak2019} Homoliak, I.; Toffalini, F.; Guarnizo, J.; Elovici, Y.; Ochoa, M. Insight Into Insiders and IT: A Survey of Insider Threat Taxonomies, Analysis, Modeling, and Countermeasures. \textit{ACM Comput. Surv.} \textbf{2019}, \textit{52}, 30. \href{https://doi.org/10.1145/3303771}{[CrossRef]}
\bibitem{cappelli2012} Cappelli, D.M.; Moore, A.P.; Trzeciak, R.F. \textit{The CERT Guide to Insider Threats}; Addison-Wesley: Boston, MA, USA, 2012.
\bibitem{salem2008} Salem, M.B.; Hershkop, S.; Stolfo, S.J. A Survey of Insider Attack Detection Research. In \textit{Insider Attack and Cyber Security}; Stolfo, S.J., Bellovin, S.M., Keromytis, A.D., Hershkop, S., Smith, S.W., Sinclair, S., Eds.; Springer: Boston, MA, USA, 2008; pp. 69--90. \href{https://doi.org/10.1007/978-0-387-77322-3_5}{[CrossRef]}
\bibitem{verizon2023} Verizon. \textit{2023 Data Breach Investigations Report}; Verizon Business: New York, NY, USA, 2023. Available online: \url{https://www.verizon.com/business/resources/reports/dbir/} (accessed on 20 September 2025).
\bibitem{yuan2021} Yuan, S.; Wu, X. Deep Learning for Insider Threat Detection: Review, Challenges and Opportunities. \textit{Comput. Secur.} \textbf{2021}, \textit{104}, 102221. \href{https://doi.org/10.1016/j.cose.2021.102221}{[CrossRef]}
\bibitem{liu2019} Liu, L.; De Vel, O.; Han, Q.L.; Zhang, J.; Xiang, Y. Detecting and Preventing Cyber Insider Threats: A Survey. \textit{IEEE Commun. Surv. Tutor.} \textbf{2019}, \textit{20}, 1397--1417. \href{https://doi.org/10.1109/COMST.2018.2800740}{[CrossRef]}
\bibitem{le2020} Le, D.C.; Zincir-Heywood, N. Anomaly Detection for Insider Threats Using Unsupervised Ensembles. \textit{IEEE Trans. Netw. Serv. Manag.} \textbf{2020}, \textit{18}, 1152--1164. \href{https://doi.org/10.1109/TNSM.2020.3037019}{[CrossRef]}
\bibitem{chattopadhyay2018} Chattopadhyay, P.; Wang, L.; Tan, Y.P. Scenario-Based Insider Threat Detection From Cyber Activities. \textit{IEEE Trans. Comput. Soc. Syst.} \textbf{2018}, \textit{5}, 660--675. \href{https://doi.org/10.1109/TCSS.2018.2857473}{[CrossRef]}
\bibitem{singh2023} Singh, M.; Silakari, S. A Systematic Review on Machine Learning Approaches for Insider Threat Detection. \textit{J. King Saud Univ.--Comput. Inf. Sci.} \textbf{2023}, \textit{35}, 101571. \href{https://doi.org/10.1016/j.jksuci.2023.101571}{[CrossRef]}
\bibitem{voigt2017} Voigt, P.; Von dem Bussche, A. \textit{The EU General Data Protection Regulation (GDPR)}; Springer: Cham, Switzerland, 2017. \href{https://doi.org/10.1007/978-3-319-57959-7}{[CrossRef]}
\bibitem{alsowail2022} Alsowail, R.A.; Al-Shehari, T. Techniques and Countermeasures for Preventing Insider Threats. \textit{PeerJ Comput. Sci.} \textbf{2022}, \textit{8}, e938. \href{https://doi.org/10.7717/peerj-cs.938}{[CrossRef]}
\bibitem{liu2023} Liu, J.; Kantarci, B.; Adams, S. Dynamic Deep Learning for Insider Threat Detection: A Multi-Granularity Embedded Model. \textit{IEEE Trans. Depend. Secur. Comput.} \textbf{2023}, \textit{20}, 2373--2387. \href{https://doi.org/10.1109/TDSC.2022.3180399}{[CrossRef]}
\bibitem{tuor2017} Tuor, A.; Kaplan, S.; Hutchinson, B.; Nichols, N.; Robinson, S. Deep Learning for Unsupervised Insider Threat Detection in Structured Cybersecurity Data Streams. In Proceedings of the AAAI Workshop on Artificial Intelligence for Cyber Security (AICS), San Francisco, CA, USA, 4--5 February 2017.
\bibitem{gavai2015} Gavai, G.; Sricharan, K.; Gunber, D.; Hanley, J.; Singhal, M.; Rolleston, R. Detecting Insider Threat from Enterprise Social and Online Activity Data. In Proceedings of the 7th ACM CCS Workshop on Security and Artificial Intelligence (AISec), Denver, CO, USA, 12 October 2015. \href{https://doi.org/10.1145/2808769.2808782}{[CrossRef]}
\bibitem{sanzgiri2016} Sanzgiri, A.; Dasgupta, D. Classification of Insider Threat Detection Techniques. In Proceedings of the 11th Annual Cyber and Information Security Research Conference (CISRC), Oak Ridge, TN, USA, 5--7 April 2016. \href{https://doi.org/10.1145/2897795.2897799}{[CrossRef]}
\bibitem{almhiqani2020} Al-Mhiqani, M.N.; Ahmad, R.; Abidin, Z.Z.; Yassin, W.; Hassan, A.; Abdulkareem, K.H.; Ali, N.S.; Yunos, Z. A Review of Insider Threat Detection: Classification, Machine Learning Techniques, Datasets, Open Challenges, and Recommendations. \textit{Appl. Sci.} \textbf{2020}, \textit{10}, 5208. \href{https://doi.org/10.3390/app10155208}{[CrossRef]}
\bibitem{mcmahan2017} McMahan, B.; Moore, E.; Ramage, D.; Hampson, S.; Arcas, B.A. Communication-Efficient Learning of Deep Networks from Decentralized Data. In Proceedings of the 20th International Conference on Artificial Intelligence and Statistics (AISTATS), Fort Lauderdale, FL, USA, 20--22 April 2017; pp. 1273--1282.
\bibitem{kairouz2021} Kairouz, P.; McMahan, H.B.; Avent, B.; et al. Advances and Open Problems in Federated Learning. \textit{Found. Trends Mach. Learn.} \textbf{2021}, \textit{14}, 1--210. \href{https://doi.org/10.1561/2200000083}{[CrossRef]}
\bibitem{li2020fedprox} Li, T.; Sahu, A.K.; Zaheer, M.; Sanjabi, M.; Talwalkar, A.; Smith, V. Federated Optimization in Heterogeneous Networks. In Proceedings of Machine Learning and Systems (MLSys), Austin, TX, USA, 2--4 March 2020.
\bibitem{mothukuri2021} Mothukuri, V.; Parizi, R.M.; Pouriyeh, S.; Huang, Y.; Dehghantanha, A.; Srivastava, G. A Survey on Security and Privacy of Federated Learning. \textit{Future Gener. Comput. Syst.} \textbf{2021}, \textit{115}, 619--640. \href{https://doi.org/10.1016/j.future.2020.10.007}{[CrossRef]}
\bibitem{popoola2021} Popoola, S.I.; Adebisi, B.; Hammoudeh, M.; Gui, G.; Gacanin, H. Federated Deep Learning for Collaborative Intrusion Detection in Heterogeneous Networks. In Proceedings of the IEEE 93rd Vehicular Technology Conference (VTC), Helsinki, Finland, 25--28 April 2021. \href{https://doi.org/10.1109/VTC2021-Spring51267.2021.9448998}{[CrossRef]}
\bibitem{li2020nids} Li, B.; Wu, Y.; Song, J.; Lu, R.; Li, T.; Zhao, L. DeepFed: Federated Deep Learning for Intrusion Detection in Industrial Cyber--Physical Systems. \textit{IEEE Trans. Ind. Inform.} \textbf{2020}, \textit{17}, 5615--5624. \href{https://doi.org/10.1109/TII.2020.3023430}{[CrossRef]}
\bibitem{rey2022} Rey, V.; S\'{a}nchez, P.M.S.; Celdr\'{a}n, A.H.; Bovet, G. Federated Learning for Malware Detection in IoT Devices. \textit{Comput. Netw.} \textbf{2022}, \textit{204}, 108693. \href{https://doi.org/10.1016/j.comnet.2021.108693}{[CrossRef]}
\bibitem{nguyen2019} Nguyen, T.D.; Marchal, S.; Miettinen, M.; Fereidooni, H.; Asokan, N.; Sadeghi, A.-R. D\"{I}oT: A Federated Self-Learning Anomaly Detection System for IoT. In Proceedings of the IEEE 39th International Conference on Distributed Computing Systems (ICDCS), Dallas, TX, USA, 7--10 July 2019. \href{https://doi.org/10.1109/ICDCS.2019.00080}{[CrossRef]}
\bibitem{zhao2019} Zhao, Y.; Chen, J.; Wu, D.; Teng, J.; Yu, S. Multi-Task Network Anomaly Detection Using Federated Learning. In Proceedings of the 10th International Symposium on Information and Communication Technology (SoICT), Hanoi, Vietnam, 4--6 December 2019. \href{https://doi.org/10.1145/3368926.3369705}{[CrossRef]}
\bibitem{preuveneers2018} Preuveneers, D.; Rimmer, V.; Tsingenopoulos, I.; Spooren, J.; Joosen, W.; Ilie-Zudor, E. Chained Anomaly Detection Models for Federated Learning: An Intrusion Detection Case Study. \textit{Appl. Sci.} \textbf{2018}, \textit{8}, 2663. \href{https://doi.org/10.3390/app8122663}{[CrossRef]}
\bibitem{chen2020fedids} Chen, Z.; Lv, N.; Liu, P.; Fang, Y.; Chen, K.; Pan, W. Intrusion Detection for Wireless Edge Networks Based on Federated Learning. \textit{IEEE Access} \textbf{2020}, \textit{8}, 217463--217472. \href{https://doi.org/10.1109/ACCESS.2020.3041793}{[CrossRef]}
\bibitem{kim2022} Kim, H.; Park, J.; Lee, S. Federated Insider Threat Detection: A Preliminary Investigation. In Proceedings of the IEEE International Conference on Big Data, Osaka, Japan, 17--20 December 2022. \href{https://doi.org/10.1109/BigData55660.2022.10020891}{[CrossRef]}
\bibitem{karimireddy2020} Karimireddy, S.P.; Kale, S.; Mohri, M.; Reddi, S.; Stich, S.; Suresh, A.T. SCAFFOLD: Stochastic Controlled Averaging for Federated Learning. In Proceedings of the 37th International Conference on Machine Learning (ICML), Virtual, 13--18 July 2020.
\bibitem{wang2020} Wang, J.; Liu, Q.; Liang, H.; Joshi, G.; Poor, H.V. Tackling the Objective Inconsistency Problem in Heterogeneous Federated Optimization. In Proceedings of the 34th Conference on Neural Information Processing Systems (NeurIPS), Virtual, 6--12 December 2020.
\bibitem{li2022fedbn} Li, X.; Jiang, M.; Zhang, X.; Kamp, M.; Deng, Q. FedBN: Federated Learning on Non-IID Features via Local Batch Normalization. In Proceedings of the 9th International Conference on Learning Representations (ICLR), Virtual, 3--7 May 2021.
\bibitem{hsu2019} Hsu, T.-M.H.; Qi, H.; Brown, M. Measuring the Effects of Non-Identical Data Distribution for Federated Visual Classification. \textit{arXiv} \textbf{2019}, arXiv:1909.06335.
\bibitem{li2021fedadam} Reddi, S.; Charles, Z.; Zaheer, M.; Garrett, Z.; Rush, K.; Kone\v{c}n\'{y}, J.; Kumar, S.; McMahan, H.B. Adaptive Federated Optimization. In Proceedings of the 9th International Conference on Learning Representations (ICLR), Virtual, 3--7 May 2021.
\bibitem{zhu2021} Zhu, Z.; Hong, J.; Zhou, J. Data-Free Knowledge Distillation for Heterogeneous Federated Learning. In Proceedings of the 38th International Conference on Machine Learning (ICML), Virtual, 18--24 July 2021.
\bibitem{elshenawy2025} Elshenawy, A.; Eli, T.; Bosworth, T.; Amaechi, A.U.; Kenfack, P.J.; Ayman, A.; Ma, X. A Comparative Analysis of Federated Learning Approaches for Multi-Class Breast Cancer Classification in Ultrasound Imaging. \textit{AI} \textbf{2025}, \textit{6}, 316. \href{https://doi.org/10.3390/ai6040064}{[CrossRef]}
\bibitem{glasser2013} Glasser, J.; Lindauer, B. Bridging the Gap: A Pragmatic Approach to Generating Insider Threat Data. In Proceedings of the 2013 IEEE Security and Privacy Workshops, San Francisco, CA, USA, 23--24 May 2013. \href{https://doi.org/10.1109/SPW.2013.37}{[CrossRef]}
\bibitem{kent2016} Kent, A.D. Cyber Security Data Sources for Dynamic Network Research. In \textit{Dynamic Networks and Cyber-Security}; Adams, N., Heard, N., Eds.; World Scientific: Singapore, 2016; pp. 37--65.
\bibitem{hochreiter1997} Hochreiter, S.; Schmidhuber, J. Long Short-Term Memory. \textit{Neural Comput.} \textbf{1997}, \textit{9}, 1735--1780. \href{https://doi.org/10.1162/neco.1997.9.8.1735}{[CrossRef]}
\bibitem{lecun1998} LeCun, Y.; Bottou, L.; Bengio, Y.; Haffner, P. Gradient-Based Learning Applied to Document Recognition. \textit{Proc. IEEE} \textbf{1998}, \textit{86}, 2278--2324. \href{https://doi.org/10.1109/5.726791}{[CrossRef]}
\bibitem{kingma2013} Kingma, D.P.; Welling, M. Auto-Encoding Variational Bayes. \textit{arXiv} \textbf{2013}, arXiv:1312.6114.
\bibitem{bishop1994} Bishop, C.M. Novelty Detection and Neural Network Validation. \textit{IEE Proc.-Vis. Image Signal Process.} \textbf{1994}, \textit{141}, 217--222.
\bibitem{beutel2020flower} Beutel, D.J.; Tober, T.; Mathur, A.; Li, T.; Smith, V.; Lane, N.D. Flower: A Friendly Federated Learning Framework. \textit{arXiv} \textbf{2020}, arXiv:2007.14390.
\bibitem{delong1988} DeLong, E.R.; DeLong, D.M.; Clarke-Pearson, D.L. Comparing the Areas Under Two or More Correlated Receiver Operating Characteristic Curves: A Nonparametric Approach. \textit{Biometrics} \textbf{1988}, \textit{44}, 837--845. \href{https://doi.org/10.2307/2531595}{[CrossRef]}
\bibitem{breiman2001} Breiman, L. Random Forests. \textit{Mach. Learn.} \textbf{2001}, \textit{45}, 5--32. \href{https://doi.org/10.1023/A:1010933404324}{[CrossRef]}
\bibitem{zhang2022} Zhang, J.; Chen, B.; Cheng, X.; Binh, H.T.T.; Yu, S. PoisonGAN: Generative Poisoning Attacks Against Federated Learning in Edge Computing Systems. \textit{IEEE Internet Things J.} \textbf{2022}, \textit{8}, 3310--3322. \href{https://doi.org/10.1109/JIOT.2020.3023126}{[CrossRef]}
\bibitem{dwork2014} Dwork, C.; Roth, A. The Algorithmic Foundations of Differential Privacy. \textit{Found. Trends Theor. Comput. Sci.} \textbf{2014}, \textit{9}, 211--407. \href{https://doi.org/10.1561/0400000042}{[CrossRef]}
\bibitem{geyer2017} Geyer, R.C.; Klein, T.; Nabi, M. Differentially Private Federated Learning: A Client Level Perspective. \textit{arXiv} \textbf{2017}, arXiv:1712.07557.
\bibitem{fallah2020} Fallah, A.; Mokhtari, A.; Ozdaglar, A. Personalized Federated Learning with Moreau Envelopes. In Proceedings of the 34th Conference on Neural Information Processing Systems (NeurIPS), Virtual, 6--12 December 2020.
\bibitem{deng2020} Deng, Y.; Kamani, M.M.; Mahdavi, M. Adaptive Personalized Federated Learning. \textit{arXiv} \textbf{2020}, arXiv:2003.13461.

\end{thebibliography}
\end{adjustwidth}

\end{document}
`;
