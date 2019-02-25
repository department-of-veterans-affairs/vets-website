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

DRUPAL_MAPPING = [
  'dev': 'vagovdev',
  'staging': 'vagovstaging',
  'live': 'vagovprod',
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
  properties([[$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', daysToKeepStr: '60']],
              // a string param cannot be null, so we set the arbitrary value of 'none' here to make sure the default doesn't match anything
              [$class: 'ParametersDefinitionProperty', parameterDefinitions: [[$class: 'StringParameterDefinition', name: 'cmsEnv', defaultValue: 'none']]]]);

  def dockerImage, args, ref, imageTag
  def cmsEnv = params.get('cmsEnv', 'none')
	def buildUtil = load "Jenkinsfile.build";
	def dockerArgs = "-v ${WORKSPACE}/vets-website:/application -v ${WORKSPACE}/vagov-content:/vagov-content"
	def dockerTag = "vets-website:" + java.net.URLDecoder.decode(env.BUILD_TAG).replaceAll("[^A-Za-z0-9\\-\\_]", "-")
	def ref = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
	
	// setupStage
	buildUtil.setup(ref, dockerTag, dockerArgs)

  stage('Lint|Security|Unit') {
    if (cmsEnv != 'none') { return }

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

	def assetSource = (cmsEnv != 'none' && cmsEnv != 'live') ? ref : 'local'
	buildUtil.build(assetSource, ref)
	
  // Run E2E and accessibility tests
  stage('Integration') {
    if (shouldBail() || !VAGOV_BUILDTYPES.contains('vagovprod')) { return }
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


	buildUtil.prearchive(dockerTag, dockerArgs, envName)

	buildUtil.archive(dockerImage, dockerArgs, ref);

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

      if (IS_DEV_BRANCH && VAGOV_BUILDTYPES.contains('vagovdev')) {
        runDeploy('deploys/vets-website-dev', commit)
        runDeploy('deploys/vets-website-vagovdev', commit)
      }

      if (IS_STAGING_BRANCH && VAGOV_BUILDTYPES.contains('vagovstaging')) {
        runDeploy('deploys/vets-website-staging', commit)
        runDeploy('deploys/vets-website-vagovstaging', commit)
      }
    } catch (error) {
      notify()
      throw error
    }
  }
}
