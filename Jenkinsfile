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
            aws ecr get-login-password --region us-east-1 \
            | docker login --username AWS --password-stdin 934822760684.dkr.ecr.us-east-1.amazonaws.com
            """
                    
                }
            }
        }

        stage('Build & Push Frontend') {
            steps {
                sh """
                docker build -t streaming-frontend ./frontend
                docker tag streaming-frontend:latest $ECR_REGISTRY/streaming-frontend:latest
                docker push $ECR_REGISTRY/streaming-frontend:latest
                """
            }
        }

        stage('Build & Push Backend') {
            steps {
                sh """
                docker build -t streaming-backend ./backend
                docker tag streaming-backend:latest $ECR_REGISTRY/streaming-backend:latest
                docker push $ECR_REGISTRY/streaming-backend:latest
                """
            }
        }
    }
}
