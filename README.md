
🚀 StreamingApp -- Orchestration and Scaling of a MERN Application
==================================================================

📌 Project Overview
-------------------

This project demonstrates **end-to-end orchestration, containerization, CI/CD automation, monitoring, and scaling** of a **MERN (MongoDB, Express, React, Node.js) application** using modern **DevOps and Cloud-Native practices**.

The application is containerized with Docker, automated using Jenkins CI pipelines, deployed on **Amazon EKS**, managed via **Helm**, and monitored using Kubernetes-native tooling.

---

🧰 Tech Stack
-------------

| Category           | Tools / Services               |
| ------------------ | ------------------------------ |
| Version Control    | Git, GitHub                    |
| Containerization   | Docker                         |
| CI/CD              | Jenkins                        |
| Container Registry | Amazon ECR                     |
| Orchestration      | Amazon EKS                     |
| Package Manager    | Helm                           |
| Monitoring         | Kubernetes Metrics Server, HPA |
| Logging            | kubectl logs                   |
| Cloud              | AWS (eu-west-2)                |

---

🗂️ Repository Structure
-------------------------

`. ├── backend/                  # Node.js backend service │   ├── Dockerfile │   ├── index.js │   └── package.json │ ├── frontend/                 # React frontend │   ├── Dockerfile │   └── nginx.conf │ ├── helm/ │   └── streamingapp/ │       ├── Chart.yaml │       ├── values.yaml │       └── templates/ │           ├── backend-deployment.yaml │           ├── backend-service.yaml │           ├── frontend-deployment.yaml │           └── frontend-service.yaml │ ├── Jenkinsfile               # CI pipeline └── README.md`

---

🔄 Project Workflow
-------------------

### 1️⃣ Version Control

- Forked the original repository
- Maintained a `dev` branch
- Synced upstream changes when required

---

### 2️⃣ Containerization

- **Backend**: Node.js service containerized using `node:18-alpine`
- **Frontend**: React app built and served via `nginx` using multi-stage Docker builds
- Images tested locally before cloud deployment

---

### 3️⃣ AWS Setup

- AWS CLI configured
- Region standardized to **`eu-west-2`**
- Amazon ECR repositories created for frontend and backend

---

### 4️⃣ CI/CD with Jenkins

- Jenkins installed and configured
- Pipeline stages:

  - Git checkout
  - Docker build
  - ECR authentication
  - Docker image push
- Jenkinsfile committed to repository
- Successful green pipeline execution

---

### 5️⃣ Kubernetes Deployment (EKS)

- EKS cluster created using `eksctl`
- Managed node group with auto-scaling capability
- `kubectl` configured automatically

---

### 6️⃣ Helm-Based Deployment

- Helm chart created for application
- Separate Kubernetes Deployments and Services for frontend and backend
- Frontend exposed using **LoadBalancer**
- Backend exposed using **ClusterIP**

---

### 7️⃣ Monitoring & Scaling

- **metrics-server** enabled
- Resource metrics verified using:

  `kubectl top nodes kubectl top pods`
- **Horizontal Pod Autoscaler (HPA)** configured for backend:

  `kubectl autoscale deployment streaming-backend --cpu-percent=50 --min=2 --max=5`
- Manual scaling validated using:

  `kubectl scale deployment streaming-backend --replicas=4`

---

### 8️⃣ Logging

- Application logs accessed using:

  `kubectl logs deployment/streaming-backend kubectl logs deployment/streaming-frontend`
- Logging strategy documented for production readiness

---

🌐 Application Access
---------------------

- Frontend exposed via AWS LoadBalancer
- External URL obtained using:

  `kubectl get svc streaming-frontend`
- Application accessible via browser

---

📸 Evidence & Validation
------------------------

The following were captured for validation and submission:

- Jenkins pipeline success
- EKS node readiness
- Running pods and services
- Application UI access
- Metrics and HPA output

---

🧠 Key Learnings
----------------

- Practical CI/CD pipeline implementation
- Cloud-native deployment using Kubernetes
- Helm chart structuring and troubleshooting
- Debugging real-world DevOps issues
- Monitoring and scaling containerized workloads

---

✅ Project Status
-----------------

✔ Fully deployed
✔ Scalable
✔ Monitored
✔ CI/CD automated
✔ Ready for submission

---

📎 Submission
-------------

**GitHub Repository:**
👉 [https://github.com/JoinDeeHub/StreamingApp_Orchestration-and-Scaling-of-a-MERN-Application](https://github.com/JoinDeeHub/StreamingApp_Orchestration-and-Scaling-of-a-MERN-Application)

---

### 🏆 Final Note

This project demonstrates a **complete DevOps lifecycle** --- from source code to scalable production deployment --- following industry best practices.
