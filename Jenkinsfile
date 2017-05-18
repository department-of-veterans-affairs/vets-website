def envNames = ['development', 'staging', 'production']

def isContentTeamUpdate = {
  env.BRANCH_NAME ==~ /^content\/wip\/.*/
}

def isReviewable = {
  env.BRANCH_NAME != 'production' &&
    env.BRANCH_NAME != 'master'
}

env.CONCURRENCY = 10

def isDeployable = {
  (env.BRANCH_NAME == 'master' ||
    env.BRANCH_NAME == 'production') &&
    !env.CHANGE_TARGET
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

node('vets-website-linting') {
  def dockerImage, args

  // Checkout source, create output directories, build container

  stage('Setup') {
    checkout scm

    sh "mkdir -p build"
    sh "mkdir -p logs/selenium"
    sh "mkdir -p coverage"

    def imageTag = java.net.URLDecoder.decode(env.BUILD_TAG).replaceAll("[^A-Za-z0-9\\-\\_]", "-")

    dockerImage = docker.build("vets-website:${imageTag}")
    args = "-v ${pwd()}/build:/application/build -v ${pwd()}/logs:/application/logs -v ${pwd()}/coverage:/application/coverage"
  }

  stage('Build') {
    parallel(
      "production": {
        dockerImage.inside(args) {
          sh "cd /application && npm --no-color run build -- --buildtype=production"
        }
      },

      "development": {
        dockerImage.inside(args) {
          sh "cd /application && npm --no-color run build -- --buildtype=staging"
        }
      }
    )

    archiveArtifacts artifacts: 'build/**/*', fingerprint: true
  }
}
