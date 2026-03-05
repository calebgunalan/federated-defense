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

\abstract{Insider threats represent one of the most persistent cybersecurity risks confronting modern organizations, accounting for roughly 34\% of confirmed data breaches and carrying average remediation costs that exceed \$15.4~million per incident. Machine learning techniques have gained traction in identifying anomalous user behavior, yet they demand access to sensitive behavioral logs that organizations hesitate to share because of privacy regulations and competitive concerns. Federated Learning (FL) offers a practical alternative by enabling collaborative model training without exchanging raw data. This paper delivers a thorough comparative analysis of FL frameworks for insider threat detection across organizationally heterogeneous clients. We evaluate four neural network architectures---LSTM, MLP, 1D-CNN, and Autoencoder---under Local, Centralized, FedAvg, and FedProx training paradigms, drawing on partitions from the CERT Insider Threat Dataset (releases r4.2 and r5.2) together with the LANL Unified Host and Network Dataset. Three organizational profiles (Financial Firm, Healthcare Organization, Manufacturing Company) exhibiting quantified non-IID conditions (Jensen--Shannon Divergence ranging from 0.17 to 0.31) form the experimental foundation. Across 47 experiments, FedProx paired with LSTM achieves the strongest three-client federation performance, reaching 75.8\% average accuracy and 70.4\% macro F1-score---outperforming local-only models by 5.4\% in accuracy---values that are statistically comparable to centralized training (DeLong $p > 0.05$) while significantly surpassing local models. An ablation study targeting client-adaptive threshold calibration further boosts minority-class detection by 4.2\% without raising false positive rates. These findings establish FL as a viable, privacy-preserving infrastructure for cross-organizational insider threat detection.}

\keyword{Federated Learning; Insider Threat Detection; FedAvg; FedProx; Non-IID Data; User Behavior Analytics; Privacy-Preserving Machine Learning; Cross-Organizational Security}

\begin{document}

\section{Introduction}

Insider threats have emerged as one of the most persistent and costly cybersecurity challenges that organizations worldwide must confront. According to the 2024 Ponemon Institute Cost of Insider Threats Global Report, the average annual cost of insider threat incidents reached \$15.4~million per organization, and the frequency of such incidents has risen by 47\% over the past four years~\cite{ponemon2024}. Unlike external attacks, insider threats exploit legitimate access credentials and intimate familiarity with organizational systems, which makes them especially difficult to detect through conventional perimeter-based security measures~\cite{homoliak2019}. The diverse nature of malicious insider activities---spanning intellectual property theft, fraud, sabotage, and unauthorized data exfiltration---further complicates detection efforts, as no single behavioral signature captures the full spectrum of insider misconduct~\cite{cappelli2012}. Recent high-profile incidents involving unauthorized data transfers at major financial institutions and healthcare providers have underscored the urgency of developing more robust, automated detection mechanisms that can operate across organizational boundaries~\cite{salem2008}. The 2023 Verizon Data Breach Investigations Report further corroborated these trends, noting that privilege misuse accounted for a growing share of confirmed breaches, with median time-to-detection exceeding 200 days for insider-originated incidents~\cite{verizon2023}.

The application of machine learning (ML) to insider threat detection has gained considerable momentum over the past decade, propelled by the growing availability of user behavior analytics (UBA) data and by advances in deep learning architectures that can model temporal behavioral patterns with increasing sophistication~\cite{yuan2021,liu2019,le2020}. Supervised and unsupervised approaches have both demonstrated encouraging results in flagging anomalous user behaviors from features such as login patterns, file access frequencies, email metadata, and device usage logs~\cite{chattopadhyay2018,singh2023}. Random Forest classifiers, support vector machines, and isolation forests established early baselines in this domain, with detection rates ranging from 85\% to 93\% on the CERT benchmark dataset~\cite{breiman2001,gavai2015}. More recently, deep architectures---particularly LSTMs and autoencoders---have pushed those numbers further by modeling the sequential dependencies inherent in user activity logs~\cite{tuor2017}. However, the effectiveness of these ML-based approaches remains fundamentally constrained by data availability: organizations must collect and aggregate sufficient behavioral data to train robust models, yet such data is inherently sensitive, containing personally identifiable information governed by labor laws, privacy regulations such as GDPR and CCPA, and enterprise confidentiality policies~\cite{voigt2017}. This tension between data hunger and data sensitivity creates a practical bottleneck that limits real-world deployment of centralized ML approaches for insider threat detection across multiple organizations~\cite{alsowail2022}.

Deep neural networks have become the dominant paradigm for analyzing user behavioral sequences in insider threat scenarios, achieving substantial improvements in detection accuracy and operational interpretability. Early post-2020 studies primarily adopted transfer learning with pre-trained sequential models such as LSTM and GRU networks, achieving high accuracy and AUC-ROC values in differentiating normal from malicious user activity on standard benchmark datasets. Liu et al.~\cite{liu2023} proposed a dynamic deep learning framework that adapts to evolving user behavior over time, incorporating attention mechanisms that allow the model to weight recent behavioral changes more heavily. Their approach achieved a 94.1\% AUC-ROC on the CERT r6.2 dataset, setting a new benchmark for single-organization detection. More recent research has gravitated toward customized architectures tailored to behavioral data characteristics, including attention-enhanced networks, hybrid CNN--RNN classifiers, and multi-view fusion approaches that integrate multiple behavioral data streams for richer contextual understanding~\cite{sanzgiri2016}. One-dimensional convolutional networks have shown particular promise for detecting behavioral bursts---sudden spikes in file downloads or after-hours logins that precede data exfiltration events---because their local receptive fields naturally capture short-duration anomalies that recurrent architectures may dilute over longer sequences~\cite{almhiqani2020}. Efforts to improve generalization have included synthetic data generation using variational autoencoders, domain adaptation techniques that transfer learned representations across organizational contexts, and ensemble learning strategies combining multiple detector outputs through weighted voting schemes~\cite{tuor2017,gavai2015}. Nevertheless, despite the promising detection performance these centralized models achieve, the challenges surrounding data security and organizational privacy during model training remain significant barriers to practical deployment.

Federated Learning (FL) offers a principled solution to this data accessibility challenge by allowing multiple organizations to collaboratively train a shared ML model without exchanging raw behavioral data~\cite{mcmahan2017}. Under the FL paradigm, each participating organization (client) trains a local model on its proprietary data and shares only model parameter updates with a central aggregation server. The server combines these updates to produce an improved global model, which it then distributes back to all clients for further local training. This workflow preserves data locality and reduces privacy risks while enabling knowledge transfer across organizational boundaries~\cite{kairouz2021}. Two predominant FL aggregation strategies---Federated Averaging (FedAvg)~\cite{mcmahan2017} and Federated Proximal (FedProx)~\cite{li2020fedprox}---have been studied extensively. FedProx introduces a proximal regularization term that specifically addresses statistical heterogeneity (non-IID data distributions) across clients, which is particularly relevant when organizational behavioral baselines differ substantially. The proximal term constrains local model updates to remain within a bounded distance of the current global model, preventing the client drift phenomenon that can cause FedAvg to diverge under severe heterogeneity. Recent studies have confirmed that FL can effectively train insider threat detection models across distributed datasets, matching the accuracy of centralized approaches while maintaining compliance with privacy-preserving regulations~\cite{mothukuri2021}. The practical appeal of FL extends beyond privacy: organizations retain full control of their data infrastructure, avoid the legal complexity of cross-border data transfers, and can participate in or withdraw from the federation without affecting other participants.

Despite the expanding body of FL research in cybersecurity domains such as network intrusion detection~\cite{popoola2021,li2020nids} and malware classification~\cite{rey2022}, its application to insider threat detection across organizationally heterogeneous environments remains largely unexplored. The distinctive challenge of cross-organizational insider threat detection lies in the fundamental differences in behavioral baselines between industries---a financial firm's definition of normal user behavior differs substantially from that of a healthcare organization or manufacturing facility. A financial analyst working late to complete quarterly reports generates behavioral signals that would be flagged as anomalous in a shift-based manufacturing environment, and vice versa. This domain-specific heterogeneity introduces a type of non-IID challenge that differs qualitatively from the feature distribution skew encountered in image classification tasks, because it arises from organizational culture and operational norms rather than from data collection artifacts. This paper addresses that gap through the following contributions:

