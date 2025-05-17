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
        
        // stage('Build Docker Images') {
        //     steps {
        //         dir('Employee_Attrition/backend') {
        //             sh 'docker build -t ${DOCKER_BACKEND_IMAGE} .'
        //         }
        //         dir('Employee_Attrition/frontend') {
        //             sh 'docker build -t ${DOCKER_FRONTEND_IMAGE} .'
        //         }
        //     }
        // }
        
        // stage('Basic Tests') {
        //     steps {
        //         dir('Employee_Attrition/backend') {
        //             sh 'python -m pytest || true'
        //         }
        //         echo "Frontend tests would run here"
        //     }
        // }
        
        stage('Deploy with Ansible') {
            steps {
                withCredentials([file(credentialsId: 'mykubeconfig', variable: 'KUBECONFIG_FILE')]) {
                    dir('Employee_Attrition') {
                        sh '''
                        export ANSIBLE_PYTHON_INTERPRETER=/usr/bin/python3
                        export KUBECONFIG=${KUBECONFIG_FILE}
                        ansible-playbook -i ansible/inventory -e "kubeconfig=${KUBECONFIG_FILE}" ansible/deploy.yml
                        '''
                    }
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                withCredentials([file(credentialsId: 'mykubeconfig', variable: 'KUBECONFIG_FILE')]) {
                    sh 'KUBECONFIG=${KUBECONFIG_FILE} kubectl get pods -n employee-attrition'
                    sh 'KUBECONFIG=${KUBECONFIG_FILE} kubectl get services -n employee-attrition'
                }
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