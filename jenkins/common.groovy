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

DOCKER_ARGS = "-v ${WORKSPACE}/vets-website:/application -v ${WORKSPACE}/vagov-content:/vagov-content -v ${WORKSPACE}/content-build:/content-build --ulimit nofile=8192:8192"
IMAGE_TAG = java.net.URLDecoder.decode(env.BUILD_TAG).replaceAll("[^A-Za-z0-9\\-\\_]", "-")
DOCKER_TAG = "vets-website:" + IMAGE_TAG

def isReviewable() {
  return !IS_DEV_BRANCH && !IS_STAGING_BRANCH && !IS_PROD_BRANCH
}

def isDeployable() {
  return (IS_DEV_BRANCH ||
          IS_STAGING_BRANCH) &&
    !env.CHANGE_TARGET &&
    !currentBuild.nextBuild // if there's a later build on this job (branch), don't deploy
}

def shouldBail() {
  // abort the job if we're not on deployable branch (usually master) and there's a newer build going now
  return !IS_DEV_BRANCH &&
    !IS_STAGING_BRANCH &&
    !IS_PROD_BRANCH &&
    !env.CHANGE_TARGET &&
    currentBuild.nextBuild
}

def runDeploy(String jobName, String ref, boolean waitForDeploy) {
  build job: jobName, parameters: [
    booleanParam(name: 'notify_slack', value: true),
    stringParam(name: 'ref', value: ref),
  ], wait: waitForDeploy
}

def buildDetails(String buildtype, String ref, Long buildtime) {
  return """\
BUILDTYPE=${buildtype}
NODE_ENV=production
BRANCH_NAME=${env.BRANCH_NAME}
CHANGE_TARGET=${env.CHANGE_TARGET}
BUILD_ID=${env.BUILD_ID}
BUILD_NUMBER=${env.BUILD_NUMBER}
REF=${ref}
BUILDTIME=${buildtime}
"""
}

def slackNotify() {
  if (IS_DEV_BRANCH || IS_STAGING_BRANCH || IS_PROD_BRANCH) {
    message = "vets-website ${env.BRANCH_NAME} branch CI failed. |${env.RUN_DISPLAY_URL}".stripMargin()
    slackSend message: message,
      color: 'danger',
      failOnError: true
  }
}

def slackIntegrationNotify() {
  message = "(Testing): integration tests failed. |${env.RUN_DISPLAY_URL}".stripMargin()
  slackSend message: message,
    color: 'danger',
    failOnError: true
}

def setup() {
  stage("Setup") {

    dir("vagov-content") {
      checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'CloneOption', noTags: true, reference: '', shallow: true]], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'va-bot', url: 'git@github.com:department-of-veterans-affairs/vagov-content.git']]]
    }

    dir("content-build") {
      checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'CloneOption', noTags: true, reference: '', shallow: true]], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'va-bot', url: 'git@github.com:department-of-veterans-affairs/content-build.git']]]
    }

    dir("vets-website") {
      sh "mkdir -p build"
      sh "mkdir -p coverage"
      sh "mkdir -p temp"

      dockerImage = docker.build(DOCKER_TAG)
      retry(5) {
        dockerImage.inside(DOCKER_ARGS) {
          sh "cd /application && yarn install --frozen-lockfile --production=false"
        }
      }
      return dockerImage
    }
  }
}

def build(String ref, dockerContainer, String envName) {
  dockerContainer.inside(DOCKER_ARGS) {
    def buildLogPath = "/application/${envName}-build.log"

    sh "cd /application && jenkins/build.sh --envName ${envName} --buildLog ${buildLogPath} --verbose"
  }
}

def archive(dockerContainer, String ref, String envName) {
  def long buildtime = System.currentTimeMillis() / 1000L;
  def buildDetails = buildDetails(envName, ref, buildtime)

  dockerContainer.inside(DOCKER_ARGS) {
    withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'vetsgov-website-builds-s3-upload',
                     usernameVariable: 'AWS_ACCESS_KEY', passwordVariable: 'AWS_SECRET_KEY']]) {
      sh "echo \"${buildDetails}\" > /application/build/${envName}/BUILD.txt"

      sh "cd /application && yarn test:coverage-only"
      sh "node /application/script/app-coverage-report.js"
      sh "cp /application/coverage/test-coverage-report.json /application/build/${envName}/test-coverage-report.json"

      if(envName == 'vagovdev' || envName == 'vagovstaging') {
        sh "tar -C /application/build/${envName} -cf /application/build/apps.${envName}.tar.bz2 ."
        sh "aws s3 cp /application/build/apps.${envName}.tar.bz2 s3://vetsgov-website-builds-s3-upload/application-build/${ref}/${envName}.tar.bz2 --acl public-read --region us-gov-west-1 --quiet"
      }
      sh "tar -C /application/build/${envName} -cf /application/build/${envName}.tar.bz2 ."
      sh "aws s3 cp /application/build/${envName}.tar.bz2 s3://vetsgov-website-builds-s3-upload/${ref}/${envName}.tar.bz2 --acl public-read --region us-gov-west-1 --quiet"
    }
  }
}

def archiveAll(dockerContainer, String ref) {
  stage("Archive") {
    if (shouldBail()) { return }

    try {
      def archives = [:]

      for (int i=0; i<VAGOV_BUILDTYPES.size(); i++) {
        def envName = VAGOV_BUILDTYPES.get(i)

        archives[envName] = {
          archive(dockerContainer, ref, envName)
        }
      }

      parallel archives

    } catch (error) {
      slackNotify()
      throw error
    }
  }
}

return this;
