# Orchestrated Streaming App

This project demonstrates the containerization, continuous integration, orchestration, scaling, monitoring, logging, and notification workflow for a MERN streaming application. The application consists of a React frontend, four Node.js backend services (Auth, Streaming, Admin, and Chat), and MongoDB.

The source application is included in `StreamingApp/.` Infrastructure-as-code resources are included in `helm/streamingapp/` and IAM policies in `iam/`.

# Architecture

![alt text](architecture.png)

The developer pushes source code to GitHub. Jenkins runs on an EC2 instance, builds the Docker images, pushes versioned images to ECR, and sends build notifications through SNS. EKS pulls the images from ECR. An NGINX Ingress load balancer exposes the frontend and API routes. MongoDB stores application data on EBS, while the streaming service uses an IRSA IAM role to access the private S3 bucket. Container Insights sends EKS logs and metrics to CloudWatch.

## 1. Repository Setup

- Fork `UnpredictablePrashant/SampleMERNwithMicroservices`
- Clone your fork:
  - `git clone https://github.com/anilkumarrajana/StreamingApp.git`
  - `cd Streamingapp`
- Sync with upstream:
  - `git remote add upstream https://github.com/UnpredictablePrashant/SampleMERNwithMicroservices.git`
  - `git fetch upstream`
  - `git merge upstream/main`
  - `git push origin main`
- Inspect the source project and Docker configuration
  - `docker compose config --services`
  ![alt text](docker_compose_config.png)
- Verify Docker Desktop
  - `docker info`
  - `docker compose version`
  ![alt text](docker_desktop_check.png)
- Start the MERN Application Locally
  - `docker compose up -d --build`
    ![alt text](docker_compose_up.png)
  - `docker compose ps`
    ![alt text](composeps.png)
  - `docker compose images`
    ![alt text](composeimages.png)
- Check container logs when required

    ```bash
    docker compose logs --tail=100 frontend
    docker compose logs --tail=100 auth
    docker compose logs --tail=100 streaming
    docker compose logs --tail=100 admin
    docker compose logs --tail=100 chat
    ```

- Validate Local Frontend
  - Open `http://localhost:3000` and confirm that the home page loads.
    ![alt text](frontend.png)
