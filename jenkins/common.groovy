import groovy.json.JsonSlurper

DRUPAL_MAPPING = [
  'dev': 'vagovdev',
  'staging': 'vagovstaging',
  'prod': 'vagovprod',
]

DRUPAL_ADDRESSES = [
  'vagovdev'    : 'http://internal-dsva-vagov-dev-cms-812329399.us-gov-west-1.elb.amazonaws.com',
  'vagovstaging': 'http://internal-dsva-vagov-staging-cms-1188006.us-gov-west-1.elb.amazonaws.com',
  'vagovprod'   : 'http://internal-dsva-vagov-prod-cms-2000800896.us-gov-west-1.elb.amazonaws.com',
  // This is a Tugboat URL, rebuilt frequently from PROD CMS. See https://tugboat.vfs.va.gov/6042f35d6a89945fd6399dc3.
  // If there are issues with this endpoint, please post in #cms-support Slack and tag @CMS DevOps Engineers.
  'sandbox'     : 'https://cms-vets-website-branch-builds-lo9uhqj18nwixunsjadvjsynuni7kk1u.ci.cms.va.gov',
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
          sh "cd /application && yarn install --frozen-lockfile --production=false"
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
  def brokenLinksFile = "${WORKSPACE}/vets-website/logs/${envName}-broken-links.json"

  if (fileExists(brokenLinksFile)) {
    def rawJsonFile = readFile(brokenLinksFile);
    def jsonSlurper = new JsonSlurper();
    def brokenLinks = jsonSlurper.parseText(rawJsonFile);
    def maxBrokenLinks = 10
    def color = 'warning'

    if (brokenLinks.isHomepageBroken || brokenLinks.brokenLinksCount > maxBrokenLinks) {
      color = 'danger'
    }

    def heading = "@cmshelpdesk ${brokenLinks.brokenLinksCount} broken links found in the `${envName}` build on `${env.BRANCH_NAME}`\n\n${env.RUN_DISPLAY_URL}\n\n"
    def message = "${heading}\n${brokenLinks.summary}".stripMargin()

    echo "${brokenLinks.brokenLinksCount} broken links found"
    echo message

    if (!IS_PROD_BRANCH && !contentOnlyBuild) {
      // Ignore the results of the broken link checker unless
      // we are running either on the master branch or during
      // a Content Release. This way, if there is a broken link,
      // feature branches aren't affected, so VFS teams can
      // continue merging.
      return;
    }

    // JSONObjects in Groovy are not serializable by default, which is an issue, because
    // a Jenkinsfile has to be fully serializable for it to be able to pause state.
    // To get around this, we unset our reference to the brokenLinks JSON file
    // once we're done with it. It's important that we do this before slackSend, which
    // is likely causes this pipeline to pause while waiting for the message to complete.
    brokenLinks = null

    slackSend(
      message: message,
      color: color,
      failOnError: true,
      channel: 'cms-helpdesk-bot'
    )

    if (color == 'danger') {
      throw new Exception('Broken links found')
    }
  }
}

def build(String ref, dockerContainer, String assetSource, String envName, Boolean useCache, Boolean contentOnlyBuild) {
  // Use the CMS's Sandbox (Tugboat) environment for all branches that
  // are not configured to deploy to dev/staging/prod. Currently, this
  // means to use the CMS Sandbox for any branch that is NOT master.
  def drupalAddress = DRUPAL_ADDRESSES.get('sandbox')
  def drupalCred = DRUPAL_CREDENTIALS.get('vagovprod')
  def drupalMode = useCache ? '' : '--pull-drupal'
  def drupalMaxParallelRequests = 15
  def noDrupalProxy = '--no-drupal-proxy'

  if (IS_DEV_BRANCH || IS_STAGING_BRANCH || IS_PROD_BRANCH || contentOnlyBuild) {
    drupalAddress = DRUPAL_ADDRESSES.get('vagovprod')
    noDrupalProxy = ''
  }

  withCredentials([usernamePassword(credentialsId:  "${drupalCred}", usernameVariable: 'DRUPAL_USERNAME', passwordVariable: 'DRUPAL_PASSWORD')]) {
    dockerContainer.inside(DOCKER_ARGS) {
      def buildLogPath = "/application/${envName}-build.log"

      sh "cd /application && jenkins/build.sh --envName ${envName} --assetSource ${assetSource} --drupalAddress ${drupalAddress} --drupalMaxParallelRequests ${drupalMaxParallelRequests} ${drupalMode} ${noDrupalProxy} --buildLog ${buildLogPath} --verbose"

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
        // Skip caching Drupal content for vagovdev since we aren't pulling and building content for that environment.
        // vagovdev's Drupal cache is created and uploaded in the content-build repo. This prevents overwriting vagovdev's
        // Drupal cache file with an empty file.
        if(envName != "vagovdev") {
          if (!envUsedCache[envName]) {
            dockerContainer.inside(DOCKER_ARGS) {
              sh "cd /application && node script/drupal-aws-cache.js --buildtype=${envName}"
            }
          } else {
            slackCachedContent(envName)
            // TODO: Read the envName-output.log and send that into the Slack message
          }
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
