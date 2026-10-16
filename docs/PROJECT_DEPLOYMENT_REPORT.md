# StreamingApp - Orchestration and Scaling Project

## 1. Project Overview

StreamingApp is a MERN-based application deployed to Amazon
Elastic Kubernetes Service (Amazon EKS). The application uses
containerized microservices, Amazon ECR, Helm, and Kubernetes
Horizontal Pod Autoscalers.

## 2. AWS Environment

- AWS Region: us-east-1
- EKS Cluster: streaming-eks
- Deployment method: Helm
- Container registry: Amazon ECR
- Application entry point:
  http://k8s-default-frontend-32e4dd7827-c78857df21a0ce50.elb.us-east-1.amazonaws.com

## 3. Application Architecture

| Component | Kubernetes deployment | Port |
|---|---|---:|
| Frontend | frontend | 80 |
| Authentication | auth | 3001 |
| Streaming | streaming | 3002 |
| Administration | admin | 3003 |
| Real-time chat | chat | 3004 |
| MongoDB | mongo | 27017 |

The frontend is exposed through a Kubernetes LoadBalancer service.
Backend services and MongoDB use ClusterIP services.

## 4. Container Images and CI/CD

The Jenkins pipeline contains stages for:
- Checking out the source repository
- Authenticating to Amazon ECR
- Building the frontend image
- Building the authentication service image
- Building the chat service image
- Building the administration service image
- Building the streaming service image
- Pushing service images to Amazon ECR

The Jenkinsfile's automatic trigger configuration and a complete
end-to-end Jenkins build should be verified separately.

## 5. Kubernetes Deployment

The Helm release is named streamingapp in the default namespace.

The latest verification showed:
- Frontend: 2 of 2 replicas ready
- Authentication: 2 of 2 replicas ready
- Streaming: 2 of 2 replicas ready
- Administration: 2 of 2 replicas ready
- Chat: 2 of 2 replicas ready
- MongoDB: 1 of 1 replica ready

MongoDB uses a bound 10 GiB persistent volume claim with the
mongo-gp3 storage class.

## 6. Horizontal Pod Autoscaling

Five HPAs are currently present:

| Deployment | Minimum replicas | Maximum replicas | CPU target |
|---|---:|---:|---:|
| frontend | 2 | 5 | 70% |
| auth | 2 | 4 | 70% |
| streaming | 2 | 4 | 70% |
| admin | 2 | 4 | 70% |
| chat | 2 | 4 | 70% |

At the time of verification, each HPA had two replicas.
The HPA definitions currently need to be persisted in the Helm
chart for reproducible deployments.

## 7. Monitoring

The Amazon CloudWatch Observability EKS add-on was verified as ACTIVE.

CPU alarms were attempted for both worker nodes, but the AWS CLI
returned an error. Alarm creation therefore remains unverified.
CloudWatch application log delivery also remains to be verified.

## 8. Validation Evidence

The following commands were used to inspect the deployment:

    kubectl get deployments,services,pvc
    kubectl get hpa
    helm list -n default
    aws eks describe-addon --cluster-name streaming-eks \
      --addon-name amazon-cloudwatch-observability \
      --region us-east-1 --query 'addon.status' --output text

The captured deployment output showed all six application
deployments ready, the MongoDB PVC bound, five HPAs available,
the Helm release deployed, and the CloudWatch add-on active.

## 9. Remaining Verification

- Verify Jenkins build execution and automatic triggers.
- Persist autoscaling configuration in Helm.
- Verify CloudWatch alarms and log delivery.
- Perform frontend and backend smoke tests.
- Commit and push project documentation and approved source changes.
- Capture final screenshots for the course submission.

## 10. Security

Credentials, access keys, JWT secrets, and personal access tokens
must not be committed to the repository. Use appropriate secret
management and rotate any credential that has been exposed.
