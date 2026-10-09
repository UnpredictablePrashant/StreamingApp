pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = "934822760684"
        AWS_REGION = "us-east-1"
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Login to ECR') {
            steps {
                script {
                    sh """
                    aws ecr get-login-password --region $AWS_REGION \
                    | docker login --username AWS --password-stdin $ECR_REGISTRY
                    """
                }
            }
        }

        stage('Build & Push Images') {
            parallel {
                stage('Auth Service') {
                    steps {
                        sh """
                        docker build -t auth-service ./backend/authService
                        docker tag auth-service:latest $ECR_REGISTRY/auth-service:latest
                        docker push $ECR_REGISTRY/auth-service:latest
                        """
                    }
                }
                stage('Chat Service') {
                    steps {
                        sh """
                        docker build -t chat-service ./backend/chatService
                        docker tag chat-service:latest $ECR_REGISTRY/chat-service:latest
                        docker push $ECR_REGISTRY/chat-service:latest
                        """
                    }
                }
                stage('Admin Service') {
                    steps {
                        sh """
                        docker build -t admin-service ./backend/adminService
                        docker tag admin-service:latest $ECR_REGISTRY/admin-service:latest
                        docker push $ECR_REGISTRY/admin-service:latest
                        """
                    }
                }
                stage('Streaming Service') {
                    steps {
                        sh """
                        docker build -t streaming-service ./backend/streamingService
                        docker tag streaming-service:latest $ECR_REGISTRY/streaming-service:latest
                        docker push $ECR_REGISTRY/streaming-service:latest
                        """
                    }
                }
                stage('Frontend') {
                    steps {
                        sh """
                        docker build -t streaming-frontend ./frontend
                        docker tag streaming-frontend:latest $ECR_REGISTRY/streaming-frontend:latest
                        docker push $ECR_REGISTRY/streaming-frontend:latest
                        """
                    }
                }
            }
        }
    }
}

