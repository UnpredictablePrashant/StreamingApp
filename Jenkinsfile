pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID      = "135808938060"
        AWS_REGION          = "ap-south-1"
        IMAGE_TAG           = "v${BUILD_NUMBER}"
        ECR_BASE            = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        ECR_BACKEND         = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/dev-streaming-app-backend"
        ECR_FRONTEND        = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/dev-streaming-app-frontend"
        AWS_CREDS_ID        = 'aws-credentials'
        COMPOSE_PROJECT     = 'streamingapp'
    }

    stages {

        stage('Install Prerequisites') {
            steps {
                sh '''
                    if command -v aws > /dev/null 2>&1; then
                        echo "aws-cli already installed: $(aws --version)"
                    else
                        echo "Installing aws-cli and dependencies..."
                        if command -v apk > /dev/null 2>&1; then
                            apk add --no-cache aws-cli git curl
                        elif command -v apt-get > /dev/null 2>&1; then
                            apt-get update -y && apt-get install -y awscli git curl
                        elif command -v yum > /dev/null 2>&1; then
                            yum install -y awscli git curl
                        else
                            echo "ERROR: No supported package manager found"
                            exit 1
                        fi
                    fi
                    echo "--- Tool versions ---"
                    aws --version
                    git --version
                    docker --version
                '''
            }
        }

        stage('Verify AWS Access and Login to ECR') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: "${AWS_CREDS_ID}",
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    sh '''
                        echo "Verifying AWS credentials..."
                        aws sts get-caller-identity

                        echo "Listing ECR repositories..."
                        aws ecr describe-repositories --region $AWS_REGION || true

                        echo "Logging in to ECR..."
                        aws ecr get-login-password --region $AWS_REGION \
                            | docker login --username AWS --password-stdin $ECR_BASE

                        echo "ECR login successful."
                    '''
                }
            }
        }

        stage('Build All Services') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: "${AWS_CREDS_ID}",
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    script {
                        // Build only the services that have a Dockerfile (skip mongo)
                        sh """
                            echo "Building application services (mongo is a pulled image, not built)..."
                            docker compose -p ${COMPOSE_PROJECT} -f docker-compose.yml build \
                                auth streaming admin chat frontend

                            echo "--- Images produced ---"
                            docker images | grep ${COMPOSE_PROJECT} || true
                        """

                        // -----------------------------------------------------------------
                        // Tag backend services:
                        //   streamingapp-auth  =>  .../dev-streaming-app-backend:auth-v29
                        //   streamingapp-streaming  =>  .../dev-streaming-app-backend:streaming-v29
                        //   etc.
                        // Tag frontend service:
                        //   streamingapp-frontend  =>  .../dev-streaming-app-frontend:frontend-v29
                        // -----------------------------------------------------------------
                        def backendServices = ['auth', 'streaming', 'admin', 'chat']

                        for (String svc : backendServices) {
                            sh """
                                if docker image inspect ${COMPOSE_PROJECT}-${svc} > /dev/null 2>&1; then
                                    LOCAL_IMAGE="${COMPOSE_PROJECT}-${svc}"
                                elif docker image inspect ${COMPOSE_PROJECT}_${svc} > /dev/null 2>&1; then
                                    LOCAL_IMAGE="${COMPOSE_PROJECT}_${svc}"
                                else
                                    echo "ERROR: Could not find local image for service '${svc}'"
                                    docker images
                                    exit 1
                                fi
                                echo "Tagging \$LOCAL_IMAGE -> ${ECR_BACKEND}:${svc}-${IMAGE_TAG}"
                                docker tag \$LOCAL_IMAGE ${ECR_BACKEND}:${svc}-${IMAGE_TAG}
                            """
                        }

                        // Tag frontend
                        sh """
                            if docker image inspect ${COMPOSE_PROJECT}-frontend > /dev/null 2>&1; then
                                LOCAL_IMAGE="${COMPOSE_PROJECT}-frontend"
                            elif docker image inspect ${COMPOSE_PROJECT}_frontend > /dev/null 2>&1; then
                                LOCAL_IMAGE="${COMPOSE_PROJECT}_frontend"
                            else
                                echo "ERROR: Could not find local image for service 'frontend'"
                                docker images
                                exit 1
                            fi
                            echo "Tagging \$LOCAL_IMAGE -> ${ECR_FRONTEND}:frontend-${IMAGE_TAG}"
                            docker tag \$LOCAL_IMAGE ${ECR_FRONTEND}:frontend-${IMAGE_TAG}
                        """

                        echo "All services tagged successfully."
                    }
                }
            }
        }

        stage('Push All Services to ECR') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: "${AWS_CREDS_ID}",
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    script {
                        sh """
                            echo "Re-authenticating to ECR..."
                            aws ecr get-login-password --region ${AWS_REGION} \
                                | docker login --username AWS --password-stdin ${ECR_BASE}
                        """

                        // Push backend services to dev-streaming-app-backend repo
                        def backendServices = ['auth', 'streaming', 'admin', 'chat']
                        for (String svc : backendServices) {
                            sh """
                                echo "Pushing ${ECR_BACKEND}:${svc}-${IMAGE_TAG} ..."
                                docker push ${ECR_BACKEND}:${svc}-${IMAGE_TAG}
                                echo "Successfully pushed backend service: ${svc}"
                            """
                        }

                        // Push frontend to dev-streaming-app-frontend repo
                        sh """
                            echo "Pushing ${ECR_FRONTEND}:frontend-${IMAGE_TAG} ..."
                            docker push ${ECR_FRONTEND}:frontend-${IMAGE_TAG}
                            echo "Successfully pushed frontend"
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning up local Docker images..."
            sh '''
                # Remove compose-built images (both v1/v2 naming)
                for SVC in auth streaming admin chat frontend; do
                    docker rmi ${COMPOSE_PROJECT}-${SVC} || true
                    docker rmi ${COMPOSE_PROJECT}_${SVC} || true
                done

                # Remove ECR-tagged backend images
                for SVC in auth streaming admin chat; do
                    docker rmi ${ECR_BACKEND}:${SVC}-${IMAGE_TAG} || true
                done

                # Remove ECR-tagged frontend image
                docker rmi ${ECR_FRONTEND}:frontend-${IMAGE_TAG} || true

                docker system prune -f
            '''
        }

        success {
            echo "All microservices built and pushed to ECR successfully!"
            emailext(
                to: 'devendra8182@gmail.com',
                subject: "SUCCESS: Streaming CI/CD Pipeline - Build #${env.BUILD_NUMBER}",
                body: """
                    Build #${env.BUILD_NUMBER} completed successfully.

                    Image Tag : ${env.IMAGE_TAG}

                    Backend ECR  : ${env.ECR_BACKEND}
                    Tags pushed  : auth-${env.IMAGE_TAG}, streaming-${env.IMAGE_TAG}, admin-${env.IMAGE_TAG}, chat-${env.IMAGE_TAG}

                    Frontend ECR : ${env.ECR_FRONTEND}
                    Tag pushed   : frontend-${env.IMAGE_TAG}

                    View build: ${env.BUILD_URL}
                """
            )
        }

        failure {
            echo "Pipeline failed. Images were NOT pushed to ECR."
            emailext(
                to: 'devendra8182@gmail.com',
                subject: "FAILURE: Streaming CI/CD Pipeline - Build #${env.BUILD_NUMBER}",
                body: """
                    Build #${env.BUILD_NUMBER} FAILED.

                    Please check the Jenkins console output for details:
                    ${env.BUILD_URL}console
                """
            )
        }
    }
}
