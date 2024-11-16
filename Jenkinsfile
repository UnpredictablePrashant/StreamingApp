pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-northeast-2'
        ECR_REPO_PREFIX = 'public.ecr.aws/f8g8h5d4/ravicapstm' // Replace with your public ECR repository
        IMAGE_TAG = "${env.BUILD_ID}" // Tag images with the Jenkins build ID
        DOCKER_CREDENTIALS = credentials('ravikishans')
        EKS_CLUSTER_NAME = ravi-caps

        HELM_RELEASE_NAME = "streamingapp"
        HELM_CHART_PATH = './k8s/streamingapp' // Path to Helm chart
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Ravikishans/StreamingApp.git'
            }
        }

        stage("Configure Environment Files for Backend Services") {
            steps {
                sh """
                    echo "MONGO_URI=mongodb://root:example@mongo-svc.db.svc.cluster.local:27017/admin
                    PORT=3001
                    AWS_REGION=${AWS_REGION}
                    AWS_S3_BUCKET=rakshi2502" > ./backend/authService/.env

                    echo "MONGO_URI=mongodb://root:example@mongo-svc.db.svc.cluster.local:27017/admin
                    PORT=3002
                    AWS_REGION=${AWS_REGION}
                    AWS_S3_BUCKET=rakshi2502" > ./backend/streamingService/.env
                """
            }
        }

        stage('Build and Push Docker Images') {
            steps {
                script {
                    withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding',credentialsId: 'aws_credentials' // Update with your actual AWS credentials ID in Jenkins
                    ]]) {
                        sh """
                        # Authenticate Docker to ECR public
                        aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/f8g8h5d4

                        # Build Docker images
                        docker compose build

                        
                    """
                    }
                }
            }
        }

        stage('push & tag images') {
            steps {
                script{ 
                    withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding',credentialsId: 'aws_credentials'
                    ]]) {
                        sh """
                        # Tag images for ECR
                        docker tag ravikishans/streamingapp:frontend ${ECR_REPO_PREFIX}:frontend
                        docker tag ravikishans/streamingapp:backend_auth ${ECR_REPO_PREFIX}:backend_auth
                        docker tag ravikishans/streamingapp:backend_stream ${ECR_REPO_PREFIX}:backend_stream

                        # Push images to ECR
                        docker push ${ECR_REPO_PREFIX}:frontend
                        docker push ${ECR_REPO_PREFIX}:backend_auth
                        docker push ${ECR_REPO_PREFIX}:backend_stream
                        """
                    }
                }
            }
        }

        stage('Update Helm Chart with ECR Image Tags') {
            steps {
                script {
                    sh """
                        sed -i "s|frontend-image-tag|${ECR_REPO_PREFIX}:frontend|g" ${HELM_CHART_PATH}/values.yaml
                        sed -i "s|backend-auth-image-tag|${ECR_REPO_PREFIX}:backend_auth|g" ${HELM_CHART_PATH}/values.yaml
                        sed -i "s|backend-stream-image-tag|${ECR_REPO_PREFIX}:backend_stream|g" ${HELM_CHART_PATH}/values.yaml
                    """
                }
            }
        }


        stage('Deploy to EKS Using Helm') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig-credentials', variable: 'KUBECONFIG')]) {
                    sh """
                        aws eks --region ${AWS_REGION} update-kubeconfig --name ${EKS_CLUSTER_NAME}
                        helm upgrade --install ${HELM_RELEASE_NAME} ${HELM_CHART_PATH} \
                        --namespace default --create-namespace --kubeconfig=$KUBECONFIG --debug
                    """
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig-credentials', variable: 'KUBECONFIG')]) {
                    sh "kubectl get pods -n db --kubeconfig=$KUBECONFIG"
                    sh "kubectl get pods -n beauth --kubeconfig=$KUBECONFIG"
                    sh "kubectl get pods -n bestream --kubeconfig=$KUBECONFIG"
                    sh "kubectl get pods -n frontend --kubeconfig=$KUBECONFIG"
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