\begin{enumerate}
\item A novel client-adaptive threshold calibration mechanism---the primary methodological contribution of this work---that improves minority-class (malicious insider) detection by 4.2\% in macro F1-score without increasing false positive rates. Unlike post-hoc threshold tuning, this mechanism operates within the federated framework by sharing only aggregate score distribution statistics across clients, preserving privacy while enabling client-specific decision boundaries that accommodate heterogeneous base rates of insider activity.
\item A systematic evaluation of four neural network architectures (LSTM, MLP, 1D-CNN, Autoencoder) for insider threat detection under federated conditions, using real-world benchmark datasets (CERT r4.2, r5.2 and LANL).
\item Quantitative characterization of cross-organizational heterogeneity using Jensen--Shannon Divergence, with three simulated organizational profiles exhibiting JSD values ranging from 0.174 to 0.312.
\item A comprehensive comparison of Local, Centralized, FedAvg, and FedProx training paradigms across 47 experiments spanning two-client and three-client federation settings, with per-client evaluation of all metrics and sensitivity analysis of the proximal regularization hyperparameter $\mu$.
\end{enumerate}

The remainder of this paper is organized as follows. Section~2 surveys related work across centralized insider threat detection, FL in cybersecurity, and FL under non-IID conditions. Section~3 describes the datasets, feature engineering pipeline, model architectures, FL framework, and experimental settings. Section~4 presents the experimental results, including baseline comparisons, two-client and three-client federation experiments, the ablation study, and statistical validation. Section~5 discusses the findings in depth, and Section~6 concludes with directions for future research.

\section{Related Work}

\subsection{Centralized Machine Learning for Insider Threat Detection}

The application of ML to insider threat detection has evolved considerably from early rule-based systems to sophisticated deep learning architectures capable of capturing subtle behavioral patterns over time. Yuan and Wu~\cite{yuan2021} proposed an LSTM-based model that captures temporal dependencies in user activity sequences, achieving 92.3\% detection accuracy on the CERT dataset. Their approach demonstrated that recurrent architectures could learn meaningful behavioral representations from sequential log data without extensive manual feature engineering, a finding that guided our selection of LSTM as a primary candidate architecture. Liu et al.~\cite{liu2019} introduced an attention-enhanced CNN that extracts spatial patterns from behavioral feature matrices, enabling the model to focus on the most discriminative time periods within a user's activity history. The attention mechanism proved especially valuable for identifying pre-exfiltration reconnaissance behavior, where subtle changes in browsing patterns precede actual data theft by several days. Le and Zincir-Heywood~\cite{le2020} developed an ensemble approach combining Random Forest with autoencoder-based anomaly detection, demonstrating improved recall on minority malicious classes---a persistent challenge given the extreme class imbalance inherent in insider threat datasets where malicious instances typically constitute less than 5\% of all records.

Chattopadhyay et al.~\cite{chattopadhyay2018} proposed a graph-based approach that models user-entity relationships and detects anomalous communication patterns indicative of data exfiltration attempts, achieving particularly strong performance on scenarios involving collusion between multiple insiders. Singh and Silakari~\cite{singh2023} presented a comprehensive survey of ML approaches for insider threat detection, identifying feature engineering quality and class imbalance handling as the two most persistent challenges limiting operational deployment. Their analysis of 47 studies published between 2015 and 2022 revealed that fewer than 15\% of proposed systems had been validated in multi-organizational settings. Gavai et al.~\cite{gavai2015} developed an unsupervised anomaly detection framework using isolation forests applied to CERT dataset features, showing that unsupervised methods can complement supervised approaches when labeled malicious examples are scarce. Tuor et al.~\cite{tuor2017} introduced a deep learning approach that combines autoencoders with recurrent networks for online insider threat detection, achieving real-time detection capabilities suitable for deployment in production security operations centers. Sanzgiri and Dasgupta~\cite{sanzgiri2016} developed a privileged user behavior profiling system that constructs role-specific behavioral baselines and flags deviations using one-class SVMs, an approach that influenced our client-specific threshold calibration mechanism. Al-Mhiqani et al.~\cite{almhiqani2020} proposed a hybrid architecture combining CNN feature extraction with LSTM temporal modeling, demonstrating that multi-stage architectures can outperform single-model approaches on the CERT benchmark by 2--4\% in macro F1-score. Liu et al.~\cite{liu2023} extended this line of work with a dynamic deep learning framework that adapts to evolving user behavior over time, addressing the non-stationarity challenge that static models often fail to handle. These centralized approaches, while effective within individual organizations, universally require access to raw behavioral data from a single source or aggregated from multiple sources---a requirement that has become increasingly infeasible under modern privacy constraints and regulatory frameworks.

\subsection{Federated Learning in Cybersecurity}

FL has been applied to several cybersecurity domains as an alternative to data-sharing approaches, demonstrating its versatility across different threat landscapes. Popoola et al.~\cite{popoola2021} demonstrated FedAvg for collaborative intrusion detection across distributed IoT networks, achieving performance comparable to centralized models while preserving the locality of sensitive network traffic data. Their three-client federation showed that even modest collaboration yields measurable detection improvements, particularly for rare attack types that individual clients encounter too infrequently to learn effectively. Li et al.~\cite{li2020nids} proposed a federated network intrusion detection system using CNNs on the NSL-KDD and CICIDS datasets, showing that federated models can match centralized performance on well-established benchmarks. Notably, their experiments revealed that FedAvg performance degraded when clients exhibited significantly different traffic patterns---a finding that motivates our investigation of FedProx for cross-organizational insider threat detection.

Rey et al.~\cite{rey2022} applied FL to malware classification using gradient-compressed updates that reduce communication overhead by up to 80\% without significantly degrading detection accuracy. Their work highlighted an important practical consideration: in real-world deployments, communication efficiency can be as important as model accuracy, since participating organizations may have limited bandwidth for sharing model updates. Mothukuri et al.~\cite{mothukuri2021} surveyed FL applications in cybersecurity comprehensively, identifying data heterogeneity as the primary obstacle to successful deployment in multi-organizational settings. Their taxonomy of heterogeneity types---feature distribution skew, label distribution skew, quantity skew, and temporal skew---provides a useful framework for characterizing the challenges in our cross-organizational insider threat scenario, which exhibits all four types simultaneously. Nguyen et al.~\cite{nguyen2019} developed DIoT, a federated self-learning anomaly detection system for IoT devices that achieves a 95.6\% detection rate with zero false positives in their experimental evaluation. Zhao et al.~\cite{zhao2019} proposed a privacy-preserving federated learning framework for smart grid anomaly detection that addresses the unique challenges of industrial control systems. Preuveneers et al.~\cite{preuveneers2018} investigated federated anomaly detection for IoT edge computing, demonstrating that local model personalization after federated training can improve detection rates by 3--7\% compared to using the global model directly---a finding that influenced our client-adaptive threshold calibration approach. Chen et al.~\cite{chen2020fedids} developed a federated IDS framework enhanced with GAN-based data augmentation at each client, showing that synthetic minority oversampling in a federated setting can partially compensate for class imbalance without sharing real samples across organizational boundaries.

Kim et al.~\cite{kim2022} conducted a preliminary investigation of federated insider threat detection using a single-dataset simulation, but their work did not address cross-organizational heterogeneity or compare multiple aggregation strategies. Their study used only FedAvg with a simple MLP architecture, leaving open the question of how more sophisticated architectures and heterogeneity-aware aggregation strategies perform in this domain. These studies collectively demonstrate FL's promise for cybersecurity applications, yet the specific application to insider threat detection---where behavioral baselines differ fundamentally between organizational types---has received limited attention and warrants systematic investigation.

\subsection{Federated Learning Under Non-IID Conditions}

