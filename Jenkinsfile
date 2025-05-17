pipeline {
    agent any
    
    environment {
        GITHUB_REPO_URL = 'https://github.com/SiddheshDare/Test.git'
        DOCKER_HUB_CREDS = credentials('DockerHubCred')
        DOCKER_IMAGE_BACKEND = 'siddhesh01/employee_attrition1-backend'
        DOCKER_IMAGE_FRONTEND = 'siddhesh01/employee_attrition1-frontend'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        KUBECONFIG_CRED = credentials('mykubeconfig')
    }

    stages {
        stage('Checkout from GitHub') {
            steps {
                script {
                    // clone the code from the GitHub repository
                    git branch: 'main', url: "${GITHUB_REPO_URL}"
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                dir('Employee_Attrition/backend') {
                    sh 'docker build -t ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} .'
                    sh 'docker tag ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} ${DOCKER_IMAGE_BACKEND}:latest'
                }
                dir('Employee_Attrition/frontend') {
                    sh 'docker build -t ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} .'
                    sh 'docker tag ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} ${DOCKER_IMAGE_FRONTEND}:latest'
                }
            }
        }
        
        stage('Push Docker Images') {
            steps {
                sh 'echo ${DOCKER_HUB_CREDS_PSW} | docker login -u ${DOCKER_HUB_CREDS_USR} --password-stdin'
                sh 'docker push ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG}'
                sh 'docker push ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}'
                sh 'docker push ${DOCKER_IMAGE_BACKEND}:latest'
                sh 'docker push ${DOCKER_IMAGE_FRONTEND}:latest'
            }
        }
        
        stage('Update Kubernetes Manifests') {
            steps {
                sh '''
                sed -i "s|image: ${DOCKER_IMAGE_BACKEND}:.*|image: ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG}|g" Employee_Attrition/k8s/backend-deployment.yaml
                sed -i "s|image: ${DOCKER_IMAGE_FRONTEND}:.*|image: ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}|g" Employee_Attrition/k8s/frontend-deployment.yaml
                sed -i 's/imagePullPolicy: Never/imagePullPolicy: Always/g' Employee_Attrition/k8s/backend-deployment.yaml
                sed -i 's/imagePullPolicy: Never/imagePullPolicy: Always/g' Employee_Attrition/k8s/frontend-deployment.yaml
                '''
            }
        }
        
        stage('Deploy with Ansible') {
            steps {
                withCredentials([file(credentialsId: 'mykubeconfig', variable: 'KUBECONFIG_FILE')]) {
                    dir('Employee_Attrition') {
                        sh '''
                        export ANSIBLE_PYTHON_INTERPRETER=/usr/bin/python3
                        export KUBECONFIG="${KUBECONFIG_FILE}"
                        cat "${KUBECONFIG_FILE}" > /tmp/kubeconfig
                        chmod 600 /tmp/kubeconfig
                        ansible-playbook -i ansible/inventory -e "kubeconfig=/tmp/kubeconfig" ansible/deploy.yml
                        '''
                    }
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                withCredentials([file(credentialsId: 'mykubeconfig', variable: 'KUBECONFIG_FILE')]) {
                    sh '''
                    KUBECONFIG=${KUBECONFIG_FILE} kubectl get pods -n employee-attrition
                    KUBECONFIG=${KUBECONFIG_FILE} kubectl get services -n employee-attrition
                    KUBECONFIG=${KUBECONFIG_FILE} kubectl get hpa -n employee-attrition
                    '''
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker logout || true'
            sh 'rm -f /tmp/kubeconfig || true'
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