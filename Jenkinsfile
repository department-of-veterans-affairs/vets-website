import org.kohsuke.github.GitHub

env.CONCURRENCY = 10

VETSGOV_BUILDTYPES = [
  'development',
  'staging',
  'production'
]

VAGOV_BUILDTYPES = [
  'vagovdev',
  'vagovstaging',
  'vagovprod'
]

DEV_BRANCH = 'master'
STAGING_BRANCH = 'master'
PROD_BRANCH = 'master'

IS_DEV_BRANCH = env.BRANCH_NAME == DEV_BRANCH
IS_STAGING_BRANCH = env.BRANCH_NAME == STAGING_BRANCH
IS_PROD_BRANCH = env.BRANCH_NAME == PROD_BRANCH

def isReviewable = {
  !IS_DEV_BRANCH && !IS_STAGING_BRANCH && !IS_PROD_BRANCH
}

def isDeployable = {
  (IS_DEV_BRANCH ||
   IS_STAGING_BRANCH) &&
    !env.CHANGE_TARGET &&
    !currentBuild.nextBuild // if there's a later build on this job (branch), don't deploy
}

def shouldBail = {
  // abort the job if we're not on deployable branch (usually master) and there's a newer build going now
  !IS_DEV_BRANCH &&
  !IS_STAGING_BRANCH &&
  !IS_PROD_BRANCH &&
  !env.CHANGE_TARGET &&
  currentBuild.nextBuild
}