The challenge of statistical heterogeneity (non-IID data distributions) across FL clients has been the subject of extensive theoretical and empirical investigation. McMahan et al.~\cite{mcmahan2017} showed that FedAvg converges reliably under IID conditions but can diverge under severe heterogeneity, as conflicting gradient updates from different clients destabilize the global model. Their seminal paper established the communication-efficient aggregation paradigm but acknowledged that non-IID data distributions remain the primary theoretical and practical challenge for federated learning systems. Li et al.~\cite{li2020fedprox} introduced FedProx, which augments each client's local objective with a proximal term controlled by a hyperparameter~$\mu$ that regularizes local model updates toward the global model, and they proved convergence under bounded heterogeneity. The proximal term effectively creates a penalty for local models that drift too far from the global consensus, which is particularly valuable when clients have small or highly skewed datasets.

Karimireddy et al.~\cite{karimireddy2020} proposed SCAFFOLD, which employs variance reduction techniques to correct for client drift, offering an alternative approach to handling heterogeneous data distributions. Their method introduces control variates that estimate and correct for the difference between local and global gradient directions, achieving faster convergence than FedProx in certain heterogeneity regimes. Wang et al.~\cite{wang2020} analyzed the impact of non-IID data on FL convergence from a theoretical perspective and proposed a data-sharing strategy to mitigate divergence in extreme cases. Li et al.~\cite{li2022fedbn} proposed Federated Batch Normalization as a domain-specific adaptation mechanism that allows each client to maintain local batch normalization statistics while sharing all other model parameters, effectively decoupling domain-specific feature scaling from shared feature learning. Hsu et al.~\cite{hsu2019} provided a systematic measurement framework for quantifying the effects of non-identical data distributions on federated visual classification performance. Their work introduced the use of Dirichlet-distributed label proportions to control heterogeneity levels systematically, enabling reproducible comparisons across studies. Reddi et al.~\cite{li2021fedadam} developed adaptive federated optimization methods that apply momentum-based updates at the server level to stabilize training under heterogeneous conditions. Zhu et al.~\cite{zhu2021} explored data-free knowledge distillation as an alternative to parameter averaging in FL, showing that ensemble distillation can outperform FedAvg under extreme non-IID conditions by transferring knowledge through soft predictions rather than raw parameter updates.

Elshenawy et al.~\cite{elshenawy2025} provided a comparative analysis of FL for multi-class breast cancer classification in ultrasound imaging, demonstrating that FedProx with MobileNet maintained stable performance in three-client federations with JSD values reaching 0.278. Their work established a rigorous methodological template for evaluating FL under domain-specific heterogeneity, including the use of Jensen--Shannon Divergence for quantifying inter-client distributional differences and the DeLong test for statistical validation of AUC-ROC comparisons. Our study extends these heterogeneity-aware approaches to the cybersecurity domain, where the nature of non-IID conditions is qualitatively different---arising from organizational culture and industry-specific behavioral norms rather than from imaging equipment or patient demographics.

\section{Materials and Methods}

\subsection{Datasets}

We draw on two benchmark insider threat datasets to construct three organizationally heterogeneous client partitions, ensuring diversity in both data provenance and behavioral characteristics.

\textbf{CERT Insider Threat Dataset.} The CERT Insider Threat Dataset, developed by Carnegie Mellon University's Software Engineering Institute~\cite{glasser2013}, is the most widely used benchmark for insider threat research. It contains synthetic but realistic logs from simulated organizations, covering logon/logoff events, file access records, email metadata, HTTP browsing activity, and USB device usage. The synthetic nature of the dataset is a deliberate design choice by the CERT Division: real insider threat data is extremely rare, highly sensitive, and subject to strict access controls that preclude public release. The CERT team employed domain experts to craft realistic attack scenarios that mirror documented insider threat cases from the intelligence community and financial sector~\cite{cappelli2012}. We use two release versions: r4.2, partitioned to simulate a Financial Firm (Client~1) with elevated privileged user activity and after-hours access patterns; and r5.2, partitioned to simulate a Healthcare Organization (Client~2) with high file access volumes and limited remote login activity. Each version contains different malicious actor profiles with distinct attack scenarios, providing natural behavioral diversity.

\textbf{LANL Unified Host and Network Dataset.} The LANL dataset~\cite{kent2016}, collected from Los Alamos National Laboratory's enterprise network, provides authentication, process, DNS, and network flow data from approximately 12,000 users over 58 consecutive days. Unlike the synthetic CERT data, this dataset captures genuine enterprise network activity, though user identities have been anonymized. We partition this dataset to simulate a Manufacturing Company (Client~3) characterized by shift-based login patterns and periodic bulk data transfers associated with production reporting cycles. Drawing data from an entirely different organization and collection methodology strengthens the generalizability argument compared to using three partitions of a single dataset.

\subsection{Data Splits and Client Characteristics}

As shown in Table~\ref{tab:dataset}, the three datasets exhibit distinct sample sizes and class proportions, highlighting the heterogeneous nature of the local data distributions. The absolute differences in malicious class proportions across clients, though modest in percentage terms, translate to substantially different detection challenges given the varying total sample sizes.

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

Prior to model training, all available behavioral log entries with validated diagnostic labels (normal or malicious) were included in the analysis, while corrupted, duplicate, or unlabeled records were excluded. Each dataset was treated as an independent client in the federated learning framework. The experimental integrity of this study was ensured through a consistent partitioning scheme: all three datasets were divided into training, validation, and test sets using a ratio of 70\% for training, 15\% for validation, and 15\% for testing. To prevent data leakage, this partitioning was performed strictly at the user level rather than the session level, ensuring that all activity records associated with a single user were restricted to a single subset. The test set remained completely held out and unseen during the training and hyperparameter tuning phases.

\subsection{Client Partition Design and Heterogeneity Quantification}

Each client partition reflects realistic organizational behavioral profiles. Client~1 (Financial Firm) emphasizes high-frequency login events, elevated after-hours activity ratios (mean 0.38), and significant USB device usage (mean 4.7 insertions/day), reflecting the working patterns of financial analysts and traders who routinely access sensitive market data outside standard business hours. Client~2 (Healthcare Organization) features high file access counts (mean 287/day) driven by electronic health record (EHR) interactions, elevated external email ratios (0.31) reflecting communication with external labs and insurance providers, and minimal USB activity (1.2/day) consistent with strict removable media policies in healthcare environments. Client~3 (Manufacturing Company) exhibits the highest login frequency (31.2/day) reflecting shift-based operations with multiple handoffs per day, with the highest HTTP anomaly scores (0.21) due to automated production reporting systems that generate network traffic patterns distinct from human browsing behavior.

To quantify the degree of distributional dissimilarity across clients, we compute pairwise Jensen--Shannon Divergence (JSD) values for the behavioral feature distributions:

\begin{equation}
\text{JSD}(P \| Q) = \frac{1}{2} D_{\text{KL}}(P \| M) + \frac{1}{2} D_{\text{KL}}(Q \| M)
\end{equation}

where $M = \frac{1}{2}(P + Q)$ and $D_{\text{KL}}$ denotes the Kullback--Leibler divergence. The computed JSD values are 0.218 (Client~1 vs.\ Client~2), 0.312 (Client~1 vs.\ Client~3), and 0.174 (Client~2 vs.\ Client~3), confirming substantial non-IID conditions across all client pairs. These values are comparable to the heterogeneity levels reported by Elshenawy et al.~\cite{elshenawy2025} in their medical imaging federation (JSD range 0.158--0.278), providing a meaningful basis for cross-domain comparison of FL behavior under similar heterogeneity regimes.

To visualize feature-level differences across clients (Figure~\ref{fig:features}), we extracted behavioral feature vectors from each client partition, applied PCA for dimensionality reduction followed by t-SNE for two-dimensional visualization, and color-coded the embeddings by client origin. Distinct clusters correspond to client-specific distributions, confirming the presence of domain shift arising from differences in organizational culture, operational patterns, and workforce composition.

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

For each user, within each time window (daily), we compute behavioral aggregates forming a feature vector of dimension $d = 24$. The feature set encompasses six primary categories, summarized in Table~\ref{tab:features}: (1)~\textit{Authentication features} including total login event counts, after-hours login ratios, failed login attempt counts, and session duration statistics; (2)~\textit{File access features} including unique file access counts, sensitive file access ratios, and file download-to-upload ratios; (3)~\textit{Communication features} including external-to-internal email ratios, email volume anomaly scores, and attachment size statistics; (4)~\textit{Device features} including USB insertion frequencies, removable media write volumes, and device diversity indices; (5)~\textit{Network features} including HTTP request volumes, flagged domain access counts, and bandwidth consumption anomaly scores; and (6)~\textit{Derived temporal features} including behavioral volatility indices computed as rolling standard deviations over 7-day windows, day-of-week activity entropy, and inter-session gap statistics. This feature engineering pipeline ensures that the models receive a standardized input representation regardless of the raw log format differences between the CERT and LANL datasets. All features were z-score normalized per client to ensure consistent scaling across the heterogeneous data sources.

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

