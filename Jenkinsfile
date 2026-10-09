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
                docker build -t frontend ./frontend
                docker tag frontend:latest $ECR_REGISTRY/frontend:latest
                docker push $ECR_REGISTRY/frontend:latest
                """
            }
        }

        stage('Build & Push Backend Services') {
    steps {
        script {
            def services = ['authService', 'chatService', 'adminService', 'streamingService']
            for (svc in services) {
                sh """
                docker build -t $svc ./backend/$svc
                docker tag $svc:latest $ECR_REGISTRY/$svc:latest
                docker push $ECR_REGISTRY/$svc:latest
                """
            }
        }
    }
}

