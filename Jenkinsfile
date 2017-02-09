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
    args = "-u root:root -v ${pwd()}/build:/application/build -v ${pwd()}/logs:/application/logs -v ${pwd()}/coverage:/application/coverage"
  }

  // Check package.json for known vulnerabilities

  stage('Security') {
    if (isContentTeamUpdate()) {
      return
    }

    dockerImage.inside(args) {
      sh "cd /application && nsp check"
    }
  }

  // Check source for syntax issues

  stage('Lint') {
    if (isContentTeamUpdate()) {
      return
    }

    dockerImage.inside(args) {
      sh "cd /application && npm --no-color run lint"
    }
  }

  stage('Unit') {
    if (isContentTeamUpdate()) {
      return
    }

    try {
      dockerImage.inside(args) {
        sh "cd /application && npm --no-color run test:coverage"
      }
    } finally {
      publishHTML(target: [
        reportName           : "Coverage Report",
        reportDir            : 'coverage/',
        reportFiles          : 'index.html',
        keepAll              : true,
        alwaysLinkToLastBuild: true,
        allowMissing         : false
      ])
    }
  }

  stage('Review') {
    if (!isReviewable()) {
      return
    }

    build job: 'vets-review-instance-deploy', parameters: [
      stringParam(name: 'devops_branch', value: 'master'),
      stringParam(name: 'api_branch', value: 'master'),
      stringParam(name: 'web_branch', value: env.BRANCH_NAME),
      stringParam(name: 'source_repo', value: 'vets-website'),
    ], wait: false
  }

  // Perform a build for each required build type

  stage('Build') {
    def buildList = ['production']

    if (isContentTeamUpdate()) {
      buildList = ['development']
    }

    if (env.BRANCH_NAME == 'master') {
      buildList << 'development'
      buildList << 'staging'
    }

    def builds = [:]

    for (int i=0; i<envNames.size(); i++) {
      def envName = envNames.get(i)

      if (buildList.contains(envName)) {
        builds[envName] = {
          dockerImage.inside(args) {
            sh "cd /application && npm --no-color run build -- --buildtype=${envName}"
            sh "cd /application && echo \"${buildDetails('buildtype': envName)}\" > build/${envName}/BUILD.txt" 
          }
        }
      } else {
        builds[envName] = {
          println "Build '${envName}' not required, skipped."
        }
      }
    }

    parallel builds
  }

  // Run E2E and accessibility tests

  stage('Integration') {
    if (isContentTeamUpdate()) {
      return
    }

    try {
      parallel (
        e2e: {
          dockerImage.inside(args + " -e BUILDTYPE=production") {
            sh "cd /application && npm --no-color run test:e2e"
          }
        },

        accessibility: {
          dockerImage.inside(args + " -e BUILDTYPE=production") {
            sh "cd /application && npm --no-color run test:accessibility"
          }
        }
      )
    } finally {
      step([$class: 'JUnitResultArchiver', testResults: 'logs/nightwatch/**/*.xml'])
    }
  }

  stage('Deploy') {
    return // Remove when Travis is no longer performing the deployment

    if (!isDeployable()) {
      return
    }

    def targets = [
      'master': [
        [ 'build': 'development', 'bucket': 'dev.vets.gov' ],
        [ 'build': 'staging', 'bucket': 'staging.vets.gov' ],
      ],

      'production': [
        [ 'build': 'production', 'bucket': 'www.vets.gov' ]
      ],
    ][env.BRANCH_NAME]

    def builds = [:]

    for (int i=0; i<targets.size(); i++) {
      def target = targets.get(i)

      builds[target['bucket']] = {
        dockerImage.inside(args) {
          withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'vets-website-s3',
                              usernameVariable: 'AWS_ACCESS_KEY', passwordVariable: 'AWS_SECRET_KEY']]) {
          sh "s3-cli sync --acl-public --delete-removed --recursive --region us-gov-west-1 /application/build/${target['build']} s3://${target['bucket']}/"
          }
        }
      }
    }

    parallel builds
  }
}