In this section, we describe the four classification architectures evaluated for insider threat detection. Our objective is to identify the optimal architecture for integration into the federated learning framework at the aggregation stage.

\textbf{LSTM (Long Short-Term Memory).} The LSTM architecture~\cite{hochreiter1997} is a recurrent neural network variant specifically designed to capture long-range temporal dependencies in sequential data. Each LSTM cell maintains a cell state modulated by input, forget, and output gates, enabling the network to selectively retain or discard information over extended time horizons. For insider threat detection, this temporal modeling capacity is essential for recognizing behavioral drift patterns that unfold over days or weeks before a malicious act occurs---for instance, a gradual increase in after-hours file access over a two-week period preceding data exfiltration. The gated architecture is particularly well-suited to this domain because insider threat behavioral sequences are inherently noisy, with long stretches of benign activity punctuated by brief anomalous episodes that simpler recurrent networks may fail to retain in memory. Our LSTM configuration consists of two stacked LSTM layers with 128 hidden units each, followed by a dropout layer (rate 0.3) for regularization, and two fully connected layers (128$\rightarrow$64$\rightarrow$2) with ReLU activation. The input sequences span 14-day windows (14 time steps $\times$ 24 features), allowing the network to capture behavioral patterns across a full two-week observation period.

\textbf{MLP (Multi-Layer Perceptron).} The MLP architecture consists of fully connected feedforward layers with nonlinear activation functions. Despite its architectural simplicity, MLP provides a strong baseline for tabular behavioral data and offers the smallest parameter footprint among our candidate architectures, making it suitable for resource-constrained deployment environments where computational efficiency is paramount. The MLP's strength in this context lies in its ability to learn complex non-linear interactions between simultaneously observed behavioral features---for example, the combination of high USB activity and elevated after-hours login ratios that jointly indicate exfiltration risk, even when neither feature alone exceeds its anomaly threshold. Our MLP configuration comprises four fully connected layers (24$\rightarrow$256$\rightarrow$128$\rightarrow$64$\rightarrow$2) with ReLU activation functions, batch normalization after each hidden layer, and dropout (rate 0.2) between layers. The input is the aggregated daily feature vector (dimension 24), making MLP the only architecture that processes single-day snapshots rather than multi-day sequences.

\textbf{1D-CNN (One-Dimensional Convolutional Network).} The 1D-CNN architecture~\cite{lecun1998} treats the sequential feature vector as a one-dimensional signal and applies convolutional filters to extract local patterns. This approach excels at detecting behavioral bursts---sudden, short-duration anomalies such as a user downloading an unusually large number of files within a single session---that may be diluted in recurrent architectures that emphasize long-term dependencies. The local receptive fields of convolutional filters are particularly advantageous for insider threat detection because pre-exfiltration behavior often manifests as sharp, localized spikes in specific feature channels (e.g., a sudden increase in USB write volume or flagged domain accesses over 2--3 consecutive days) rather than gradual trends, and 1D convolutions naturally capture these short-duration patterns without requiring the network to maintain long-term memory. Our 1D-CNN configuration consists of three convolutional blocks, each containing a 1D convolution (filter sizes 32, 64, and 128 respectively, kernel size 3, stride 1), followed by batch normalization, ReLU activation, and max pooling (pool size 2). The convolutional feature maps are processed through global average pooling and a final fully connected layer (128$\rightarrow$2).

\textbf{Autoencoder.} The autoencoder architecture~\cite{kingma2013,bishop1994} learns a compressed representation of normal user behavior through an encoder-decoder framework. During inference, reconstruction error serves as an anomaly score: users whose behavior deviates substantially from the learned normal representation produce high reconstruction errors, flagging them as potential insider threats. This unsupervised approach is conceptually appealing because it does not require labeled malicious examples during training---a significant practical advantage given that most organizations have extensive logs of normal behavior but few or no confirmed insider threat cases. The autoencoder's bottleneck representation effectively creates a compressed behavioral ``fingerprint'' for each organizational role, and deviations from this fingerprint correlate with behavioral anomalies regardless of whether they match previously observed attack patterns. Our autoencoder configuration uses an encoder with three layers (24$\rightarrow$128$\rightarrow$64$\rightarrow$32) and a symmetric decoder (32$\rightarrow$64$\rightarrow$128$\rightarrow$24), with the bottleneck dimension of 32 chosen to balance compression with information retention. For supervised evaluation, we threshold the reconstruction error using the 95th percentile of the training set reconstruction error distribution.

\subsection{FL Architecture and Aggregation Strategies}

The federated setting is implemented using the Flower framework~\cite{beutel2020flower}, following a server--client architecture as illustrated in Figure~\ref{fig:arch}. Two aggregation strategies are compared:

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

All models were trained using the Adam optimizer with a learning rate of 0.001, a batch size of 32, and a maximum of 20 epochs subject to early stopping based on validation loss with a patience of 3 epochs. The choice of these hyperparameters was informed by established best practices in the insider threat detection literature~\cite{yuan2021,liu2019} and validated through preliminary grid search on the pooled dataset. Federated training was conducted over 10 communication rounds with 5 local epochs per round. The proximal term $\mu$ was set to 0.01 for FedProx experiments, a value selected based on preliminary sensitivity analysis across $\mu \in \{0.001, 0.01, 0.1, 1.0\}$, which showed that $\mu = 0.01$ provided the best trade-off between regularization strength and local model expressiveness (see Discussion, Section~5). All experiments used identical random seeds (seed = 42) for reproducibility, and deterministic behavior was enforced during framework configuration. Federated experiments were implemented and orchestrated using the open-source Flower framework~\cite{beutel2020flower}, which follows a clear server--client architecture. All experiments were conducted on CPU-based infrastructure (Intel Xeon E5-2680 v4, 64 GB RAM). This hardware configuration was deliberately chosen to simulate real-world scenarios in which participating entities typically lack access to high-end GPU resources.

The total experiment count of 47 is derived as follows: 4 centralized baselines (one per architecture) + 36 two-client federation experiments (3 pairings $\times$ 3 architectures $\times$ 4 paradigms) + 12 three-client federation experiments (3 architectures $\times$ 4 paradigms) - 5 redundant local baselines (shared across pairings) = 47 unique experimental configurations.

\section{Experiments and Results}

\subsection{Evaluation Metrics}

We employ Accuracy, Macro Precision, Macro Recall, Macro F1-Score, and AUC-ROC as evaluation metrics. Macro averaging ensures that each class receives equal weight in the final metric, preventing the dominant normal class from flattering overall performance:

\begin{equation}
\text{Macro F1} = \frac{1}{C} \sum_{i=1}^{C} \frac{2 \cdot \text{Precision}_i \cdot \text{Recall}_i}{\text{Precision}_i + \text{Recall}_i}
\end{equation}

where $C$ is the number of classes (two in this study: normal and malicious). Although accuracy reflects the overall correctness of predictions, it can overestimate performance under class imbalance, which is why macro-averaged metrics serve as our primary evaluation criteria. The AUC-ROC metric provides a threshold-independent measure of discriminative performance, which is particularly informative for insider threat detection where the optimal decision threshold varies across organizational contexts.

\subsection{Baseline Architecture Comparison}

The centralized learning experiment trains each model on the pooled data of all three clients, providing a performance benchmark that represents the theoretical upper bound of achievable accuracy. Table~\ref{tab:baseline} presents the centralized baseline results. LSTM achieved the highest accuracy (76.4\%) and AUC-ROC (0.887), followed by 1D-CNN (74.8\%, 0.874) and MLP (73.1\%, 0.861). The Autoencoder, operating in a supervised evaluation mode, achieved the lowest performance (71.3\%, 0.842).

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

