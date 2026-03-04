pipeline {
  agent any
  environment {
    AWS_REGION = 'us-east-1'
    AWS_ACCOUNT = '975050024946'
    FRONTEND_REPO = "${AWS_ACCOUNT}.dkr.ecr.us-east-1.amazonaws.com/rajav-streaming-app-frontend"
    BACKEND_REPO  = "${AWS_ACCOUNT}.dkr.ecr.us-east-1.amazonaws.com/rajav-streaming-app-backend"
  }
  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/RajaV/StreamingApp.git'
      }
    }
    stage('Build Frontend') {
      steps {
        script {
          docker.build("${FRONTEND_REPO}:latest", "./frontend")
        }
      }
    }
    stage('Build Backend') {
      steps {
        script {
          docker.build("${BACKEND_REPO}:latest", "./backend")
        }
      }
    }
    stage('Push to ECR') {
      steps {
        script {
          docker.withRegistry("https://${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com", 'ecr-creds') {
            docker.image("${FRONTEND_REPO}:latest").push()
            docker.image("${BACKEND_REPO}:latest").push()
          }
        }
      }
    }
  }
  post {
    success {
      echo '✅ Pipeline Success: Images pushed to ECR!'
    }
    failure {
      echo '❌ Pipeline Failed'
    }
  }
}
