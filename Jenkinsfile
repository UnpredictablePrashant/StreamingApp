pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-northeast-3'
        ECR_REPO_PREFIX = 'public.ecr.aws/f8g8h5d4/shrutika-capstoneproject' // Replace with your public ECR repository
        DOCKER_CREDENTIALS = credentials('ravikishans')
        EKS_CLUSTER_NAME = "streamingapp-eks-cluster"
        
        ARGOCD_SERVER= "ae7d841dda6284da1a2122ee5882f12f-312836746.ap-northeast-3.elb.amazonaws.com"
        ARGOCD_APP_NAME= "streamingapp"
        ARGOCD_CREDENTIALS = credentials('argocd-admin')
        BRANCH= "main"

        HELM_RELEASE_NAME = "streamingapp"
        HELM_CHART_PATH = './k8s/streamingapp' // Path to Helm chart
        FRONTEND_APP_PATH = './frontend/src/App.js'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Ravikishans/StreamingApp.git'
            }
        }

        stage('Build and Push Docker Images') {
            steps {
                script {
                    withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding',credentialsId: 'aws_credentials'
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

        stage('tag & push images') {
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
                        docker tag mongo ${ECR_REPO_PREFIX}:mongo
                        docker tag mongo-express ${ECR_REPO_PREFIX}:mongo-express
                        # Push images to ECR
                        docker push ${ECR_REPO_PREFIX}:frontend
                        docker push ${ECR_REPO_PREFIX}:backend_auth
                        docker push ${ECR_REPO_PREFIX}:backend_stream
                        docker push ${ECR_REPO_PREFIX}:mongo
                        docker push ${ECR_REPO_PREFIX}:mongo-express
                        """
                    }
                }
            }
        }

        stage('Validate Placeholders in Helm Chart') {
            steps {
                script {
                    sh """
                        grep 'ravikishans/streamingapp:frontend' ${HELM_CHART_PATH}/values.yaml || echo 'Placeholder not found!'
                        grep 'ravikishans/streamingapp:backend_auth' ${HELM_CHART_PATH}/values.yaml || echo 'Placeholder not found!'
                        grep 'ravikishans/streamingapp:backend_stream' ${HELM_CHART_PATH}/values.yaml || echo 'Placeholder not found!'
                        grep 'localhost:3002/streaming' ${FRONTEND_APP_PATH} || echo 'Placeholder not found'
                    """
                }
            }
        }

        stage('Update Helm Chart with ECR Image Tags') {
            steps {
                script {
                    sh """
                        sed -i "s|ravikishans/streamingapp:frontend|${ECR_REPO_PREFIX}:frontend|g" ${HELM_CHART_PATH}/values.yaml
                        sed -i "s|ravikishans/streamingapp:backend_auth|${ECR_REPO_PREFIX}:backend_auth|g" ${HELM_CHART_PATH}/values.yaml
                        sed -i "s|ravikishans/streamingapp:backend_stream|${ECR_REPO_PREFIX}:backend_stream|g" ${HELM_CHART_PATH}/values.yaml
                        sed -i "s|mongo:latest|${ECR_REPO_PREFIX}:mongo|g" ${HELM_CHART_PATH}/values.yaml
                    """
                }
            }
        }
        stage('value.yaml') {
            steps {
                script {
                    sh """
                       cat ${HELM_CHART_PATH}/values.yaml
                    """   
                }
            }
        }

        stage('eks update') {
            steps {
                script{ 
                    withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding',credentialsId: 'aws_credentials'
                    ]]) {
                        sh """
                        aws eks update-kubeconfig --region ${AWS_REGION} --name ${EKS_CLUSTER_NAME}
                        kubectl get pods --all-namespaces
                        kubectl get svc --all-namespaces
                        """
                    }
                }    
            }
        }    

        stage('helm deploy') {
            steps {
                script{ 
                    withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding',credentialsId: 'aws_credentials'
                    ]]) {
                        sh """
                        helm upgrade --install ${HELM_RELEASE_NAME} ${HELM_CHART_PATH} --namespace default --create-namespace
                        """
                    }
                }    
            }
        }

        stage('Extract External IP from Helm Chart') {
            steps {
                script {
                    withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding',credentialsId: 'aws_credentials'
                    ]]) {
                        def externalIP = sh(
                            script: """
                            kubectl get svc stream-backend-svc -n bestream -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
                            """,
                            returnStdout: true
                        ).trim()

                        if (!externalIP) {
                            error("Failed to fetch external IP from Kubernetes service.")
                        }

                        // Print the extracted IP for debugging
                        echo "External IP extracted: ${externalIP}"

                        // Update the placeholder in the frontend source code
                        sh """
                        sed -i "s|localhost:3002/streaming|${externalIP}:3002/streaming|g" ${FRONTEND_APP_PATH}
                        cat ${FRONTEND_APP_PATH}
                        """
                    }
                }
            }
        }

        stage('update Docker Images') {
            steps {
                script {
                    withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding',credentialsId: 'aws_credentials'
                    ]]) {
                        sh """
                        # Authenticate Docker to ECR public
                        aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/f8g8h5d4

                        # Build Docker images
                        cd ./frontend
                        docker build -t ravikishans/streamingapp:frontend .
                    """
                    }
                }
            }
        }

        stage('tag & push updated images') {
            steps {
                script{ 
                    withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding',credentialsId: 'aws_credentials'
                    ]]) {
                        sh """
                        # Tag images for ECR
                        docker tag ravikishans/streamingapp:frontend ${ECR_REPO_PREFIX}:frontend
                        # Push images to ECR
                        docker push ${ECR_REPO_PREFIX}:frontend
                        """
                    }
                }
            }
        }

        stage('Update again Helm Chart with ECR Image Tags') {
            steps {
                script {
                    sh """
                        sed -i "s|ravikishans/streamingapp:frontend|${ECR_REPO_PREFIX}:frontend|g" ${HELM_CHART_PATH}/values.yaml
                    """
                }
            }
        }

        // stage('helm deploy with update frontend') {
        //     steps {
        //         script{ 
        //             withCredentials([[
        //                 $class: 'AmazonWebServicesCredentialsBinding',credentialsId: 'aws_credentials'
        //             ]]) {
        //                 sh """
        //                 sed -i "s|ravikishans/streamingapp:frontend|${ECR_REPO_PREFIX}:frontend|g" ${HELM_CHART_PATH}/values.yaml
        //                 cat  ${HELM_CHART_PATH}/values.yaml
        //                 helm upgrade --install ${HELM_RELEASE_NAME} ${HELM_CHART_PATH} --namespace default --create-namespace
        //                 kubectl get pods --all-namespaces
        //                 kubectl get svc --all-namespaces
        //                 """
        //             }
        //         }    
        //     }
        // }



        // stage('ArgoCD Login, sync and Verify ArgoCD Application Sync ') {
        //     steps {
        //         script {
        //             withCredentials([usernamePassword(credentialsId: 'argocd-admin', usernameVariable: 'ARGOCD_USERNAME', passwordVariable: 'ARGOCD_PASSWORD')]) {
        //                 sh """
        //                 # Login to ArgoCD
        //                 argocd login ${ARGOCD_SERVER} --username ${ARGOCD_USERNAME} --password ${ARGOCD_PASSWORD} --insecure
        //                 argocd app sync ${ARGOCD_APP_NAME}
        //                 argocd app get ${ARGOCD_APP_NAME}
        //                 """
        //             }
        //         }
        //     }
        // }

        stage('Deploy with Helm and Sync with ArgoCD') {
            steps {
                script { 
                    // Step 1: Helm deploy with update to frontend
                    withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws_credentials'
                    ]]) {
                        sh """
                        sed -i "s|ravikishans/streamingapp:frontend|${ECR_REPO_PREFIX}:frontend|g" ${HELM_CHART_PATH}/values.yaml
                        cat ${HELM_CHART_PATH}/values.yaml
                        helm upgrade --install ${HELM_RELEASE_NAME} ${HELM_CHART_PATH} --namespace default --create-namespace
                        kubectl get pods --all-namespaces
                        kubectl get svc --all-namespaces
                        """
                    }
                    
                    // Step 2: ArgoCD Login, sync and verify
                    withCredentials([usernamePassword(credentialsId: 'argocd-admin', usernameVariable: 'ARGOCD_USERNAME', passwordVariable: 'ARGOCD_PASSWORD')]) {
                        sh """
                        # Login to ArgoCD
                        argocd login ${ARGOCD_SERVER} --username ${ARGOCD_USERNAME} --password ${ARGOCD_PASSWORD} --insecure
                        argocd app sync ${ARGOCD_APP_NAME}
                        argocd app get ${ARGOCD_APP_NAME}
                        """
                    }
                }
            }
        }

        

        stage('verify deployment') {
            steps {
                script{ 
                    withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding',credentialsId: 'aws_credentials'
                    ]]) {
                        sh """
                        cat ${HELM_CHART_PATH}/values.yaml
                        kubectl get pods --all-namespaces
                        kubectl get svc --all-namespaces
                        """
                    }
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
        always {
            echo "Post-pipeline cleanup or notifications"
            script {
                // Clean up Docker resources only if it's the 'main' branch
                if (env.BRANCH == 'main') {
                    echo 'Cleaning up Docker resources on the main branch'
                    sh 'docker system prune -f'  // This removes unused Docker containers, images, networks, and volumes
                }
            }
        }
    }
}