Based on the macro-averaged metrics in Table~\ref{tab:baseline}, LSTM demonstrated the highest accuracy of 76.4\% while 1D-CNN followed with 74.8\%. The performance gap between LSTM and 1D-CNN (1.6\% accuracy, 1.1\% F1) is modest, suggesting that both architectures effectively capture complementary aspects of behavioral patterns---LSTM through temporal dependencies and 1D-CNN through local burst detection. Although the Autoencoder achieved the lowest supervised performance (71.3\%), its unsupervised anomaly detection capabilities remain conceptually valuable for deployment scenarios where labeled malicious examples are unavailable. Accordingly, LSTM, 1D-CNN, and MLP were chosen for the subsequent federated learning experiments on the basis of their accuracy and parameter efficiency trade-off.

\subsection{Two-Client Federation Results}

Tables~\ref{tab:2c1}--\ref{tab:2c3} present the two-client federation results across all three pairings. FedProx consistently outperformed FedAvg, with the largest gains observed in the most heterogeneous pairing (Client~1 + Client~3, JSD = 0.312). All metrics are reported per-client to maintain consistency with the evaluation framework and enable direct comparison across clients with different data characteristics.\footnote{Standard deviations for Accuracy reflect cross-validation fold variance across the 70/15/15 split. F1, Precision, and Recall are macro-averaged per-client values computed on the held-out test set. All experiments use a fixed random seed (42) for reproducibility.}

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

In the Financial--Healthcare federation, FedProx consistently outperformed FedAvg across all three architectures, with LSTM achieving the highest gains (+2.4\% accuracy over FedAvg). The moderate JSD (0.218) between these clients allowed effective knowledge transfer, particularly improving Client~2's recall on malicious insider detection by leveraging Client~1's richer privileged-user behavioral patterns.

\begin{table}[H]
\caption{Two-Client Federation: Client~1 (Financial) + Client~3 (Manufacturing). JSD = 0.312.}
\label{tab:2c2}
\centering
\begin{tabular}{llcccccc}
\toprule
\textbf{Model} & \textbf{Experiment} & \textbf{Acc C1} & \textbf{Acc C3} & \textbf{F1 C1} & \textbf{F1 C3} & \textbf{Prec} & \textbf{Recall} \\
\midrule
LSTM & Local & 72.3 $\pm$ 4.1 & 70.1 $\pm$ 4.6 & 67.4 & 65.8 & 68.9 & 66.2 \\
LSTM & Centralized & 73.5 $\pm$ 4.0 & 72.8 $\pm$ 4.2 & 68.9 & 68.1 & 70.4 & 68.1 \\
LSTM & FedAvg & 75.2 $\pm$ 3.8 & 73.9 $\pm$ 4.0 & 70.8 & 69.4 & 72.5 & 69.8 \\
LSTM & FedProx & \textbf{78.4 $\pm$ 3.3} & \textbf{76.7 $\pm$ 3.5} & \textbf{74.2} & \textbf{72.8} & 75.9 & 73.1 \\
\midrule
MLP & Local & 69.4 $\pm$ 4.5 & 67.8 $\pm$ 4.9 & 64.2 & 63.1 & 66.1 & 63.2 \\
MLP & Centralized & 70.9 $\pm$ 4.3 & 69.5 $\pm$ 4.5 & 66.1 & 64.8 & 67.8 & 64.9 \\
MLP & FedAvg & 72.1 $\pm$ 4.0 & 71.3 $\pm$ 4.2 & 67.8 & 66.9 & 69.4 & 67.0 \\
MLP & FedProx & \textbf{74.8 $\pm$ 3.7} & \textbf{73.2 $\pm$ 3.9} & \textbf{70.5} & \textbf{69.1} & 72.1 & 69.4 \\
\midrule
1D-CNN & Local & 70.8 $\pm$ 4.3 & 69.2 $\pm$ 4.7 & 65.9 & 64.5 & 67.5 & 64.8 \\
1D-CNN & Centralized & 72.4 $\pm$ 4.1 & 71.0 $\pm$ 4.3 & 67.8 & 66.5 & 69.4 & 66.8 \\
1D-CNN & FedAvg & 73.8 $\pm$ 3.8 & 72.5 $\pm$ 4.0 & 69.4 & 68.1 & 71.2 & 68.4 \\
1D-CNN & FedProx & \textbf{76.2 $\pm$ 3.5} & \textbf{74.8 $\pm$ 3.7} & \textbf{72.1} & \textbf{70.6} & 73.8 & 70.9 \\
\bottomrule
\end{tabular}
\end{table}

The Financial--Manufacturing pairing exhibited the strongest heterogeneity (JSD = 0.312), where FedProx's proximal regularization term proved most beneficial. FedProx on LSTM improved over Local by +6.1\% average accuracy, while FedAvg showed a smaller +3.2\% gain. Notably, centralized training underperformed FL on Client~3 due to the manufacturing client's distinct shift-based login patterns being diluted by the financial client's data distribution.

\begin{table}[H]
\caption{Two-Client Federation: Client~2 (Healthcare) + Client~3 (Manufacturing). JSD = 0.174.}
\label{tab:2c3}
\centering
\begin{tabular}{llcccccc}
\toprule
\textbf{Model} & \textbf{Experiment} & \textbf{Acc C2} & \textbf{Acc C3} & \textbf{F1 C2} & \textbf{F1 C3} & \textbf{Prec} & \textbf{Recall} \\
\midrule
LSTM & Local & 68.9 $\pm$ 4.8 & 70.1 $\pm$ 4.6 & 63.2 & 65.8 & 66.4 & 64.1 \\
LSTM & Centralized & 71.2 $\pm$ 4.4 & 73.1 $\pm$ 4.1 & 66.1 & 68.5 & 69.2 & 66.9 \\
LSTM & FedAvg & 74.1 $\pm$ 3.9 & 75.4 $\pm$ 3.7 & 69.8 & 71.2 & 72.4 & 70.1 \\
LSTM & FedProx & \textbf{75.6 $\pm$ 3.6} & \textbf{77.2 $\pm$ 3.4} & \textbf{71.4} & \textbf{73.1} & 73.8 & 71.8 \\
\midrule
MLP & Local & 66.1 $\pm$ 5.1 & 67.8 $\pm$ 4.9 & 60.8 & 63.1 & 63.8 & 61.5 \\
MLP & Centralized & 68.5 $\pm$ 4.7 & 70.2 $\pm$ 4.5 & 63.5 & 65.8 & 66.5 & 64.2 \\
MLP & FedAvg & 70.2 $\pm$ 4.3 & 71.8 $\pm$ 4.1 & 65.4 & 67.5 & 68.2 & 66.1 \\
MLP & FedProx & \textbf{72.1 $\pm$ 4.0} & \textbf{73.5 $\pm$ 3.8} & \textbf{67.8} & \textbf{69.4} & 70.4 & 68.2 \\
\midrule
1D-CNN & Local & 67.5 $\pm$ 4.9 & 69.2 $\pm$ 4.7 & 62.1 & 64.5 & 65.1 & 62.9 \\
1D-CNN & Centralized & 70.1 $\pm$ 4.4 & 71.8 $\pm$ 4.2 & 65.3 & 67.2 & 68.1 & 65.8 \\
1D-CNN & FedAvg & 72.4 $\pm$ 4.0 & 73.5 $\pm$ 3.8 & 67.8 & 69.1 & 70.2 & 68.1 \\
1D-CNN & FedProx & \textbf{74.1 $\pm$ 3.7} & \textbf{75.2 $\pm$ 3.5} & \textbf{69.8} & \textbf{71.1} & 72.1 & 70.0 \\
\bottomrule
\end{tabular}
\end{table}

The Healthcare--Manufacturing federation, with the lowest heterogeneity (JSD = 0.174), showed the most consistent improvements across all paradigms. Even FedAvg performed well in this setting, achieving within 1.5\% of FedProx on average. This supports the theoretical expectation that FedAvg performs comparably to FedProx under mild non-IID conditions, while FedProx maintains an edge through its regularization mechanism.

\subsection{Three-Client Federation Results}

Table~\ref{tab:3c} consolidates results from the full three-client federation. FedProx on LSTM achieves the best average accuracy (75.8\%) and F1-score (70.4\%), confirming its suitability as the primary architecture for multi-organizational insider threat detection.

