# StreamingApp – MERN Application Deployment on AWS using Jenkins, Docker, Amazon ECR, Amazon EKS, Helm & CloudWatch

## Project Overview

This project demonstrates the deployment of a containerized MERN (MongoDB, Express.js, React.js, Node.js) Streaming Application on AWS using modern DevOps practices.

The application consists of multiple microservices that are containerized using Docker, stored in Amazon Elastic Container Registry (ECR), deployed to Amazon Elastic Kubernetes Service (EKS) using Helm, and monitored using Amazon CloudWatch.

---

## Project Objectives

* Containerize the MERN application using Docker.
* Implement Continuous Integration (CI) using Jenkins.
* Store Docker images in Amazon Elastic Container Registry (ECR).
* Deploy the application on Amazon Elastic Kubernetes Service (EKS).
* Manage Kubernetes deployments using Helm.
* Monitor workloads using Amazon CloudWatch.
* Demonstrate orchestration and scaling concepts using Kubernetes.

---

## Technology Stack

| Technology        | Purpose                    |
| ----------------- | -------------------------- |
| React.js          | Frontend                   |
| Node.js           | Backend Services           |
| Express.js        | REST APIs                  |
| MongoDB           | Database                   |
| Docker            | Containerization           |
| Jenkins           | Continuous Integration     |
| Amazon EC2        | Jenkins Server             |
| Amazon ECR        | Docker Image Registry      |
| Amazon EKS        | Kubernetes Cluster         |
| Helm              | Kubernetes Package Manager |
| Amazon CloudWatch | Monitoring & Logging       |
| Git & GitHub      | Version Control            |

---

## Project Structure

```text
StreamingApp
│
├── backend
│   ├── authService
│   ├── streamingService
│   ├── adminService
│   └── chatService
│
├── frontend
│
├── helm
│   └── streamingapp
│
├── docker-compose.yml
├── Jenkinsfile
└── README.md
```

---

## Application Architecture

```text
                GitHub Repository
                       │
                       ▼
                 Jenkins Pipeline
                       │
                       ▼
                Docker Image Build
                       │
                       ▼
               Amazon Elastic Container Registry
                       │
                       ▼
                Amazon EKS Cluster
                       │
                Kubernetes Pods
                       │
                       ▼
                  MERN Application
                       │
                       ▼
             Amazon CloudWatch Monitoring
```

---

## Docker Containerization

Dockerfiles were created for:

* Frontend
* Authentication Service
* Streaming Service
* Admin Service
* Chat Service

Each component was built as an independent Docker image.

Example:

```bash
docker build -t streaming-frontend ./frontend
docker build -t streaming-auth ./backend/authService
```

---

## Amazon Elastic Container Registry (ECR)

Separate repositories were created for each service.

Repositories:

* streaming-frontend
* streaming-auth
* streaming-service
* streaming-admin
* streaming-chat

Images were tagged and pushed to Amazon ECR.

Example:

```bash
docker tag streaming-frontend:latest <account-id>.dkr.ecr.ap-south-1.amazonaws.com/streaming-frontend:latest

docker push <account-id>.dkr.ecr.ap-south-1.amazonaws.com/streaming-frontend:latest
```

---

## Jenkins Continuous Integration

A Jenkins server was deployed on an Amazon EC2 instance.

The Jenkins pipeline performs:

1. Source code checkout
2. Docker image build
3. Docker image tagging
4. Authentication with Amazon ECR
5. Push images to Amazon ECR

GitHub Webhooks can be configured to trigger builds automatically on code commits.

---

## Amazon EKS Deployment

An Amazon EKS cluster was created to orchestrate the application containers.

The cluster consists of managed worker nodes that run Kubernetes workloads.

Verification commands:

```bash
kubectl get nodes
kubectl get pods
kubectl get services
```

---

## Helm Deployment

Helm was used to package and deploy Kubernetes resources.

Installation command:

```bash
helm install streamingapp ./helm/streamingapp
```

Verify deployment:

```bash
helm list
kubectl get all
```

---

## Monitoring using Amazon CloudWatch

Amazon CloudWatch Observability Add-on was installed on the EKS cluster.

Features:

* Container Monitoring
* Kubernetes Metrics
* Pod Monitoring
* Cluster Monitoring
* Centralized Logging using Fluent Bit

Verification:

```bash
kubectl get pods -n amazon-cloudwatch
```

---

## CI/CD Workflow

```text
Developer
     │
     ▼
GitHub Repository
     │
     ▼
Jenkins Pipeline
     │
     ▼
Docker Image Build
     │
     ▼
Amazon ECR
     │
     ▼
Amazon EKS
     │
     ▼
Helm Deployment
     │
     ▼
CloudWatch Monitoring
```

---

## Deployment Steps

1. Fork the project repository.
2. Build Docker images.
3. Push images to Amazon ECR.
4. Configure Jenkins Pipeline.
5. Create Amazon EKS Cluster.
6. Configure kubectl.
7. Install Helm.
8. Deploy the application using Helm.
9. Enable Amazon CloudWatch Observability.
10. Verify application deployment.

---

## Validation Commands

```bash
docker images

aws ecr describe-repositories

aws eks list-clusters

kubectl get nodes

kubectl get pods -A

kubectl get svc

helm list
```

---

## Screenshots

The repository includes screenshots demonstrating:

* GitHub Repository
* Docker Image Build
* Jenkins Pipeline
* Amazon ECR Repositories
* Amazon EC2 Instance
* Amazon EKS Cluster
* Kubernetes Pods
* Helm Deployment
* Amazon CloudWatch Observability

---

## Learning Outcomes

This project demonstrates practical implementation of:

* Git Version Control
* Docker Containerization
* CI using Jenkins
* Image Management using Amazon ECR
* Kubernetes Orchestration
* Helm Package Management
* Cloud Monitoring using Amazon CloudWatch
* AWS Infrastructure Deployment

---

## Future Enhancements

* Horizontal Pod Autoscaler (HPA)
* Kubernetes Ingress Controller
* SSL/TLS using AWS Certificate Manager
* Blue-Green Deployment
* GitOps using ArgoCD
* Prometheus & Grafana Monitoring
* Automated CD Pipeline

---

## Conclusion

This project successfully demonstrates the end-to-end deployment of a containerized MERN application using modern DevOps practices. The solution integrates Docker, Jenkins, Amazon ECR, Amazon EKS, Helm, and Amazon CloudWatch to provide a scalable, maintainable, and cloud-native deployment workflow suitable for production-oriented environments.
