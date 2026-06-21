pipeline {
  agent any
  environment {
    AWS_ACCOUNT_ID = '640928554403'
    AWS_REGION     = 'us-east-1'
    ECR_BASE       = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
  }
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('ECR Login') {
      steps {
        withCredentials([
          string(credentialsId: 'ANKIT_AWS_ACCESS_KEY_ID', variable: 'AWS_KEY'),
          string(credentialsId: 'ANKIT_AWS_ACCESS_KEY', variable: 'AWS_SECRET')
        ]) {
          sh '''
            export AWS_ACCESS_KEY_ID=$AWS_KEY
            export AWS_SECRET_ACCESS_KEY=$AWS_SECRET
            export AWS_DEFAULT_REGION=$AWS_REGION
            aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_BASE
          '''
        }
      }
    }
    stage('Build & Push') {
      steps {
        withCredentials([
          string(credentialsId: 'ANKIT_AWS_ACCESS_KEY_ID', variable: 'AWS_KEY'),
          string(credentialsId: 'ANKIT_AWS_ACCESS_KEY', variable: 'AWS_SECRET')
        ]) {
          sh '''
            export AWS_ACCESS_KEY_ID=$AWS_KEY
            export AWS_SECRET_ACCESS_KEY=$AWS_SECRET
            export AWS_DEFAULT_REGION=$AWS_REGION

            aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_BASE

            docker build -t $ECR_BASE/streamingapp-frontend:$BUILD_NUMBER ./frontend
            docker push $ECR_BASE/streamingapp-frontend:$BUILD_NUMBER

            docker build -t $ECR_BASE/streamingapp-auth:$BUILD_NUMBER ./backend/authService
            docker push $ECR_BASE/streamingapp-auth:$BUILD_NUMBER

            docker build -t $ECR_BASE/streamingapp-streaming:$BUILD_NUMBER -f ./backend/streamingService/Dockerfile ./backend
            docker push $ECR_BASE/streamingapp-streaming:$BUILD_NUMBER

            docker build -t $ECR_BASE/streamingapp-admin:$BUILD_NUMBER -f ./backend/adminService/Dockerfile ./backend
            docker push $ECR_BASE/streamingapp-admin:$BUILD_NUMBER

            docker build -t $ECR_BASE/streamingapp-chat:$BUILD_NUMBER -f ./backend/chatService/Dockerfile ./backend
            docker push $ECR_BASE/streamingapp-chat:$BUILD_NUMBER
          '''
        }
      }
    }
  }
  post {
    success { echo 'All images pushed to ECR!' }
    failure { echo 'Build failed!' }
  }
}

