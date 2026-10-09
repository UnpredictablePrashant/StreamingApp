pipeline {
    agent any

    environment {
        AWS_REGION     = "us-east-1"
        AWS_ACCOUNT_ID = "934822760684"
        ECR_REGISTRY   = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Login to ECR') {
            steps {
                withAWS(credentials: 'hero-hitesh-aws', region: 'us-east-1') {
                    sh """
                    aws ecr get-login-password --region $AWS_REGION \
                    | docker login --username AWS --password-stdin $ECR_REGISTRY
                    """
                }
            }
        }

        stage('Build & Push Frontend') {
            steps {
                sh """
                docker build -t frontend ./frontend
                docker tag frontend:latest $ECR_REGISTRY/frontend:latest
                docker push $ECR_REGISTRY/frontend:latest
                """
            }
        }

        stage('Build & Push Backend Services') {
            steps {
                script {
                    def services = [
                        ['name': 'auth-service', 'path': 'backend/authService'],
                        ['name': 'chat-service', 'path': 'backend/chatService'],
                        ['name': 'admin-service', 'path': 'backend/adminService'],
                        ['name': 'streaming-service', 'path': 'backend/streamingService']
                    ]
                    for (svc in services) {
                        sh """
                        docker build -t ${svc.name} ./${svc.path}
                        docker tag ${svc.name}:latest $ECR_REGISTRY/${svc.name}:latest
                        docker push $ECR_REGISTRY/${svc.name}:latest
                        """
                    }
                }
            }
        }
    } // closes stages
}   // closes pipeline
