import java.util.Random

def random = new Random()

def port = { random.nextInt(64535) + 1000 }

def env_vars = [
  "API_PORT=${port()}",
  "WEB_PORT=${port()}",
  "SELENIUM_PORT=${port()}",
]

pipeline {
  agent label:'vets-website-linting'
  stages {
    stage('Install NPM packages') {
      steps { sh 'npm-cache install' }
    }

    stage('Ensure selenium is prepared') {
      steps { sh 'npm --no-color run selenium:bootstrap' }
    }

    stage('Build stuff') {
      steps {
        withEnv(env_vars) {
          sh 'npm --no-color run build -- --buildtype development'
        }
      }
    }

    stage('Run checks') {
      steps {
        parallel (
          "Security Checks": { sh 'nsp check' },
          "Linting": { sh 'npm --no-color run lint' },
          "Unit Tests": { sh 'npm --no-color run test:unit' },
          "Accessibility Checks": {
            withEnv(env_vars) {
              sh 'npm --no-color run test:accessibility'
            }
          },
        )
      }
    }
    
    stage("E2E Tests") {
      steps {
        withEnv(env_vars) {
          sh 'npm --no-color run test:e2e'
        }
      }
    }
  }
}