def runDeploy(jobName, ref) {
  build job: jobName, parameters: [
    booleanParam(name: 'notify_slack', value: true),
    stringParam(name: 'ref', value: ref),
  ], wait: false
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

def notify = { ->
  if (IS_DEV_BRANCH || IS_STAGING_BRANCH || IS_PROD_BRANCH) {
    message = "vets-website ${env.BRANCH_NAME} branch CI failed. |${env.RUN_DISPLAY_URL}".stripMargin()
    slackSend message: message,
    color: 'danger',
    failOnError: true
  }
}

node('vetsgov-general-purpose') {
  properties([[$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', daysToKeepStr: '60']]]);
  def dockerImage, args, ref, imageTag

  // Checkout source, create output directories, build container

  stage('Setup') {
    try {
      // Jenkins doesn't like it when we checkout the secondary repository first
      // so we checkout 'vets-website' first
      dir("vets-website") {
        checkout scm
      }

      // clone vagov-content
      checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'CloneOption', noTags: true, reference: '', shallow: true], [$class: 'RelativeTargetDirectory', relativeTargetDir: 'vagov-content']], submoduleCfg: [], userRemoteConfigs: [[url: 'git@github.com:department-of-veterans-affairs/vagov-content.git']]]

      args = "-v ${pwd()}/vets-website:/application -v ${pwd()}/vagov-content:/vagov-content"

      dir("vets-website") {
        ref = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()

        sh "mkdir -p build"
        sh "mkdir -p logs/selenium"
        sh "mkdir -p coverage"

        imageTag = java.net.URLDecoder.decode(env.BUILD_TAG).replaceAll("[^A-Za-z0-9\\-\\_]", "-")

        dockerImage = docker.build("vets-website:${imageTag}")
        retry(5) {
          dockerImage.inside(args) {
            sh "cd /application && yarn install --production=false"
          }
        }
      }
    } catch (error) {
      notify()
      throw error
    }
  }

  stage('Lint|Security|Unit') {
    try {
      parallel (
        lint: {
          dockerImage.inside(args) {
            sh "cd /application && npm --no-color run lint"
          }
        },

        // Check package.json for known vulnerabilities
        security: {
          retry(3) {
            dockerImage.inside(args) {
              sh "cd /application && npm run security-check"
            }
          }
        },

        unit: {
          dockerImage.inside(args) {
            sh "cd /application && npm --no-color run test:coverage"
          }
        }
      )
    } catch (error) {
      notify()
      throw error
    } finally {
      dir("vets-website") {
        step([$class: 'JUnitResultArchiver', testResults: 'test-results.xml'])
      }
    }
  }

  stage('Build: Redirects') {
    if (shouldBail()) { return }

    try {
      def builds = [:]

      for (int i=0; i<VETSGOV_BUILDTYPES.size(); i++) {
        def envName = VETSGOV_BUILDTYPES.get(i)
        builds[envName] = {
          dockerImage.inside(args) {
            sh "cd /application && npm --no-color run build:redirects -- --buildtype=${envName}"
            sh "cd /application && echo \"${buildDetails('buildtype': envName, 'ref': ref)}\" > build/${envName}/BUILD.txt"
          }
        }
      }

      parallel builds
    } catch (error) {
      notify()
      throw error
    }
  }

  // Perform a build for each build type

  stage('Build') {
    if (shouldBail()) { return }

    try {
      def builds = [:]

      for (int i=0; i<VAGOV_BUILDTYPES.size(); i++) {
        def envName = VAGOV_BUILDTYPES.get(i)
        builds[envName] = {
          dockerImage.inside(args) {
            sh "cd /application && npm --no-color run build -- --buildtype=${envName}"
            sh "cd /application && echo \"${buildDetails('buildtype': envName, 'ref': ref)}\" > build/${envName}/BUILD.txt"
          }
        }
      }

      parallel builds
    } catch (error) {
      notify()
      throw error
    }
  }

  // Run E2E and accessibility tests
  stage('Integration') {
    if (shouldBail()) { return }
    dir("vets-website") {
      try {
        parallel (
          e2e: {
            sh "export IMAGE_TAG=${imageTag} && docker-compose -p e2e up -d && docker-compose -p e2e run --rm --entrypoint=npm -e BABEL_ENV=test -e BUILDTYPE=vagovprod vets-website --no-color run nightwatch:docker"
          },

          accessibility: {
            sh "export IMAGE_TAG=${imageTag} && docker-compose -p accessibility up -d && docker-compose -p accessibility run --rm --entrypoint=npm -e BABEL_ENV=test -e BUILDTYPE=vagovprod vets-website --no-color run nightwatch:docker -- --env=accessibility"
          }
        )
      } catch (error) {
        notify()
        throw error
      } finally {
        sh "docker-compose -p e2e down --remove-orphans"
        sh "docker-compose -p accessibility down --remove-orphans"
        step([$class: 'JUnitResultArchiver', testResults: 'logs/nightwatch/**/*.xml'])
      }
    }
  }

  stage('Prearchive optimizations') {
    if (shouldBail()) { return }

    try {
      def builds = [:]

      for (int i=0; i<VAGOV_BUILDTYPES.size(); i++) {
        def envName = VAGOV_BUILDTYPES.get(i)

        builds[envName] = {
          dockerImage.inside(args) {
            sh "cd /application && node script/prearchive.js --buildtype=${envName}"
          }
        }
      }

      parallel builds
    } catch (error) {
      notify()

      throw error
    }
  }

  stage('Archive') {
    if (shouldBail()) { return }

    def envNames = VETSGOV_BUILDTYPES + VAGOV_BUILDTYPES
    try {
      dockerImage.inside(args) {
        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'vetsgov-website-builds-s3-upload',
                          usernameVariable: 'AWS_ACCESS_KEY', passwordVariable: 'AWS_SECRET_KEY']]) {
          for (int i=0; i<envNames.size(); i++) {
            sh "tar -C /application/build/${envNames.get(i)} -cf /application/build/${envNames.get(i)}.tar.bz2 ."
            sh "s3-cli put --acl-public --region us-gov-west-1 /application/build/${envNames.get(i)}.tar.bz2 s3://vetsgov-website-builds-s3-upload/${ref}/${envNames.get(i)}.tar.bz2"
          }
        }
      }
    } catch (error) {
      notify()
      throw error
    }
  }

  stage('Review') {
    if (shouldBail()) {
      currentBuild.result = 'ABORTED'
      return
    }

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
      notify()
      throw error
    }
  }

  stage('Deploy dev or staging') {
    try {
      if (!isDeployable()) { return }

      dir("vets-website") {
        script {
          commit = sh(returnStdout: true, script: "git rev-parse HEAD").trim()
        }
      }

      if (IS_DEV_BRANCH) {
        runDeploy('deploys/vets-website-dev', commit)
        runDeploy('deploys/vets-website-vagovdev', commit)
      }

      if (IS_STAGING_BRANCH) {
        runDeploy('deploys/vets-website-staging', commit)
        runDeploy('deploys/vets-website-vagovstaging', commit)
      }
    } catch (error) {
      notify()
      throw error
    }
  }
}
