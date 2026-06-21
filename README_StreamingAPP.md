cat > /home/ubuntu/StreamingApp/README.md << 'EOF'
# StreamingApp — MERN DevOps Project

**Student:** Ankit Thakkar  
**GitHub:** https://github.com/ARthakkar92/StreamingApp  
**Fork of:** https://github.com/UnpredictablePrashant/StreamingApp  

---

## Step 1: Version Control with Git

### Fork the Repository
Forked the main repository from UnpredictablePrashant into personal GitHub account.

**Commands used:**
```bash
git clone https://github.com/ARthakkar92/StreamingApp.git
cd StreamingApp
git remote add upstream https://github.com/UnpredictablePrashant/StreamingApp.git
git checkout -b dev
```

**Branch Strategy:**
- `main` — synced with upstream original repo
- `dev` — all development work done here

<img width="2180" height="920" alt="image" src="https://github.com/user-attachments/assets/0769263e-0b4f-419b-bd9f-f614ddcec46f" />

<img width="2126" height="920" alt="image" src="https://github.com/user-attachments/assets/58276885-2933-43c6-b4e7-d1363ba26591" />


### Sync with Upstream
```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
git checkout dev
git merge main
git push origin dev
```

---

## Step 2: Prepare the MERN Application

### Application Architecture
| Service | Port | Technology |
|---|---|---|
| Frontend | 80 | React.js + Nginx |
| Auth Service | 3001 | Node.js/Express |
| Streaming Service | 3002 | Node.js/Express |
| Admin Service | 3003 | Node.js/Express |
| Chat Service | 3004 | Node.js/Express |
| Database | 27017 | MongoDB |

### Dockerfiles Created
Each service has its own Dockerfile:
- `frontend/Dockerfile` — Multi-stage React build + Nginx
- `backend/authService/Dockerfile`
- `backend/streamingService/Dockerfile`
- `backend/adminService/Dockerfile`
- `backend/chatService/Dockerfile`

### Local Docker Test
```bash
docker compose up --build
docker ps
```

<img width="1966" height="380" alt="image" src="https://github.com/user-attachments/assets/63a5de5a-c11a-4c25-838e-a0e7f4402e22" />


### ECR Repositories Created
```bash
aws ecr create-repository --repository-name streamingapp-frontend --region us-east-1
aws ecr create-repository --repository-name streamingapp-auth --region us-east-1
aws ecr create-repository --repository-name streamingapp-streaming --region us-east-1
aws ecr create-repository --repository-name streamingapp-admin --region us-east-1
aws ecr create-repository --repository-name streamingapp-chat --region us-east-1
```

### Push Images to ECR
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 640928554403.dkr.ecr.us-east-1.amazonaws.com
docker push 640928554403.dkr.ecr.us-east-1.amazonaws.com/streamingapp-frontend:latest
docker push 640928554403.dkr.ecr.us-east-1.amazonaws.com/streamingapp-auth:latest
docker push 640928554403.dkr.ecr.us-east-1.amazonaws.com/streamingapp-streaming:latest
docker push 640928554403.dkr.ecr.us-east-1.amazonaws.com/streamingapp-admin:latest
docker push 640928554403.dkr.ecr.us-east-1.amazonaws.com/streamingapp-chat:latest
```

<img width="2399" height="879" alt="image" src="https://github.com/user-attachments/assets/8640dcd5-1cc6-42cc-8026-e83cde98cea2" />

<img width="1607" height="694" alt="image" src="https://github.com/user-attachments/assets/cb13cee4-845a-4819-a555-968132a38317" />


---

## Step 3: AWS Environment Setup

### AWS CLI Installation
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
aws --version
```

### AWS CLI Configuration
```bash
aws configure
# AWS Access Key ID: ***
# AWS Secret Access Key: ***
# Default region: us-east-1
# Default output format: json
```

### Verify Configuration
```bash
aws sts get-caller-identity
```

## Step 4: Continuous Integration (CI) using Jenkins

### Jenkins Setup
- Jenkins running on EC2 instance
- Plugins installed: Git, Pipeline, Docker, AWS Steps

### Jenkins Credentials Added
ANKIT_AWS_ACCESS_KEY_ID     → AWS Access Key ID
ANKIT_AWS_ACCESS_KEY        → AWS Secret Access Key
ANKIT_AWS_ACCOUNT_ID        → 640928554403

### Jenkins Pipeline — Jenkinsfile
```groovy
pipeline {
  agent any
  environment {
    AWS_ACCOUNT_ID = 'AWS_ACCOUNT_ID'
    AWS_REGION     = 'us-east-1'
    ECR_BASE       = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
  }
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('ECR Login') { ... }
    stage('Build & Push') { ... }
  }
}
```

<img width="2399" height="1061" alt="image" src="https://github.com/user-attachments/assets/4671dd5c-511a-49f8-8b14-5b7af26f10be" />
<img width="2399" height="801" alt="image" src="https://github.com/user-attachments/assets/734e1250-a009-4171-b2b2-446a5d472fdc" />

---

## Step 5: Kubernetes Deployment (EKS)

### Tools Installed
```bash
eksctl version   # 0.226.0
kubectl version  # v1.36.1
helm version     # v3.21.0
```

### EKS Cluster Creation
```bash
eksctl create cluster \
  --name streamingapp-cluster \
  --region us-east-1 \
  --nodegroup-name workers \
  --node-type t3.small \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 4 \
  --managed
```

