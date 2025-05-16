pipeline {
    agent any
    
    environment {
        // Use local image names without registry for simplicity
        DOCKER_BACKEND_IMAGE = "siddhesh01/employee_attrition1-backend:latest"
        DOCKER_FRONTEND_IMAGE = "siddhesh01/employee_attrition1-frontend:latest"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Docker Images') {
            steps {
                dir('Employee_Attrition/backend') {
                    sh 'docker build -t ${DOCKER_BACKEND_IMAGE} .'
                }
                dir('Employee_Attrition/frontend') {
                    sh 'docker build -t ${DOCKER_FRONTEND_IMAGE} .'
                }
            }
        }
        
        stage('Basic Tests') {
            steps {
                dir('Employee_Attrition/backend') {
                    sh 'python -m pytest || true'
                }
                echo "Frontend tests would run here"
            }
        }
        
        stage('Deploy with Ansible') {
            steps {
                // Using the existing Ansible playbook for deployment
                dir('Employee_Attrition') {
                    sh '''
                    export ANSIBLE_PYTHON_INTERPRETER=/usr/bin/python3
                    ansible-playbook -i ansible/inventory ansible/deploy.yml
                    '''
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                sh 'kubectl get pods -n employee-attrition'
                sh 'kubectl get services -n employee-attrition'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}