pipeline {
  agent any
  environment {
    AWS_REGION = 'us-east-1'
    AWS_ACCOUNT = '975050024946'
    FRONTEND_REPO = "975050024946.dkr.ecr.us-east-1.amazonaws.com/rajav-streaming-app-frontend:latest"
    BACKEND_REPO  = "975050024946.dkr.ecr.us-east-1.amazonaws.com/rajav-streaming-app-backend:latest"
  }
  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', 
            url: 'https://github.com/tnraja/RajaV_StreamingApp.git',  // YOUR FORK
            credentialsId: 'github-pat'  // ADD THIS
      }
    }
    // ... rest unchanged
  }
}