<!-- SCREENSHOT: Add screenshot of AWS EKS console showing cluster ACTIVE -->
<!-- SCREENSHOT: Add screenshot of "eksctl get cluster" output -->

### Connect kubectl to EKS
```bash
aws eks update-kubeconfig --region us-east-1 --name streamingapp-cluster
kubectl get nodes
```

<img width="2399" height="1080" alt="image" src="https://github.com/user-attachments/assets/5d6fab34-39f7-4326-949f-876a389f3fba" />

<img width="2374" height="1071" alt="image" src="https://github.com/user-attachments/assets/4da6139c-8e18-48f5-afad-f86a99f4395c" />



### Helm Chart Structure

streamingapp-chart/
├── Chart.yaml
├── values.yaml
└── templates/
├── frontend.yaml
├── auth.yaml
├── streaming.yaml
├── admin.yaml
└── chat.yaml

### Deploy with Helm
```bash
helm install streamingapp ./streamingapp-chart
kubectl get pods
kubectl get services
```

<img width="814" height="179" alt="image" src="https://github.com/user-attachments/assets/ff6458ec-caaf-4df6-b6ee-512a412e9420" />

<img width="1444" height="164" alt="image" src="https://github.com/user-attachments/assets/e4af8ee3-1416-479a-b159-8ef7e2aa194c" />


### Frontend Access

URL: http://a2a67053da4f04a9eb9dac77ad7e09fd-2063731993.us-east-1.elb.amazonaws.com

<img width="1916" height="1003" alt="image" src="https://github.com/user-attachments/assets/5229fa28-1f51-4f21-a1fb-38c3d596181d" />

<img width="2399" height="1266" alt="image" src="https://github.com/user-attachments/assets/8383acc9-dc09-40f1-8b92-3209dade7740" />


---

## Step 6: Monitoring and Logging

### CloudWatch Log Groups Created
```bash
aws logs create-log-group --log-group-name /streamingapp/frontend --region us-east-1
aws logs create-log-group --log-group-name /streamingapp/auth --region us-east-1
aws logs create-log-group --log-group-name /streamingapp/streaming --region us-east-1
aws logs create-log-group --log-group-name /streamingapp/admin --region us-east-1
aws logs create-log-group --log-group-name /streamingapp/chat --region us-east-1
```

### CloudWatch CPU Alarm
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "StreamingApp-HighCPU" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --region us-east-1
```

<img width="1654" height="644" alt="image" src="https://github.com/user-attachments/assets/67a6f82b-15cd-4e9b-a8bc-82e17af962a2" />

<img width="1664" height="301" alt="image" src="https://github.com/user-attachments/assets/9968f583-e08f-4a24-a0f9-4cfc28e8f8a3" />


---

## Step 7: Architecture Diagram

Developer Machine
↓ git push origin dev
GitHub Repository (ARthakkar92/StreamingApp)
↓ webhook trigger
Jenkins CI/CD (jenkinsacademics.herovired.com)
↓ docker build + push
Amazon ECR (5 repositories)
us-east-1
├── streamingapp-frontend
├── streamingapp-auth
├── streamingapp-streaming
├── streamingapp-admin
└── streamingapp-chat
↓ helm upgrade
Amazon EKS Cluster (streamingapp-cluster)
├── frontend pod    → LoadBalancer → Internet
├── auth pod        → ClusterIP
├── streaming pod   → ClusterIP
├── admin pod       → ClusterIP
└── chat pod        → ClusterIP
↓
MongoDB Atlas (Cloud Database)
↓
Amazon CloudWatch (Monitoring + Alerts)

## Step 8: Final Validation

### All Pods Running
```bash
kubectl get pods
```
NAME                         READY   STATUS    RESTARTS   AGE
admin-69c4c5b7d4-r87qd       1/1     Running   0          19h
auth-5cc68cf69f-xzk7b        1/1     Running   0          19h
chat-757c87f96c-9q4t5        1/1     Running   0          19h
frontend-7f45cdcc75-59rfw    1/1     Running   0          19h
streaming-59cbd75c77-ltgfq   1/1     Running   0          19h

### Services Running
```bash
kubectl get svc
```
NAME       TYPE           CLUSTER-IP      EXTERNAL-IP                                                               PORT(S)
frontend   LoadBalancer   10.100.62.98    a2a67053da4f04a9eb9dac77ad7e09fd-2063731993.us-east-1.elb.amazonaws.com   80:32519/TCP
auth       ClusterIP      10.100.177.131  <none>                                                                    3001/TCP
streaming  ClusterIP      10.100.166.156  <none>                                                                    3002/TCP
admin      ClusterIP      10.100.38.196   <none>                                                                    3003/TCP
chat       ClusterIP      10.100.51.237   <none>                                                                    3004/TCP


---

## Repository Structure
StreamingApp/
├── backend/
│   ├── authService/        # Auth microservice (Port 3001)
│   ├── streamingService/   # Streaming microservice (Port 3002)
│   ├── adminService/       # Admin microservice (Port 3003)
│   └── chatService/        # Chat microservice (Port 3004)
├── frontend/               # React.js frontend (Port 80)
├── streamingapp-chart/     # Helm charts
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
├── docs/
│   └── screenshots/        # All proof screenshots
├── docker-compose.yml      # Local development
├── Jenkinsfile             # CI/CD pipeline
└── README.md               # This file
