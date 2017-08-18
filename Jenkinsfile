def envNames = ['development', 'staging', 'production']

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
    REF=${vars['ref']}
  """.stripIndent()
}

def notify = { message, color='good' ->
    if (env.BRANCH_NAME == 'master' ||
        env.BRANCH_NAME == 'production') {
        slackSend message: message,
                  color: color,
                  failOnError: true
    }
}

node('vets-website-linting') {
  def dockerImage, args, ref

  // Checkout source, create output directories, build container

  stage('Setup') {
    try {
      checkout scm

      ref = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()

      sh "mkdir -p build"
      sh "mkdir -p logs/selenium"
      sh "mkdir -p coverage"

      def imageTag = java.net.URLDecoder.decode(env.BUILD_TAG).replaceAll("[^A-Za-z0-9\\-\\_]", "-")

      dockerImage = docker.build("vets-website:${imageTag}")
      args = "-v ${pwd()}/build:/application/build -v ${pwd()}/logs:/application/logs -v ${pwd()}/coverage:/application/coverage"
    } catch (error) {
      notify("vets-website ${env.BRANCH_NAME} branch CI failed in setup stage!", 'danger')
      throw error
    }
  }

  // Check package.json for known vulnerabilities

  stage('Security') {
    try {
      dockerImage.inside(args) {
        sh "cd /application && nsp check"
      }
    } catch (error) {
      notify("vets-website ${env.BRANCH_NAME} branch CI failed in security stage!", 'danger')
      throw error
    }
  }

  // Check source for syntax issues

  stage('Lint') {
    try {
      dockerImage.inside(args) {
        sh "cd /application && npm --no-color run lint"
      }
    } catch (error) {
      notify("vets-website ${env.BRANCH_NAME} branch CI failed in lint stage!", 'danger')
      throw error
    }
  }

  stage('Unit') {
    try {
      dockerImage.inside(args) {
        sh "cd /application && npm --no-color run test:coverage"
        sh "cd /application && CODECLIMATE_REPO_TOKEN=fe4a84c212da79d7bb849d877649138a9ff0dbbef98e7a84881c97e1659a2e24 codeclimate-test-reporter < ./coverage/lcov.info"
      }
    } catch (error) {
      notify("vets-website ${env.BRANCH_NAME} branch CI failed in unit stage!", 'danger')
      throw error
    }
  }

  // Perform a build for each build type

  stage('Build') {
    try {
      def builds = [:]

      for (int i=0; i<envNames.size(); i++) {
        def envName = envNames.get(i)

        builds[envName] = {
          dockerImage.inside(args) {
            sh "cd /application && npm --no-color run build -- --buildtype=${envName}"
            sh "cd /application && echo \"${buildDetails('buildtype': envName, 'ref': ref)}\" > build/${envName}/BUILD.txt"
          }
        }
      }

      parallel builds
    } catch (error) {
      notify("vets-website ${env.BRANCH_NAME} branch CI failed in build stage!", 'danger')
      throw error
    }
  }

  // Run E2E and accessibility tests

  stage('Integration') {
    try {
      parallel (
        e2e: {
          dockerImage.inside(args + " -e BUILDTYPE=production") {
            sh "Xvfb :99 & cd /application && DISPLAY=:99 npm --no-color run test:e2e"
          }
        },

        accessibility: {
          dockerImage.inside(args + " -e BUILDTYPE=production") {
            sh "Xvfb :98 & cd /application && DISPLAY=:98 npm --no-color run test:accessibility"
          }
        }
      )
    } catch (error) {
      notify("vets-website ${env.BRANCH_NAME} branch CI failed in integration stage!", 'danger')
      throw error
    } finally {
      step([$class: 'JUnitResultArchiver', testResults: 'logs/nightwatch/**/*.xml'])
    }
  }

  stage('Archive') {
    try {
      def builds = [ 'development', 'staging', 'production' ]

      dockerImage.inside(args) {
        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'vetsgov-website-builds-s3-upload',
                          usernameVariable: 'AWS_ACCESS_KEY', passwordVariable: 'AWS_SECRET_KEY']]) {
          for (int i=0; i<builds.size(); i++) {
            sh "tar -C /application/build/${builds.get(i)} -cf /application/build/${builds.get(i)}.tar.bz2 ."
            sh "s3-cli put --acl-public --region us-gov-west-1 /application/build/${builds.get(i)}.tar.bz2 s3://vetsgov-website-builds-s3-upload/${ref}/${builds.get(i)}.tar.bz2"
          }
        }
      }
    } catch (error) {
      notify("vets-website ${env.BRANCH_NAME} branch CI failed in archive stage!", 'danger')
      throw error
    }
  }

  stage('Review') {
    try {
      if (!isReviewable()) {
        return
      }
      build job: 'deploys/vets-review-instance-deploy', parameters: [
        stringParam(name: 'devops_branch', value: 'master'),
        stringParam(name: 'api_branch', value: 'master'),
        stringParam(name: 'web_branch', value: env.BRANCH_NAME),
        stringParam(name: 'source_repo', value: 'vets-website'),
      ], wait: false
    } catch (error) {
      notify("vets-website ${env.BRANCH_NAME} branch CI failed in review stage!", 'danger')
      throw error
    }
  }

  stage('Deploy') {
    try {
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
    } catch (error) {
      notify("vets-website ${env.BRANCH_NAME} branch CI failed in deploy stage!", 'danger')
      throw error
    }
  }
}
