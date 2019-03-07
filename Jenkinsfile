import org.kohsuke.github.GitHub

env.CONCURRENCY = 10


node('vetsgov-general-purpose') {
  properties([[$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', daysToKeepStr: '60']],
              // a string param cannot be null, so we set the arbitrary value of 'none' here to make sure the default doesn't match anything
              [$class: 'ParametersDefinitionProperty', parameterDefinitions: [[$class: 'StringParameterDefinition', name: 'cmsEnvBuildOverride', defaultValue: 'none']]]]);

  // Checkout vets-website code
  dir("vets-website") {
    checkout scm
    ref = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
  }

  def commonStages = load "vets-website/jenkins/common.groovy"

  // setupStage
  dockerContainer = commonStages.setup()

  stage('Lint|Security|Unit') {
    if (params.cmsEnvBuildOverride != 'none') { return }

    try {
      parallel (
        lint: {
          dockerContainer.inside(commonStages.DOCKER_ARGS) {
            sh "cd /application && npm --no-color run lint"
          }
        },

        // Check package.json for known vulnerabilities
        security: {
          retry(3) {
            dockerContainer.inside(commonStages.DOCKER_ARGS) {
              sh "cd /application && npm run security-check"
            }
          }
        },

        unit: {
          dockerContainer.inside(commonStages.DOCKER_ARGS) {
            sh "cd /application && npm --no-color run test:coverage"
          }
        }
      )
    } catch (error) {
      commonStages.slackNotify()
      throw error
    } finally {
      dir("vets-website") {
        step([$class: 'JUnitResultArchiver', testResults: 'test-results.xml'])
      }
    }
  }

  // Perform a build for each build type
  commonStages.build(ref, dockerContainer, params.cmsEnvBuildOverride != 'none')

  // Run E2E and accessibility tests
  stage('Integration') {
    if (commonStages.shouldBail() || !commonStages.VAGOV_BUILDTYPES.contains('vagovprod')) { return }
    dir("vets-website") {
      try {
        parallel (
          e2e: {
            sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p e2e up -d && docker-compose -p e2e run --rm --entrypoint=npm -e BABEL_ENV=test -e BUILDTYPE=vagovprod vets-website --no-color run nightwatch:docker"
          },

          accessibility: {
            sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p accessibility up -d && docker-compose -p accessibility run --rm --entrypoint=npm -e BABEL_ENV=test -e BUILDTYPE=vagovprod vets-website --no-color run nightwatch:docker -- --env=accessibility"
          }
        )
      } catch (error) {
        commonStages.slackNotify()
        throw error
      } finally {
        sh "docker-compose -p e2e down --remove-orphans"
        sh "docker-compose -p accessibility down --remove-orphans"
        step([$class: 'JUnitResultArchiver', testResults: 'logs/nightwatch/**/*.xml'])
      }
    }
  }

  commonStages.prearchive(dockerContainer)

  commonStages.archive(dockerContainer, ref);

  stage('Review') {
    if (commonStages.shouldBail()) {
      currentBuild.result = 'ABORTED'
      return
    }

    try {
      if (!commonStages.isReviewable()) {
        return
      }
      build job: 'deploys/vets-review-instance-deploy', parameters: [
        stringParam(name: 'devops_branch', value: 'master'),
        stringParam(name: 'api_branch', value: 'master'),
        stringParam(name: 'web_branch', value: env.BRANCH_NAME),
        stringParam(name: 'source_repo', value: 'vets-website'),
      ], wait: false
    } catch (error) {
      commonStages.slackNotify()
      throw error
    }
  }

  stage('Deploy dev or staging') {
    try {
      if (!commonStages.isDeployable()) { return }

      if (commonStages.IS_DEV_BRANCH && commonStages.VAGOV_BUILDTYPES.contains('vagovdev')) {
        commonStages.runDeploy('deploys/vets-website-vagovdev', ref)
      }

      if (commonStages.IS_STAGING_BRANCH && commonStages.VAGOV_BUILDTYPES.contains('vagovstaging')) {
        commonStages.runDeploy('deploys/vets-website-vagovstaging', ref)
      }
    } catch (error) {
      commonStages.slackNotify()
      throw error
    }
  }
}