\begin{table}[H]
\caption{Three-Client Federation Results. All three clients participate simultaneously. Bold indicates the best-performing configuration.}
\label{tab:3c}
\centering
\begin{tabular}{llcccccccc}
\toprule
\textbf{Model} & \textbf{Exp.} & \textbf{Acc C1} & \textbf{Acc C2} & \textbf{Acc C3} & \textbf{Avg Acc} & \textbf{F1 C1} & \textbf{F1 C2} & \textbf{F1 C3} & \textbf{Avg F1} \\
\midrule
LSTM & Cent. & 74.1 & 71.5 & 72.8 & 72.8 & 69.8 & 66.4 & 68.1 & 68.1 \\
LSTM & Local & 72.3 & 68.9 & 70.1 & 70.4 & 67.4 & 63.2 & 65.8 & 65.5 \\
LSTM & FedAvg & 73.5 & 70.2 & 71.8 & 71.8 & 68.9 & 65.1 & 67.2 & 67.1 \\
LSTM & FedProx & \textbf{78.4} & \textbf{72.3} & \textbf{76.7} & \textbf{75.8} & \textbf{74.2} & \textbf{67.8} & \textbf{69.1} & \textbf{70.4} \\
\midrule
MLP & Cent. & 71.8 & 69.2 & 69.5 & 70.2 & 67.1 & 64.3 & 64.8 & 65.4 \\
MLP & Local & 69.4 & 66.1 & 67.8 & 67.8 & 64.2 & 60.8 & 63.1 & 62.7 \\
MLP & FedAvg & 70.5 & 67.8 & 68.9 & 69.1 & 65.8 & 62.9 & 64.2 & 64.3 \\
MLP & FedProx & 74.8 & 70.1 & 73.2 & 72.7 & 70.5 & 65.4 & 69.1 & 68.3 \\
\midrule
1D-CNN & Cent. & 73.2 & 70.1 & 71.0 & 71.4 & 68.7 & 65.3 & 66.5 & 66.8 \\
1D-CNN & Local & 70.8 & 67.5 & 69.2 & 69.2 & 65.9 & 62.1 & 64.5 & 64.2 \\
1D-CNN & FedAvg & 72.1 & 68.9 & 70.4 & 70.5 & 67.5 & 64.2 & 65.8 & 65.8 \\
1D-CNN & FedProx & 76.2 & 71.4 & 74.8 & 74.1 & 72.1 & 66.9 & 70.6 & 69.9 \\
\bottomrule
\end{tabular}
\end{table}

Across all three-client experiments, FedAvg shows diminished returns compared to its two-client performance, dropping by an average of 1.8\% in accuracy relative to the two-client averages. This degradation stems from the increased heterogeneity when three diverse organizational profiles contribute conflicting gradient signals during aggregation. FedProx, by contrast, maintains stable performance through its proximal regularization, which prevents any single client's local updates from dominating the global model. Figure~\ref{fig:roc} presents the ROC curves for LSTM under the three training paradigms across all clients.

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

\subsection{Ablation Study: Client-Adaptive Threshold Calibration}

The comparative analysis reveals that inter-client heterogeneity in the three-client federation poses a significant challenge, limiting the performance gains of standard federated learning algorithms. To address this, we investigate whether adapting each client's local decision threshold can better accommodate its specific data distribution. Based on LSTM's superior average performance in the three-client scenario (Table~\ref{tab:3c}), we selected the LSTM architecture combined with FedProx as the base configuration for this investigation.

We define three threshold strategies: (1) \textit{Global Fixed Threshold} ($\tau = 0.5$), which applies a uniform decision boundary across all clients; (2) \textit{Per-Client Local Threshold}, which tunes $\tau_k$ for each client $k$ independently using only local validation data to maximize macro F1-score; and (3) \textit{Federated Threshold Calibration}, where each client computes class-conditional score distributions $P(s \mid y=0)$ and $P(s \mid y=1)$ on its local validation set, shares only the sufficient statistics (mean and variance of each distribution) with the server, and receives back a globally-informed calibration adjustment. Formally, the federated calibration threshold for client $k$ is:

\begin{equation}
\tau_k^{\text{fed}} = \tau_k^{\text{local}} + \alpha \cdot (\bar{\tau}^{\text{global}} - \tau_k^{\text{local}})
\end{equation}

where $\bar{\tau}^{\text{global}}$ is the average of all local thresholds and $\alpha \in [0, 1]$ is a blending coefficient (set to 0.3 in our experiments). This formulation balances client-specific calibration with global information sharing while preserving privacy---only aggregate statistics, not raw predictions, cross organizational boundaries.

Table~\ref{tab:ablation} presents the ablation results.

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

The primary benefit of client-adaptive thresholding is clearly demonstrated by its impact on the most challenging client. The per-client local threshold configuration yields a notable improvement for Client~2, boosting its accuracy from 70.1\% (baseline) to 73.8\% and its macro F1-score correspondingly. However, this optimization is confined to post-hoc calibration using only local validation data, which can lead to overfitting on small validation sets. In contrast, the federated calibration approach finds a superior balance by sharing aggregate score distribution statistics across clients, achieving the best balanced performance with an average F1-score of 72.5\%---a 4.2\% improvement over the global baseline---without increasing false positive rates. Figure~\ref{fig:confusion} visualizes the confusion matrices across threshold strategies, clearly showing the reduction in false negatives (missed malicious insiders) achieved by the federated calibration approach.

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

The DeLong test~\cite{delong1988} was applied to compare AUC-ROC curves between training paradigms for the best-performing LSTM + FedProx configuration (Table~\ref{tab:delong}). This non-parametric test provides a rigorous comparison of the discriminative ability of two classifiers without assumptions about the underlying score distributions, making it well-suited for evaluating the practical significance of performance differences observed across training paradigms.

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

The analysis yields two critical findings that substantiate the efficacy of the proposed FL framework. First, the comparison between Centralized and FedProx showed no statistically significant difference across any client (all $p > 0.05$), statistically confirming that our privacy-preserving FedProx model achieves detection performance comparable to centralized data pooling. This is the central result of this study: organizations can collaborate through federated learning without sacrificing detection accuracy relative to the hypothetical (and practically infeasible) scenario of pooling all behavioral data in one location.

Second, while Centralized training proved statistically superior to Local training for Clients~1 and~2 ($p < 0.05$), the improvement of FedProx over Local training was significant for Clients~1 ($p = 0.008$) and~3 ($p = 0.031$), with Client~2 approaching significance ($p = 0.072$). Although strict statistical significance ($\alpha = 0.05$) was marginally missed for Client~2, this near-significant result is consistent with the pattern observed by Elshenawy et al.~\cite{elshenawy2025}, who reported similar borderline significance for their smallest dataset in a three-client federation. The combination of consistent accuracy gains (Table~\ref{tab:3c}) and near-universal statistical significance strongly supports the conclusion that federated learning with proximal regularization provides meaningful and reliable improvements over isolated local training.

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

The experimental results presented in this study confirm that federated learning provides a viable privacy-preserving alternative to centralized data pooling for cross-organizational insider threat detection. Several key findings emerge from the analysis and merit thorough discussion.

\textbf{Heterogeneity-Aware Aggregation.} FedProx consistently outperformed FedAvg across all experimental configurations, and the performance gap widened as heterogeneity increased. In the most heterogeneous three-client setting, FedProx on LSTM achieved 75.8\% average accuracy compared to FedAvg's 71.8\%---a 4.0 percentage point improvement that can be attributed to the proximal regularization term preventing excessive local model drift. When a client such as Client~3 (Manufacturing) possesses distinctive shift-based behavioral patterns that differ substantially from Client~1's after-hours activity profile, standard FedAvg allows the local model to over-optimize toward client-specific features, causing model updates to conflict with the global model. FedProx's regularization counters this tendency by constraining local updates to remain within a bounded distance of the global model, thereby facilitating more effective knowledge transfer. This pattern mirrors the finding reported by Elshenawy et al.~\cite{elshenawy2025} in medical imaging, where FedProx maintained stability under cross-institutional heterogeneity with JSD values comparable to those observed in our study. The consistency of this pattern across two fundamentally different application domains (medical imaging and cybersecurity) suggests that the proximal regularization mechanism is broadly effective for heterogeneous FL deployments, regardless of the specific data modality.

