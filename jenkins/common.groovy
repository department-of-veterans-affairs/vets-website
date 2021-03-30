DRUPAL_MAPPING = [
  'dev': 'vagovdev',
  'staging': 'vagovstaging',
  'prod': 'vagovprod',
]

DRUPAL_ADDRESSES = [
  'vagovdev'    : 'http://internal-dsva-vagov-dev-cms-812329399.us-gov-west-1.elb.amazonaws.com',
  'vagovstaging': 'http://internal-dsva-vagov-staging-cms-1188006.us-gov-west-1.elb.amazonaws.com',
  'vagovprod'   : 'http://internal-dsva-vagov-prod-cms-2000800896.us-gov-west-1.elb.amazonaws.com',
]

DRUPAL_CREDENTIALS = [
  'vagovdev'    : 'drupal-dev',
  'vagovstaging': 'drupal-staging',
  'vagovprod'   : 'drupal-prod',
]

ALL_VAGOV_BUILDTYPES = [
  'vagovdev',
  'vagovstaging',
  'vagovprod'
]

BUILD_TYPE_OVERRIDE = DRUPAL_MAPPING.get(params.cmsEnvBuildOverride, null)

VAGOV_BUILDTYPES = BUILD_TYPE_OVERRIDE ? [BUILD_TYPE_OVERRIDE] : ALL_VAGOV_BUILDTYPES

DEV_BRANCH = 'master'
STAGING_BRANCH = 'master'
PROD_BRANCH = 'master'

IS_DEV_BRANCH = env.BRANCH_NAME == DEV_BRANCH
IS_STAGING_BRANCH = env.BRANCH_NAME == STAGING_BRANCH
IS_PROD_BRANCH = env.BRANCH_NAME == PROD_BRANCH

DOCKER_ARGS = "-v ${WORKSPACE}/vets-website:/application -v ${WORKSPACE}/vagov-content:/vagov-content --ulimit nofile=8192:8192"
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

def slackCachedContent(envName) {
  message = "vets-website built with cached Drupal data for ${envName}. |${env.RUN_DISPLAY_URL}".stripMargin()
  slackSend message: message,
    color: 'warning',
    failOnError: true
}

def setup() {
  stage("Setup") {

    dir("vagov-content") {
      checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'CloneOption', noTags: true, reference: '', shallow: true]], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'va-bot', url: 'git@github.com:department-of-veterans-affairs/vagov-content.git']]]
    }

    dir("vets-website") {
      sh "mkdir -p build"
      sh "mkdir -p logs/selenium"
      sh "mkdir -p coverage"
      sh "mkdir -p temp"

      dockerImage = docker.build(DOCKER_TAG)
      retry(5) {
        dockerImage.inside(DOCKER_ARGS) {
          sh "cd /application && yarn install --production=false"
        }
      }
      return dockerImage
    }
  }
}


/**
 * Searches the build log for missing query flags ands sends a notification
 * to Slack if any are found.
 *
 * NOTE: This function is meant to be called from within the
 * dockerContainer.inside() context so buildLog can point to the right file.
 */
def findMissingQueryFlags(String buildLogPath, String envName) {
  def missingFlags = sh(returnStdout: true, script: "sed -nr 's/Could not find query flag (.+)\\..+/\\1/p' ${buildLogPath} | sort | uniq")
  if (missingFlags) {
    slackSend message: "Missing query flags found in the ${envName} build on `${env.BRANCH_NAME}`. The following will flags be considered false:\n${missingFlags}",
      color: 'warning',
      failOnError: true,
      channel: 'cms-team'
  }
}

