import java.util.Random

def random = new Random()

def port = { random.nextInt(64535) + 1000 }

pipeline {
  agent label:'vets-website-linting'
  stages {
    stage('Install NPM packages') {
      steps { sh 'npm-cache install' }
    }

    stage('Ensure selenium is prepared') {
      steps { sh 'npm run selenium:bootstrap' }
    }

    stage('Build stuff') {
      steps { sh 'npm run build -- --buildtype development' }
    }

    stage('Run checks') {
      steps {
        parallel (
          "Security Checks": { sh 'nsp check' },
          "Linting": { sh 'npm run lint' },
          "Unit Tests": { sh 'npm run test:unit' },
          "E2E Tests": {
            withEnv(["API_PORT=${port()}", "WEB_PORT=${port()}"]) {
              sh 'npm run test:e2e'
            }
          },
          "Accessibility Checks": {
            withEnv(["API_PORT=${port()}", "WEB_PORT=${port()}"]) {
              sh 'npm run test:accessibility'
            }
          },
        )
      }
    }
  }
}