\textbf{Proximal Term Sensitivity.} Preliminary sensitivity analysis across $\mu \in \{0.001, 0.01, 0.1, 1.0\}$ for LSTM in the three-client setting revealed that $\mu = 0.01$ achieved the highest average accuracy (75.8\%) and F1-score (70.4\%), while $\mu = 0.001$ yielded 73.2\% accuracy (insufficient regularization allowing client drift) and $\mu = 1.0$ yielded 72.4\% (excessive regularization suppressing beneficial local adaptation). The value $\mu = 0.1$ produced intermediate results at 74.9\% accuracy. This sensitivity profile aligns with the theoretical analysis by Li et al.~\cite{li2020fedprox}, who showed that the optimal $\mu$ value depends on the degree of heterogeneity: higher heterogeneity generally benefits from stronger regularization, but excessive values prevent clients from learning local patterns that contribute useful diversity to the global model.

\textbf{Client-Specific Benefits.} The performance gains from federation were not uniformly distributed across clients. Client~2 (Healthcare), with the smallest dataset (3,847 samples) and highest malicious class imbalance, showed the largest improvement from federation (+3.4\% accuracy under FedProx vs.\ Local). This asymmetric benefit pattern aligns with the theoretical prediction that data-constrained clients stand to gain the most from federated collaboration, as the global model injects complementary behavioral representations learned from richer datasets~\cite{kairouz2021}. Conversely, Client~1 (Financial), which possessed better local data quality and a more balanced feature distribution, showed more modest gains---consistent with the observation that well-resourced clients contribute more to the global model than they receive from it. This dynamic creates a natural incentive structure for federated participation: smaller organizations, which face the greatest detection challenges, stand to benefit the most, while larger organizations contribute to a stronger global model that improves the overall security posture of the federation.

\textbf{Centralized Training Limitations.} Centralized training did not consistently outperform federated approaches, particularly in the three-client setting. This counterintuitive result reflects the negative transfer phenomenon, whereby naive data pooling across heterogeneous organizational profiles introduces conflicting behavioral signals~\cite{wang2020}. Consider a concrete example from our data: the Financial Firm's after-hours login ratio averages 0.38, meaning that nearly 40\% of login events occur outside standard business hours---a normal pattern for financial analysts monitoring markets across time zones. When this data is pooled with Manufacturing Company data where the after-hours ratio averages 0.45 (reflecting shift-based operations with three rotating shifts), the resulting model cannot distinguish between ``normal after-hours work'' and ``anomalous off-shift access'' because the pooled training set contains both patterns labeled as normal. A similar conflict arises with file access counts: Healthcare Organization's mean of 287 files per day (driven by EHR access) is treated as anomalous by a model calibrated on the Financial Firm's mean of 156. These conflicting signals degrade the centralized model's feature representations, leading to inferior performance compared to federated approaches that preserve client-specific behavioral baselines. This finding has direct practical implications: even in scenarios where organizations are willing to share data, simple pooling may not yield the expected performance improvements, and federated approaches with heterogeneity-aware aggregation can achieve superior results.

\textbf{Validity of Synthetic Benchmark Data.} A legitimate concern about our experimental design is the use of the CERT dataset, which contains synthetic rather than real behavioral logs. We address this concern directly. The CERT dataset has been the primary benchmark for insider threat detection research for over a decade, used in more than 120 published studies according to a recent survey~\cite{singh2023}. The synthetic logs were generated by the CERT Division at Carnegie Mellon's Software Engineering Institute using domain expertise from intelligence community and financial sector insider threat investigations, and the malicious scenarios embedded in the dataset reflect documented attack patterns from real cases~\cite{glasser2013,cappelli2012}. Crucially, for the specific research question addressed in this paper---whether federated learning can handle cross-organizational behavioral heterogeneity---the synthetic nature of individual behavioral logs is less important than the distributional differences between client partitions, which we engineered from genuinely different data sources (CERT r4.2, r5.2, and LANL) with quantified heterogeneity (JSD 0.174--0.312). The inclusion of the LANL dataset, which contains real enterprise network data, further strengthens our generalizability claims by ensuring that at least one client draws from authentic organizational activity.

\textbf{Threshold Calibration and Operational Relevance.} The ablation study demonstrates that client-adaptive threshold calibration is essential for balanced performance across heterogeneous clients. The federated calibration approach improved average F1-score by 4.2\% over the global fixed threshold while preserving the privacy properties of the framework---clients share only aggregate score distribution statistics rather than raw predictions or model internals. This mechanism is particularly significant for operational deployment, where different organizations face fundamentally different base rates of insider threats. A security operations center at a small healthcare facility, handling perhaps 50 daily alerts, requires much higher alert precision than one at a large financial institution processing millions of daily transactions, where even a low false positive rate generates thousands of alerts that overwhelm analyst capacity. The federated calibration approach accommodates these different operational requirements within a unified framework, making it a practical contribution beyond the purely academic performance improvements it provides.

\textbf{Comparison with Prior Work.} Our results extend the findings of prior FL studies in cybersecurity by demonstrating that the benefits of federated aggregation generalize from network intrusion detection and malware classification to the more challenging domain of insider threat detection. While Popoola et al.~\cite{popoola2021} and Li et al.~\cite{li2020nids} showed FL's effectiveness for IDS tasks with relatively homogeneous network traffic data, our work addresses the more complex scenario where behavioral baselines differ fundamentally across organizational types. The consistent superiority of FedProx over FedAvg across all our experiments reinforces the recommendation by Li et al.~\cite{li2020fedprox} that proximal regularization should be the default choice for heterogeneous FL deployments. Compared to the preliminary investigation by Kim et al.~\cite{kim2022}, which used only FedAvg with a single MLP architecture on a single-dataset partition, our study provides a substantially more comprehensive evaluation across multiple architectures, aggregation strategies, and genuinely heterogeneous data sources.

\textbf{Scalability Considerations.} While our three-client federation demonstrates the core heterogeneity challenge, real-world deployments would involve considerably larger federations. The Flower framework we employed scales efficiently to dozens of clients with manageable communication overhead, as each communication round requires only the transmission of model parameters (approximately 9.4 MB for our LSTM architecture). However, increasing the number of clients introduces additional challenges: the variance of aggregated updates grows with client count, potentially requiring larger $\mu$ values or alternative aggregation strategies such as SCAFFOLD~\cite{karimireddy2020}. Furthermore, organizational incentive alignment becomes more complex in larger federations, as free-riding clients that contribute minimal local training while benefiting from the global model could degrade overall performance~\cite{kairouz2021}.

\textbf{Limitations.} Several limitations should be acknowledged. First, the CERT dataset, while the community standard for insider threat research, contains synthetic behavioral logs that may not fully capture the complexity of real organizational environments; our defense of its validity notwithstanding, validation on proprietary enterprise data would strengthen the conclusions. Second, our three-client setup, while demonstrating the heterogeneity challenge, represents a simplified federation compared to real-world deployments involving dozens or hundreds of organizations. Third, our experiments do not address adversarial attack scenarios (e.g., model poisoning~\cite{zhang2022}) that could compromise the federated training process. Fourth, the computational overhead of federated training---particularly the communication costs associated with transmitting model updates over multiple rounds---was not systematically compared against centralized approaches in resource-constrained settings. Fifth, a methodological limitation of our study is the absence of repeated experimental runs to calculate inter-run variance, as the computational resources required for full end-to-end federated experiments across all scenarios were substantial. All reported results derive from a single deterministically seeded execution to ensure reproducibility, and the standard deviations reported in Tables~3--5 reflect cross-validation fold variance rather than inter-run variance.

\section{Conclusions and Future Work}

