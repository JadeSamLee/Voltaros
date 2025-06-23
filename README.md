# Voltaros

## Overview
**Voltaros** is an AI-powered chaos engineering tool built for the Google Cloud ADK Hackathon 2025, designed to stress-test cloud applications and ensure unbreakable reliability. Inspired by the need for resilient systems and the electric energy of Voltorb, Voltaros automates chaos experiments (pod crashes and network latency) on a GKE-hosted microservice, collects real-time metrics with BigQuery, and visualizes results using Vertex AI. With a Next.js frontend on Vercel and a Python ADK backend on Cloud Run, it makes chaos engineering accessible to beginners and experts alike.

![Screenshot 2025-06-24 041414](https://github.com/user-attachments/assets/579fe640-78ba-4737-952d-16e78fbc923b)


**Elevator Pitch**:  
Voltaros, built for the Google Cloud ADK Hackathon, automates chaos engineering with ADK agents, stress-testing GKE apps with pod crashes and latency triggers. Its Vercel-hosted Next.js frontend and Cloud Run backend deliver BigQuery-stored metrics and Vertex AI visualizations for robust system reliability.

## Features
- **Chaos Experiments**: Trigger pod crashes and network latency (200ms) on GKE apps.
- **Real-Time Metrics**: Collect CPU usage and latency via Cloud Monitoring, stored in BigQuery.
- **Visualization**: Generate plots with Vertex AI Workbench, saved to Cloud Storage.
- **User-Friendly UI**: Intuitive Next.js dashboard with dropdowns and status updates.
- **Multi-Agent Automation**: ADK-driven agents (Chaos Injector, Monitor, Reporter) orchestrate workflows.

## Installation

### Prerequisites
- **Google Cloud Account**: Enable APIs (GKE, BigQuery, Cloud Run, Cloud Storage, Vertex AI, Cloud Monitoring).
- **Node.js**: v18+ for the frontend.
- **Python**: v3.9+ with `pip` for the backend.
- **Docker**: For containerizing the backend.
- **Vercel CLI**: For frontend deployment.
- **gcloud SDK**: For Google Cloud interactions.

### Setup Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/JadeSamLee/Voltaros.git
   cd voltaros
   ```

2. **Configure Google Cloud**
   - Create a project (e.g., `voltaros-project`) and set up a service account with:
     - `roles/container.admin` (GKE)
     - `roles/bigquery.admin` (BigQuery)
     - `roles/storage.admin` (Cloud Storage)
     - `roles/aiplatform.user` (Vertex AI)
     - `roles/monitoring.viewer` (Cloud Monitoring)
   - Download the service account key as `credentials.json`.
   - Set environment variable:
     ```bash
     export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
     ```

3. **Set Up Frontend**
   - Navigate to `frontend/`.
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create `.env.local` with:
     ```
     NEXT_PUBLIC_BACKEND_URL=https://voltaros-backend-xyz.a.run.app
     ```
   - Run locally:
     ```bash
     npm run dev
     ```
   - Deploy to Vercel:
     ```bash
     vercel --prod
     ```

4. **Set Up Backend**
   - Navigate to `backend/`.
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Build and test Docker image:
     ```bash
     docker build -t voltaros-backend .
     docker run -p 8080:8080 voltaros-backend
     ```
   - Deploy to Cloud Run:
     ```bash
     gcloud run deploy voltaros-backend --image gcr.io/voltaros-project/voltaros-backend --platform managed --region us-central1 --allow-unauthenticated
     ```

5. **Deploy GKE Target App**
   - Create a GKE cluster:
     ```bash
     gcloud container clusters create voltaros-cluster --machine-type e2-standard-2 --num-nodes 3 --region us-central1
     ```
   - Apply the deployment:
     ```bash
     kubectl apply -f deployment.yaml
     ```
   - Verify pods:
     ```bash
     kubectl get pods -n default
     ```

6. **Initialize Storage and BigQuery**
   - Create buckets:
     ```bash
     gsutil mb -l us-central1 gs://voltaros-experiments
     gsutil mb -l us-central1 gs://voltaros-reports
     ```
   - Create dataset and tables:
     ```sql
     CREATE TABLE `voltaros_dataset.chaos_logs` (timestamp TIMESTAMP, experiment_type STRING, result STRING);
     CREATE TABLE `voltaros_dataset.metrics` (timestamp TIMESTAMP, metric_type STRING, value FLOAT64);
     ```

## Usage
1. **Access the Frontend**
   - Open `https://voltaros-frontend.vercel.app` in your browser.
2. **Trigger Chaos Experiment**
   - Select “Pod Crash” or “Network Latency” from the dropdown.
   - Click “Trigger Chaos Experiment” to initiate the experiment.
   - Status updates: “Triggering Pod Crash... Please wait.” → “Success! Pod Crash applied at 2025-06-24T04:53:00Z.”
3. **Collect Metrics**
   - Click “Collect Metrics” to fetch CPU usage or latency from Cloud Monitoring.
4. **Generate Report**
   - Click “Generate Report” to view a Vertex AI-generated plot (e.g., `https://storage.googleapis.com/voltaros-reports/latest_metrics_plot.png`).
5. **View Logs**
   - Check BigQuery (`voltaros_dataset.chaos_logs`, `voltaros_dataset.metrics`) or Cloud Run logs for details.

## Architecture
### User Flow Diagram
```
[End-User]
    | Opens Browser
    v
[Next.js Frontend (Vercel)]
    | https://voltaros-frontend.vercel.app
    | Actions: Trigger, Collect Metrics, Generate Report
    v
[FastAPI Backend (Cloud Run)]
    | ADK Orchestrator
    v
[ADK Agents]
    | Chaos Injector: Applies pod crash/latency
    | Monitor: Collects metrics
    | Reporter: Generates Vertex AI plots
    v
[Google Cloud Services]
    | GKE: Hosts voltaros-app
    | BigQuery: Stores logs/metrics
    | Cloud Storage: Stores plots
    | Cloud Monitoring: Provides metrics
    | Vertex AI: Generates visualizations
    v
[Chaos Toolkit]
    | Executes chaos actions
```

### Components
- **Frontend**: Next.js with Tailwind CSS, deployed on Vercel.
- **Backend**: FastAPI with ADK agents, deployed on Cloud Run.
- **Target App**: `voltaros-app` on GKE.
- **Services**: GKE, BigQuery, Cloud Storage, Cloud Monitoring, Vertex AI.

### Technologies
- Frontend: Next.js 14, TypeScript, Vercel.
- Backend: Python 3.9, FastAPI, ADK, Chaos Toolkit.
- Cloud: GKE, BigQuery, Cloud Run, Cloud Storage, Vertex AI, Cloud Monitoring.
- Tools: Docker, gcloud SDK, Firebase Studio.

## Historical Data & Logs

### BigQuery Logs: `voltaros_dataset.chaos_logs`
```json
[
  {
    "timestamp": "2025-06-24T04:43:00Z",
    "experiment_type": "pod_crash",
    "result": "{\"status\": \"success\", \"action\": \"terminate_pod\", \"pod\": \"app-pod-123\", \"details\": \"Rescheduled by Kubernetes.\"}"
  },
  {
    "timestamp": "2025-06-24T04:44:00Z",
    "experiment_type": "latency",
    "result": "{\"status\": \"success\", \"action\": \"add_network_latency\", \"delay\": \"200ms\", \"details\": \"Applied for 60s.\"}"
  }
]
```

### BigQuery Metrics: `voltaros_dataset.metrics`
```json
[
  {"timestamp": "2025-06-24T04:43:10Z", "metric_type": "cpu", "value": 0.75},
  {"timestamp": "2025-06-24T04:44:10Z", "metric_type": "latency", "value": 250.0}
]
```

### Backend Logs (Cloud Run)
```bash
2025-06-24 04:43:06,789 INFO [chaos_injector.py] Executing pod crash on app-pod-123
2025-06-24 04:43:17,890 INFO [monitor.py] Queried CPU: 0.75
2025-06-24 04:43:23,345 INFO [reporter.py] Saved plot to gs://voltaros-reports/latest_metrics_plot.png
```

### Past Incidents
- **Permission Error**: `2025-06-23T10:15:00Z`, failed pod crash due to missing `roles/container.admin`.
- **Storage Access**: `2025-06-23T10:20:00Z`, 403 error fetching `experiment.json`, resolved with updated credentials.

## Demo Details
### 3-Minute Video Script
- **0:00–0:15**: Intro with elevator pitch.
- **0:15–0:30**: Show user flow diagram: “This diagram outlines Voltaros’ chaos workflow.”
- **0:30–1:00**: Frontend demo:
  - Select “Pod Crash”, click “Trigger Chaos Experiment” → “Triggering Pod Crash... Please wait.” → “Success! Pod Crash applied at 2025-06-24T04:53:00Z.”
  - Click “Collect Metrics” and “Generate Report” to show plot.
- **1:00–2:15**: Backend logs: “Logs confirm the pod crash and metric collection at 04:53 AM IST.”
- **2:15–2:45**: Visualization: “Vertex AI plot shows CPU usage post-crash.”
- **2:45–3:00**: Footer: “Powered by Google Cloud ADK | #adkhackathon 2025.”

### Demo Text
- **Dropdown**: "Select Chaos Experiment" (options: "Pod Crash", "Network Latency")
- **Buttons**: "Trigger Chaos Experiment", "Collect Metrics", "Generate Report"
- **Status**: "Ready to trigger chaos!" → "Success! Pod Crash applied at 2025-06-24T04:53:00Z."
- **Plot Title**: "Voltaros Chaos Experiment Metrics"
- **Welcome**: "Welcome to Voltaros! Test your GKE app's resilience."

## Challenges
- **Learning Curve**: Grasping chaos engineering and Chaos Toolkit took time.
- **ADK Setup**: Initial agent orchestration issues resolved with Firebase Studio.
- **Vertex AI**: Configuring Workbench for plots required trial and error.
- **Permissions**: GKE and Cloud Storage access errors delayed early testing.

## Accomplishments
- Built a functional MVP with pod crash and latency triggers.
- Integrated GKE, BigQuery, Vertex AI, and ADK seamlessly.
- Created an intuitive UI and demo-ready video.

## What We Learned
- Chaos engineering strengthens cloud resilience.
- Deepened skills in GKE, BigQuery, and Vertex AI.
- Mastered ADK multi-agent workflows and Vercel deployment.

## What's Next for Voltaros
- Add disk failure and resource exhaustion triggers.
- Implement Vertex AI anomaly detection on metrics.
- Introduce user authentication and multi-cluster support.
- Release as open-source on GitHub.

## Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit changes: `git commit -m "Add feature"`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License
MIT License - See [LICENSE](LICENSE) for details.

## Acknowledgments
- Google Cloud ADK Team for the Starter Pack.
- Chaos Toolkit community for open-source tools.
- Hackathon organizers for the #adkhackathon 2025 opportunity.