def accessibilityTests() {

  if (shouldBail() || !VAGOV_BUILDTYPES.contains('vagovprod')) { return }
  
  stage("Accessibility") {

     slackSend(
        message: "Starting the daily accessibility scan of vets-website... ${env.RUN_DISPLAY_URL}".stripMargin(),
        color: 'good',
        channel: '-daily-accessibility-scan'
      )

    dir("vets-website") {
      try {
        parallel (
          'nightwatch-accessibility': {
            sh "export IMAGE_TAG=${IMAGE_TAG} && docker-compose -p accessibility up -d && docker-compose -p accessibility run --rm --entrypoint=npm -e BABEL_ENV=test -e BUILDTYPE=vagovprod vets-website --no-color run nightwatch:docker -- --env=accessibility"
          },
        )

        slackSend(
          message: 'The daily accessibility scan has completed successfully.',
          color: 'good',
          channel: '-daily-accessibility-scan'
        )

      } catch (error) {

        slackSend(
            message: "@here Daily accessibility tests have failed. ${env.RUN_DISPLAY_URL}".stripMargin(),
            color: 'danger',
            failOnError: true,
            channel: '-daily-accessibility-scan'
          )

        throw error
      } finally {
        sh "docker-compose -p accessibility down --remove-orphans"
        step([$class: 'JUnitResultArchiver', testResults: 'logs/nightwatch/**/*.xml'])
      }
    }

  }
}

def checkForBrokenLinks(String buildLogPath, String envName, Boolean contentOnlyBuild) {
  // Look for broken links
  def csvFileName = "${envName}-broken-links.csv" // For use within the docker container
  def csvFile = "${WORKSPACE}/vets-website/${csvFileName}" // For use outside of the docker context

  // Ensure the file isn't there if we had to rebuild
  if (fileExists(csvFile)) {
    sh "rm /application/${csvFileName}"
  }

  // Output a csv file with the broken links
  sh "cd /application && jenkins/glean-broken-links.sh ${buildLogPath} ${csvFileName}"
  if (fileExists(csvFile)) {
    echo "Found broken links."

    // Only break the build if broken links are found in master
    if (IS_PROD_BRANCH || contentOnlyBuild) {
      echo "Notifying Slack channel."

      // slackUploadFile(filePath: csvFile, channel: 'dev_null', failOnError: true, initialComment: "Found broken links in the ${envName} build on `${env.BRANCH_NAME}`.")

      // Until slackUploadFile works...
      def brokenLinks = readFile(csvFile)
      def brokenLinksCount = sh(returnStdout: true, script: "wc -l /application/${csvFileName} | cut -d ' ' -f1") as Integer
      def brokenLinksMessage = "${brokenLinksCount} broken links found in the `${envName}` build on `${env.BRANCH_NAME}`\n@cmshelpdesk\n${env.RUN_DISPLAY_URL}\n${brokenLinks}".stripMargin()

      slackSend(
        message: brokenLinksMessage,
        color: 'danger',
        failOnError: true,
        channel: 'cms-helpdesk-bot'
        // attachments: brokenLinks
        // TODO: errors out with ERROR: Slack notification failed with exception: net.sf.json.JSONException: Invalid JSON String
        // needs to be formatted into JSON
        // see also: https://stackoverflow.com/a/51556653/2043808
      )

      // TODO: Move this slackUploadFile to cacheDrupalContent and update the echo statement above
      // TODO: determine correct file path relative to agent's workspace
      // see also: https://github.com/jenkinsci/slack-plugin/issues/667#issuecomment-585982716
      // slackUploadFile(
      //   filePath: csvFile,
      //   channel: 'cms-team',
      //   initialComment: brokenLinksMessage
      // )


      throw new Exception('Broken links found')
    }
  } else {
    echo "Did not find broken links."
  }
}

def build(String ref, dockerContainer, String assetSource, String envName, Boolean useCache, Boolean contentOnlyBuild) {
  // Use Drupal prod for all environments
  def drupalAddress = DRUPAL_ADDRESSES.get('vagovprod')
  def drupalCred = DRUPAL_CREDENTIALS.get('vagovprod')
  def drupalMode = useCache ? '' : '--pull-drupal'
  def drupalMaxParallelRequests = 5;

  if (contentOnlyBuild) {
    drupalMaxParallelRequests = 15
  }

  withCredentials([usernamePassword(credentialsId:  "${drupalCred}", usernameVariable: 'DRUPAL_USERNAME', passwordVariable: 'DRUPAL_PASSWORD')]) {
    dockerContainer.inside(DOCKER_ARGS) {
      def buildLogPath = "/application/${envName}-build.log"

      sh "cd /application && jenkins/build.sh --envName ${envName} --assetSource ${assetSource} --drupalAddress ${drupalAddress} --drupalMaxParallelRequests ${drupalMaxParallelRequests} ${drupalMode} --buildLog ${buildLogPath} --verbose"

      if (envName == 'vagovprod') {
        // Find any broken links in the log
        checkForBrokenLinks(buildLogPath, envName, contentOnlyBuild)
        // Find any missing query flags in the log
        findMissingQueryFlags(buildLogPath, envName)
      }
    }
  }
}

