pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-northeast-2'
        // ECR_REPO_NAME = 'ravicapstm'
        // DOCKER_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        // DOCKER_CREDENTIALS = credentials('aws-ecr-credentials') // AWS credentials ID in Jenkins
        ECR_PUBLIC_REPOSITORY = 'public.ecr.aws/f8g8h5d4/ravicapstm'
        AWS_CREDENTIALS = credentials('aws_credentials') // AWS credentials for CLI access
        IMAGE_TAG = "${env.BUILD_ID}" // Use Jenkins build ID as tag
        // DOCKER_REGISTRY = 'ravikishans'
        // DOCKER_CREDENTIALS = credentials('ravikishans')

        BACKEND_AUTH_NAMESPACE = 'beauth'
        BACKEND_STREAM_NAMESPACE = 'bestream'
        FRONTEND_NAMESPACE = 'frontend'
        DATABASE_NAMESPACE = 'db'


        HELM_RELEASE_NAME = "streamingapp"  
        HELM_CHART_PATH = './k8s/streamingapp'
    }

    stages {

        stage ('checkout code') {
            steps {
                script {
                    git branch: 'main' , url: 'https://github.com/Ravikishans/StreamingApp.git'
                }
            }
        }
        stage("ls") {
            steps {
                script {
                    sh """
                    ls -al
                    """
                }
            }
        }

        stage ("add .env in backend auth") {
            steps {
                script {
                    sh """
                    echo "PORT=3001
                    MONGO_URL="mongodb://root:example@mongo-svc.db.svc.cluster.local:27017/admin"
                    AWS_REGION='ap-northeast-2'" > ./backend/authService/.env

                    ls -al ./backend/authService
                    """
                }
            }
        }

        stage ("add .env in backend streaming") {
            steps {
                script {
                    sh """
                    echo "PORT=3002
                    MONGO_URL="mongodb://root:example@mongo-svc.db.svc.cluster.local:27017/admin"
                    AWS_REGION='ap-northeast-2'" > ./backend/streamingService/.env

                    ls -al ./backend/streamingService
                    """
                }
            }
        }

        // stage("add .env in frontend") {
        //     steps {
        //         script {
        //             sh """
        //             echo BACKEND_URL = "http://localhost:3002" > ./frontend/.env

        //             ls -al ./frontend
        //             """
        //         }
        //     }
        // }
            

        stage('build and push docker images') {
            steps {
                script {
                    sh """
                        docker compose build
                    """    
                }
            }
        }
        stage ('push image to ECR') {
            steps {
                script {
                    sh """
                        # Authenticate to AWS ECR Public
                        aws ecr-public get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_PUBLIC_REPOSITORY}

                        # Push Docker images to the public ECR repository
                        docker compose push
                    """    
                }
            }
        }

        stage ('deploy to kubernates using helm') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'kubeconfig-credentials', variable: 'KUBECONFIG')])
                        sh """
                            helm upgrade --install ${HELM_RELEASE_NAME} ${HELM_CHART_PATH} --namespace default --create-namespace --kubeconfig=$KUBECONFIG --debug
                        """    
                }
            }
        }

        stage('verify deployment') {
            steps {
                script{
                    withCredentials([file(credentialsId: 'kubeconfig-credentials', variable: 'KUBECONFIG')])
                        sh "kubectl get pods -n ${BACKEND_NAMESPACE} --kubeconfig=$KUBECONFIG"
                        sh "kubectl get pods -n ${FRONTEND_NAMESPACE} --kubeconfig=$KUBECONFIG"
                        sh "kubectl get pods -n ${DATABASE_NAMESPACE} --kubeconfig=$KUBECONFIG"
                }
            }
        }
    }
    post {
        success {
            echo "Pipeline executed successfully!"
        }
        failure {
            echo "Pipeline failed"
        }
    }
}
