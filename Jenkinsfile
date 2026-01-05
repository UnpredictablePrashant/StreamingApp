pipeline {
    agent any

    environment {
        AWS_REGION = "eu-west-2"
        ACCOUNT_ID = "975050024946"
        ECR_BACKEND = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/streaming-backend"
        ECR_FRONTEND = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/streaming-frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('ECR Login') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding',
                                credentialsId: 'aws-ecr-eu-west-2']]) {
                    sh '''
                    export AWS_DEFAULT_REGION=eu-west-2
                    aws sts get-caller-identity
                    aws ecr get-login-password \
                    | docker login --username AWS --password-stdin \
                    975050024946.dkr.ecr.eu-west-2.amazonaws.com
                    '''
                }
            }
        }


        stage('Build Backend Image') {
            steps {
                sh '''
                docker build -t streaming-backend:${BUILD_NUMBER} backend
                docker tag streaming-backend:${BUILD_NUMBER} $ECR_BACKEND:${BUILD_NUMBER}
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                docker build -t streaming-frontend:${BUILD_NUMBER} frontend
                docker tag streaming-frontend:${BUILD_NUMBER} $ECR_FRONTEND:${BUILD_NUMBER}
                '''
            }
        }

        stage('Push Images to ECR') {
            steps {
                sh '''
                docker push $ECR_BACKEND:${BUILD_NUMBER}
                docker push $ECR_FRONTEND:${BUILD_NUMBER}
                '''
            }
        }
    }

    post {
        success {
            echo "Docker images successfully built and pushed to ECR (eu-west-2)"
        }
        failure {
            echo "Pipeline failed"
        }
    }
}
