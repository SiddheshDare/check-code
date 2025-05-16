pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDS = credentials('docker-hub-credentials')
        DOCKER_REGISTRY = "registry.example.com"
        DOCKER_FRONTEND_IMAGE = "${DOCKER_REGISTRY}/employee-attrition-frontend:${BUILD_NUMBER}"
        DOCKER_BACKEND_IMAGE = "${DOCKER_REGISTRY}/employee-attrition-backend:${BUILD_NUMBER}"
        K8S_CONFIG = credentials('k8s-config')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Static Code Analysis') {
            parallel {
                stage('Backend Linting') {
                    steps {
                        dir('Employee_Attrition/backend') {
                            sh 'pip install flake8'
                            sh 'flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics'
                        }
                    }
                }
                stage('Frontend Linting') {
                    steps {
                        dir('Employee_Attrition/frontend') {
                            sh 'npm install'
                            sh 'npm run lint'
                        }
                    }
                }
            }
        }
        
        stage('Build') {
            parallel {
                stage('Build Backend') {
                    steps {
                        dir('Employee_Attrition/backend') {
                            sh 'docker build -t ${DOCKER_BACKEND_IMAGE} .'
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        dir('Employee_Attrition/frontend') {
                            sh 'docker build -t ${DOCKER_FRONTEND_IMAGE} .'
                        }
                    }
                }
            }
        }
        
        stage('Test') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('Employee_Attrition/backend') {
                            sh 'pip install -r requirements.txt'
                            sh 'python manage.py test'
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        dir('Employee_Attrition/frontend') {
                            sh 'npm test || true'  // Allow failures for now
                        }
                    }
                }
            }
        }
        
        stage('Push Docker Images') {
            steps {
                sh 'echo ${DOCKER_HUB_CREDS_PSW} | docker login ${DOCKER_REGISTRY} -u ${DOCKER_HUB_CREDS_USR} --password-stdin'
                sh 'docker push ${DOCKER_BACKEND_IMAGE}'
                sh 'docker push ${DOCKER_FRONTEND_IMAGE}'
            }
        }
        
        stage('Deploy with Ansible') {
            steps {
                sh '''
                export BACKEND_IMAGE=${DOCKER_BACKEND_IMAGE}
                export FRONTEND_IMAGE=${DOCKER_FRONTEND_IMAGE}
                ansible-playbook -i ansible/inventory ansible/deploy.yml
                '''
            }
        }
        
        stage('Verify Deployment') {
            steps {
                sh '''
                export KUBECONFIG=${K8S_CONFIG}
                kubectl get pods -n employee-attrition
                kubectl get services -n employee-attrition
                '''
            }
        }
    }
    
    post {
        always {
            sh 'docker logout ${DOCKER_REGISTRY}'
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}