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
                withCredentials([usernamePassword(credentialsId: 'streamflix-aws-deploy',
                                                 usernameVariable: 'AWS_ACCESS_KEY_ID',
                                                 passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh """
                    aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
                    aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
                    aws configure set default.region $AWS_REGION

                    aws ecr get-login-password --region $AWS_REGION \
                    | docker login --username AWS --password-stdin $ECR_REGISTRY
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
