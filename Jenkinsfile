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

  // load common stages
  def stages = load "vets-website/jenkins/common.groovy"

  // setupStage
  dockerContainer = stages.setup()

  stage('Lint|Security|Unit') {
    if (params.cmsEnvBuildOverride != 'none') { return }

    try {
      parallel (
        lint: {
          dockerContainer.inside(stages.dockerArgs) {
            sh "cd /application && npm --no-color run lint"
          }
        },

        // Check package.json for known vulnerabilities
        security: {
          retry(3) {
            dockerContainer.inside(stages.dockerArgs) {
              sh "cd /application && npm run security-check"
            }
          }
        },

        unit: {
          dockerContainer.inside(stages.dockerArgs) {
            sh "cd /application && npm --no-color run test:coverage"
          }
        }
      )
    } catch (error) {
      stages.slackNotify()
      throw error
    } finally {
      dir("vets-website") {
        step([$class: 'JUnitResultArchiver', testResults: 'test-results.xml'])
      }
    }
  }

  // Perform a build for each build type
  stages.build(ref, dockerContainer, params.cmsEnvBuildOverride != 'none')

  // Run E2E and accessibility tests
  stage('Integration') {
    if (stages.shouldBail() || !stages.VAGOV_BUILDTYPES.contains('vagovprod')) { return }
    dir("vets-website") {
      try {
        parallel (
          e2e: {
            sh "export IMAGE_TAG=${stages.imageTag} && docker-compose -p e2e up -d && docker-compose -p e2e run --rm --entrypoint=npm -e BABEL_ENV=test -e BUILDTYPE=vagovprod vets-website --no-color run nightwatch:docker"
          },

          accessibility: {
            sh "export IMAGE_TAG=${stages.imageTag} && docker-compose -p accessibility up -d && docker-compose -p accessibility run --rm --entrypoint=npm -e BABEL_ENV=test -e BUILDTYPE=vagovprod vets-website --no-color run nightwatch:docker -- --env=accessibility"
          }
        )
      } catch (error) {
        stages.slackNotify()
        throw error
      } finally {
        sh "docker-compose -p e2e down --remove-orphans"
        sh "docker-compose -p accessibility down --remove-orphans"
        step([$class: 'JUnitResultArchiver', testResults: 'logs/nightwatch/**/*.xml'])
      }
    }
  }

  stages.prearchive(dockerContainer)

  stages.archive(dockerContainer, ref);

  stage('Review') {
    if (stages.shouldBail()) {
      currentBuild.result = 'ABORTED'
      return
    }

    try {
      if (!stages.isReviewable()) {
        return
      }
      build job: 'deploys/vets-review-instance-deploy', parameters: [
        stringParam(name: 'devops_branch', value: 'master'),
        stringParam(name: 'api_branch', value: 'master'),
        stringParam(name: 'web_branch', value: env.BRANCH_NAME),
        stringParam(name: 'source_repo', value: 'vets-website'),
      ], wait: false
    } catch (error) {
      stages.slackNotify()
      throw error
    }
  }

  stage('Deploy dev or staging') {
    try {
      if (!stages.isDeployable()) { return }

      if (stagess.IS_DEV_BRANCH && stagess.VAGOV_BUILDTYPES.contains('vagovdev')) {
        stages.runDeploy('deploys/vets-website-dev', ref)
        stages.runDeploy('deploys/vets-website-vagovdev', ref)
      }

      if (stagess.IS_STAGING_BRANCH && stagess.VAGOV_BUILDTYPES.contains('vagovstaging')) {
        stages.runDeploy('deploys/vets-website-staging', ref)
        stages.runDeploy('deploys/vets-website-vagovstaging', ref)
      }
    } catch (error) {
      stages.slackNotify()
      throw error
    }
  }
}