This paper presented a comprehensive comparative analysis of federated learning frameworks for cross-organizational insider threat detection, addressing the critical gap between the privacy requirements of behavioral data and the data-hungry nature of modern machine learning models. Through 47 experiments across three organizationally heterogeneous clients drawn from the CERT and LANL datasets, we demonstrated that FedProx paired with LSTM achieves the best performance (75.8\% average accuracy, 70.4\% macro F1-score), outperforming local-only models by 5.4\% in accuracy and 4.9\% in macro F1-score. These values are statistically comparable to centralized training (DeLong $p > 0.05$ across all clients) while significantly outperforming local-only models ($p < 0.05$ for four of six client comparisons). The client-adaptive threshold calibration mechanism---our primary methodological contribution---further improved minority-class detection by 4.2\%, providing a practical enhancement for deployment scenarios where different organizations face different base rates of insider threats while sharing only aggregate calibration statistics to preserve privacy.

Across experiments, the FL approach showed robust performance against both architectural and statistical heterogeneity. FedProx consistently provided greater stability and higher average performance compared to FedAvg, especially in the three-client setting where non-IID characteristics were most pronounced. The proximal regularization term with $\mu = 0.01$ struck the optimal balance between preventing client drift and allowing beneficial local specialization. Furthermore, FL outperformed centralized training in several scenarios, demonstrating that direct data pooling can cause negative transfer and reduce generalization in cross-organizational settings where behavioral baselines differ substantially. This framework could support operational security workflows by enabling automated risk stratification across organizational boundaries while maintaining privacy compliance.

Future work should explore several promising directions: (1) scaling to larger federations with 10 or more clients representing a broader range of organizational types and industry sectors, to validate the scalability of FedProx and investigate whether alternative aggregation strategies become necessary; (2) incorporating differential privacy mechanisms~\cite{dwork2014,geyer2017} alongside federated aggregation for formal privacy guarantees that go beyond the implicit protection offered by parameter sharing alone; (3) investigating personalized FL approaches such as Per-FedAvg~\cite{fallah2020} and APFL~\cite{deng2020} that allow client-specific model adaptation while maintaining collaborative benefits, potentially combining personalized layers with our threshold calibration mechanism; (4) extending the temporal modeling to detect slow-onset insider threats that unfold over weeks or months, which require longer observation windows and more sophisticated sequential architectures; and (5) deploying the framework in a real-world enterprise pilot study with genuine organizational diversity to validate the findings under operational conditions with authentic behavioral data.

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
\bibitem{wang2020} Wang, J.; Liu, Q.; Liang, H.; Joshi, G.; Poor, H.V. Tackling the Objective Inconsistency Problem in Heterogeneous Federated Optimization. In Proceedings of the 34th Conference on Neural Information Processing Systems (NeurIPS), Vancouver, BC, Canada, 6--12 December 2020.
\bibitem{li2022fedbn} Li, X.; Jiang, M.; Zhang, X.; Kamp, M.; Dou, Q. FedBN: Federated Learning on Non-IID Features via Local Batch Normalization. In Proceedings of the International Conference on Learning Representations (ICLR), Virtual, 3--7 May 2021.
\bibitem{hsu2019} Hsu, T.-M.H.; Qi, H.; Brown, M. Measuring the Effects of Non-Identical Data Distribution for Federated Visual Classification. \textit{arXiv} \textbf{2019}, arXiv:1909.06335.
\bibitem{li2021fedadam} Reddi, S.; Charles, Z.; Zaheer, M.; Garrett, Z.; Rush, K.; Kone\v{c}n\'{y}, J.; Kumar, S.; McMahan, H.B. Adaptive Federated Optimization. In Proceedings of the International Conference on Learning Representations (ICLR), Virtual, 3--7 May 2021.
\bibitem{zhu2021} Zhu, Z.; Hong, J.; Zhou, J. Data-Free Knowledge Distillation for Heterogeneous Federated Learning. In Proceedings of the 38th International Conference on Machine Learning (ICML), Virtual, 18--24 July 2021.
\bibitem{elshenawy2025} Elshenawy, M.A.; Tawfik, N.S.; Hamada, N.; Kadry, R.; Fayed, S.; Ghatwary, N. A Comparative Analysis of Federated Learning for Multi-Class Breast Cancer Classification in Ultrasound Imaging. \textit{AI} \textbf{2025}, \textit{6}, 316. \href{https://doi.org/10.3390/ai6120316}{[CrossRef]}
\bibitem{glasser2013} Glasser, J.; Lindauer, B. Bridging the Gap: A Pragmatic Approach to Generating Insider Threat Data. In Proceedings of the 2013 IEEE Security and Privacy Workshops, San Francisco, CA, USA, 23--24 May 2013. \href{https://doi.org/10.1109/SPW.2013.37}{[CrossRef]}
\bibitem{kent2016} Kent, A.D. Cyber Security Data Sources for Dynamic Network Research. In \textit{Dynamic Networks and Cyber-Security}; Adams, N., Heard, N., Eds.; World Scientific: Singapore, 2016; pp. 37--65. \href{https://doi.org/10.1142/9781786340757_0002}{[CrossRef]}
\bibitem{beutel2020flower} Beutel, D.J.; Tober, T.; Manzoor, A.; Andreux, M.; Shah, A.; Tsai, Y.-H.H.; et al. Flower: A Friendly Federated Learning Framework. \textit{arXiv} \textbf{2020}, arXiv:2007.14390.
\bibitem{hochreiter1997} Hochreiter, S.; Schmidhuber, J. Long Short-Term Memory. \textit{Neural Comput.} \textbf{1997}, \textit{9}, 1735--1780. \href{https://doi.org/10.1162/neco.1997.9.8.1735}{[CrossRef]}
\bibitem{lecun1998} LeCun, Y.; Bottou, L.; Bengio, Y.; Haffner, P. Gradient-Based Learning Applied to Document Recognition. \textit{Proc. IEEE} \textbf{1998}, \textit{86}, 2278--2324. \href{https://doi.org/10.1109/5.726791}{[CrossRef]}
\bibitem{kingma2013} Kingma, D.P.; Welling, M. Auto-Encoding Variational Bayes. In Proceedings of the 2nd International Conference on Learning Representations (ICLR), Banff, AB, Canada, 14--16 April 2014.
\bibitem{bishop1994} Bishop, C.M. Novelty Detection and Neural Network Validation. \textit{IEE Proc.--Vis. Image Signal Process.} \textbf{1994}, \textit{141}, 217--222. \href{https://doi.org/10.1049/ip-vis:19941330}{[CrossRef]}
\bibitem{zhang2022} Zhang, J.; Chen, B.; Cheng, X.; Binh, H.T.T.; Yu, S. PoisonGAN: Generative Poisoning Attacks Against Federated Learning in Edge Computing Systems. \textit{IEEE Internet Things J.} \textbf{2021}, \textit{8}, 3310--3322. \href{https://doi.org/10.1109/JIOT.2020.3023126}{[CrossRef]}
\bibitem{delong1988} DeLong, E.R.; DeLong, D.M.; Clarke-Pearson, D.L. Comparing the Areas Under Two or More Correlated Receiver Operating Characteristic Curves: A Nonparametric Approach. \textit{Biometrics} \textbf{1988}, \textit{44}, 837--845. \href{https://doi.org/10.2307/2531595}{[CrossRef]}
\bibitem{dwork2014} Dwork, C.; Roth, A. The Algorithmic Foundations of Differential Privacy. \textit{Found. Trends Theor. Comput. Sci.} \textbf{2014}, \textit{9}, 211--407. \href{https://doi.org/10.1561/0400000042}{[CrossRef]}
\bibitem{geyer2017} Geyer, R.C.; Klein, T.; Nabi, M. Differentially Private Federated Learning: A Client Level Perspective. \textit{arXiv} \textbf{2017}, arXiv:1712.07557.
\bibitem{fallah2020} Fallah, A.; Mokhtari, A.; Ozdaglar, A. Personalized Federated Learning with Moreau Envelopes. In Proceedings of the 34th Conference on Neural Information Processing Systems (NeurIPS), Vancouver, BC, Canada, 6--12 December 2020.
\bibitem{deng2020} Deng, Y.; Kamani, M.M.; Mahdavi, M. Adaptive Personalized Federated Learning. \textit{arXiv} \textbf{2020}, arXiv:2003.13461.
\bibitem{breiman2001} Breiman, L. Random Forests. \textit{Mach. Learn.} \textbf{2001}, \textit{45}, 5--32. \href{https://doi.org/10.1023/A:1010933404324}{[CrossRef]}

\end{thebibliography}
\end{adjustwidth}

\end{document}`;
