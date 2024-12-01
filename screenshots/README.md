# Building a Secure DevOps Workflow with GitOps and Kubernetes

## Project Overview

This project aims to create a secure DevOps pipeline by leveraging GitOps principles to automate deployments to Kubernetes clusters. The workflow will include security checks, compliance audits, and secrets management to ensure that security best practices are followed throughout the application deployment lifecycle.

## Project Goals

- **Automate Deployments**: Implement a GitOps workflow to automate application deployment to Kubernetes clusters using tools like ArgoCD or Flux.
- **Provision Infrastructure**: Use Terraform to automate AWS infrastructure provisioning, including an EKS cluster.
- **Set Up EKS**: Create a Kubernetes cluster on EKS for deploying containerized applications.
- **Version Control**: Ensure that all infrastructure and application changes are tracked and managed using version control, specifically Git.
- **Secrets Management**: HashiCorp Vault will be used to securely manage secrets and sensitive data in the deployment pipeline.

## Tools Used

- **GitOps**:
  - ArgoCD : GitOps tools for continuous delivery and Kubernetes management.
- **Container Orchestration**:
  - Kubernetes: A container orchestration platform for automating deployment, scaling, and management of containerized applications.
- **Version Control**:
  - GitHub : Version control systems used to store and manage application and infrastructure code.
- **HashiCorp Vault**: 
  - A secrets management tool used to securely store and access secrets, such as API keys and passwords, in the pipeline.  
- **CI/CD**:
  - Jenkins : Continuous integration and continuous delivery tools to automate testing and deployment processes.
- **Terraform**:
  - for provisioning infrastructure (EKS)  

## Prerequisites

- **AWS Account** with access to create resources (EKS, IAM roles, VPC, etc.)
- **AWS CLI** installed and configured
- **kubectl** (Kubernetes CLI) installed
- **Terraform** installed
- **ArgoCD** or **Flux** for GitOps setup
- **Jenkins** for CI/CD pipeline
- **vault** (for secrets management)


## Getting Started

### 1. Set up Infrastructure on AWS using Terraform

We will use **Terraform** to provision the infrastructure, including the **EKS** (Elastic Kubernetes Service) cluster.
(Refer configuration files.)

Run Terraform commands to provision resources:
```bash
# Initialize Terraform
terraform init

# Apply Terraform configuration
terraform apply

```
This will create an EKS cluster and a node group in AWS.


### 2. Install ArgoCD for GitOps
ArgoCD is used to manage the continuous deployment of applications to Kubernetes clusters. It ensures that the deployed applications are always in sync with the Git repository.

Install ArgoCD on Kubernetes : 

Ensure you have access to a Kubernetes cluster. You can use a cloud provider like AWS, Azure, or Google Cloud, or set up a local Kubernetes environment using Minikube or kind (Kubernetes in Docker).

```bash
# Create a namespace for ArgoCD
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Expose ArgoCD API server for access
kubectl port-forward svc/argocd-server -n argocd 8080:443

```


### 3. Set up Version Control with GitHub
Create a GitHub repository to store your Kubernetes manifests, Terraform configuration files, and CI/CD pipeline configurations.

- Push your Terraform files, Kubernetes deployment manifests, and ArgoCD configuration files to this repository.
- ArgoCD will monitor this repository and automatically deploy changes to your EKS cluster.


### 4. Configure Jenkins for CI/CD
Jenkins will automate the building, testing, and deployment of your applications.
(Refer Jenkins Pipeline Configuration file)


### 5. GitOps Deployment
Once ArgoCD is set up, it will automatically sync your Git repository with the Kubernetes cluster. Whenever you push changes to your GitHub repository (for example, Kubernetes manifests or application updates), ArgoCD will automatically deploy those changes to the EKS cluster.

Steps to trigger GitOps deployment:
Create an application in ArgoCD:

```bash
argocd app create my-app \
  --repo https://github.com/your-username/your-repository.git \
  --path k8s/ \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace default

```

To sync an application in ArgoCD after you've created it, you can use the following command:
Sync Command for ArgoCD

```bash
argocd app sync my-app

```
**Explanation:**
argocd app sync my-app: This command tells ArgoCD to sync the my-app application with the Git repository. It pulls the latest changes from the repository (Kubernetes manifests, application configurations, etc.) and applies them to the Kubernetes cluster.


### 6. Set up Secrets Management:
Install and configure HashiCorp Vault on your Kubernetes cluster.
Store secrets (e.g., API keys, database credentials) securely in Vault.
Integrate Vault into the CI/CD pipeline to retrieve secrets during deployment securely.

```bash
helm repo add hashicorp https://helm.releases.hashicorp.com   # Add the HashiCorp Helm repository:
helm repo update

kubectl create namespace vault    # Create a namespace for Vault:
kubectl get pods -n vault   # kubectl get pods -n vault

kubectl exec -n vault -it vault-0 -- vault operator init    # nitialize Vault (for production mode): This will return a series of unseal keys and the root token.
kubectl exec -n vault -it vault-0 -- vault operator unseal <unseal-key>   # Unseal Vault : Use the unseal keys to unseal Vault.

kubectl apply -f secret.yaml    # Create and apply secret.yaml file
kubectl exec -n vault -it vault-0 -- vault kv get secret/my-secret    # Verify secret storage

```
Access Secrets from Vault : 
To access secrets stored in Vault, you need to authenticate and retrieve the secrets programmatically or using kubectl.

```bash
kubectl exec -n vault -it vault-0 -- vault auth enable kubernetes   # Enable Kubernetes authentication in Vault

kubectl exec -n vault -it vault-0 -- vault write auth/kubernetes/config \   # Create a Kubernetes authentication role for Vault 
  kubeconfig=/etc/kubernetes/admin.conf

kubectl exec -n vault -it vault-0 -- vault write auth/kubernetes/role/my-role \   # Create a Vault role for accessing secrets
  bound_service_account_names=vault-sa \
  bound_service_account_namespaces=vault \
  policies=my-policy \
  ttl=1h

kubectl exec -n vault -it vault-0 -- vault kv get secret/my-secret    # After authenticating, you can fetch secrets from Vault using the vault CLI or API.

helm install vault hashicorp/vault --namespace vault -f values.yaml   # Install Vault with custom values.yaml

kubectl port-forward -n vault svc/vault 8200:8200   # Once Vault is installed with the UI, port-forward the Vault service
# Now you can access the Vault UI at http://localhost:8200

```
Check the Vault configuration and ensure that the correct access policies are in place.
Ensure that Vault authentication tokens are correctly set up in the CI/CD pipeline.


## Conclusion : 
This project sets up a secure and automated DevOps workflow using GitOps, Terraform, ArgoCD, AWS EKS, Jenkins, and HashiCorp Vault. By following this workflow, you ensure that all infrastructure and application changes are tracked, managed, and securely deployed with minimal manual intervention.


### Explanation of Changes:
1. **Terraform**: The **EKS** infrastructure is provisioned using Terraform, with example `main.tf` configuration for creating VPC, subnets, and EKS clusters.
2. **GitOps with ArgoCD**: Automates deployment by syncing the Git repository with the Kubernetes cluster.
3. **Jenkins**: CI/CD pipeline is configured for building, testing, and deploying applications to Kubernetes.
4. **HashiCorp Vault**: Stores sensitive information and secrets securely.