def buildAll(String ref, dockerContainer, Boolean contentOnlyBuild) {
  stage("Build") {
    if (shouldBail()) { return }

    try {
      def builds = [:]
      def envUsedCache = [:]
      def assetSource = contentOnlyBuild ? ref : 'local'

      for (int i=0; i<VAGOV_BUILDTYPES.size(); i++) {
        def envName = VAGOV_BUILDTYPES.get(i)
        builds[envName] = {
          try {
            build(ref, dockerContainer, assetSource, envName, false, contentOnlyBuild)
            envUsedCache[envName] = false
          } catch (error) {
            // We're not using the cache for content only builds, because requesting
            // a content only build is an attempt to refresh content from the current set
            if (!contentOnlyBuild) {
              dockerContainer.inside(DOCKER_ARGS) {
                sh "cd /application && node script/drupal-aws-cache.js --fetch --buildtype=${envName}"
              }
              build(ref, dockerContainer, assetSource, envName, true, contentOnlyBuild)
              envUsedCache[envName] = true
            } else {
              build(ref, dockerContainer, assetSource, envName, false, contentOnlyBuild)
              envUsedCache[envName] = false
            }
          }
        }
      }

      parallel builds
      return envUsedCache
    } catch (error) {
      slackNotify()
      throw error
    }
  }
}

def prearchive(dockerContainer, envName) {
  dockerContainer.inside(DOCKER_ARGS) {
    sh "cd /application && node script/prearchive.js --buildtype=${envName}"
  }
}

def prearchiveAll(dockerContainer) {
  stage("Prearchive Optimizations") {
    if (shouldBail()) { return }

    try {
      def builds = [:]

      for (int i=0; i<VAGOV_BUILDTYPES.size(); i++) {
        def envName = VAGOV_BUILDTYPES.get(i)

        builds[envName] = {
          prearchive(dockerContainer, envName)
        }
      }

      parallel builds
    } catch (error) {
      slackNotify()
      throw error
    }
  }
}

def archive(dockerContainer, String ref, String envName) {
  def long buildtime = System.currentTimeMillis() / 1000L;
  def buildDetails = buildDetails(envName, ref, buildtime)

  dockerContainer.inside(DOCKER_ARGS) {
    withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'vetsgov-website-builds-s3-upload',
                     usernameVariable: 'AWS_ACCESS_KEY', passwordVariable: 'AWS_SECRET_KEY']]) {
      sh "echo \"${buildDetails}\" > /application/build/${envName}/BUILD.txt"
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

def cacheDrupalContent(dockerContainer, envUsedCache) {
  stage("Cache Drupal Content") {
    if (!isDeployable()) { return }

    try {
      def archives = [:]

      for (int i=0; i<VAGOV_BUILDTYPES.size(); i++) {
        def envName = VAGOV_BUILDTYPES.get(i)

        if (!envUsedCache[envName]) {
          dockerContainer.inside(DOCKER_ARGS) {
            sh "cd /application && node script/drupal-aws-cache.js --buildtype=${envName}"
          }
        } else {
          slackCachedContent(envName)
          // TODO: Read the envName-output.log and send that into the Slack message
        }
      }

      dockerContainer.inside(DOCKER_ARGS) {
        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'vetsgov-website-builds-s3-upload',
                         usernameVariable: 'AWS_ACCESS_KEY', passwordVariable: 'AWS_SECRET_KEY']]) {
          sh "aws s3 sync /application/.cache/content s3://vetsgov-website-builds-s3-upload/content/ --acl public-read --region us-gov-west-1 --quiet"
        }
      }
    } catch (error) {
      slackNotify()
      throw error
    }
  }
}

return this;
