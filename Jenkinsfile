import java.util.Random

// Define a series of ports for services required by the test run for each build type.


def random = new Random()

def port = { random.nextInt(997) + 26000 }
def startPort = port()
def envNames = ['development', 'staging', 'production']
def envs = [:]

// Define build environments for each build type.
// Some useful branch-api-plugin env docs: https://github.com/jglick/branch-api-plugin/blob/fe9b02af870105954f978b52faab2669c787dc9f/src/main/resources/jenkins/branch/BranchNameContributor/buildEnv.properties

for (int i = 0; i < envNames.size(); i++) {
  def env = [
    "API_PORT=${startPort}",
    "WEB_PORT=${startPort + 1}",
    "SELENIUM_PORT=${startPort + 2}",
    "NODE_ENV=production",
    "BUILDTYPE=${envNames.get(i)}"
  ]

  envs.put(envNames.get(i), env)

  startPort += 3
}

def isPushNotificationOnFeature = {
  !env.CHANGE_TARGET && !['master', 'production'].contains(env.BRANCH_NAME)
}

def isContentTeamUpdate = {
  env.BRANCH_NAME ==~ /^content\/wip\/.*/
}

def isProtectedMergePreviouslyTested = {
  (env.BRANCH_NAME == 'master' ||
    env.BRANCH_NAME == 'production')
}

def buildDetails = { vars ->
  """
    BUILDTYPE=${vars['buildtype']}
    NODE_ENV=production
    BRANCH_NAME=${env.BRANCH_NAME}
    CHANGE_TARGET=${env.CHANGE_TARGET}
    BUILD_ID=${env.BUILD_ID}
    BUILD_NUMBER=${env.BUILD_NUMBER}
  """.stripIndent()
}

pipeline {
  agent label: 'vets-website-linting'

  post {
    always {
      archive "build/**/*"
    }
  }

  stages {
    stage('Prepare') {
      when {
        !isPushNotificationOnFeature()
      }

      steps {
        checkout scm
      }     
    }

    stage('Security') {
      when {
        !isPushNotificationOnFeature() && !isContentTeamUpdate()
      }

      steps {
        sh 'nsp check'
      }
    }

    stage('Dependencies') {
      when {
        !isPushNotificationOnFeature() && !isContentTeamUpdate()
      }

      steps {
        sh 'npm-cache install'
      }
    }

    stage('Lint') {
      when {
        !isPushNotificationOnFeature() && !isContentTeamUpdate()
      }

      steps {
        sh 'npm --no-color run lint:js'
        sh 'npm --no-color run lint:sass'
      }
    }

    stage('Build') {
      when {
        !isPushNotificationOnFeature() && !isContentTeamUpdate()
      }

      steps {
        parallel(
          'development': {
            withEnv(envs['development']) {
              sh "rm -rf build/development"
              sh "npm --no-color run build -- --buildtype development"
              sh "echo \"${buildDetails('buildtype': 'development')}\" > build/development/BUILD.txt" 
            }
          },

          'staging': {
            withEnv(envs['staging']) {
              sh "rm -rf build/staging"
              sh "npm --no-color run build -- --buildtype staging"
              sh "echo \"${buildDetails('buildtype': 'staging')}\" > build/staging/BUILD.txt" 
            }
          },

          'production': {
            withEnv(envs['production']) {
              sh "rm -rf build/production"
              sh "npm --no-color run build -- --buildtype production"
              sh "echo \"${buildDetails('buildtype': 'production')}\" > build/production/BUILD.txt" 
            }
          }
        )
      }
    }

    stage('Unit') {
      when {
        !isPushNotificationOnFeature() && !isContentTeamUpdate() && !isProtectedMergePreviouslyTested()
      }

      steps {
        parallel(
          'development': {
            withEnv(envs['development']) {
               sh "npm --no-color run test:unit"
            }
          },

          'staging': {
            withEnv(envs['staging']) {
               sh "npm --no-color run test:unit"
            }
          },

          'production': {
            withEnv(envs['production']) {
              sh "npm --no-color run test:unit"
            }
          }
        ) 
      }
    }

    stage('Selenium') {
      when {
        !isPushNotificationOnFeature() && !isContentTeamUpdate() && !isProtectedMergePreviouslyTested()
      }

      steps {
        sh "npm --no-color run selenium:bootstrap"
      }
    }

    stage('E2E') {
      when {
        !isPushNotificationOnFeature() && !isContentTeamUpdate() && !isProtectedMergePreviouslyTested()
      }

      steps {
        parallel(
          'development': {
            withEnv(envs['development']) {
               sh "npm --no-color run test:e2e"
            }
          },

          'staging': {
            withEnv(envs['staging']) {
               sh "npm --no-color run test:e2e"
            }
          },

          'production': {
            withEnv(envs['production']) {
              sh "npm --no-color run test:e2e"
            }
          }
        )
      }
    }

    stage('Accessibility') {
      when {
        !isPushNotificationOnFeature() && !isContentTeamUpdate() && !isProtectedMergePreviouslyTested()
      }

      steps {
        withEnv(envs['development']) {
           sh "npm --no-color run test:accessibility"
        }
      }
    }
  }
}
