@Library('va.gov-devops-jenkins-lib') _
import org.kohsuke.github.GitHub

env.CONCURRENCY = 10


node('vetsgov-general-purpose') {
  properties([[$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', daysToKeepStr: '60']],
              parameters([choice(name: "cmsEnvBuildOverride",
                                 description: "Choose an environment to run a content only build. Select 'none' to run the regular pipeline.",
                                 choices: ["none", "dev", "staging"].join("\n"))])]);

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

        /* // Check package.json for known vulnerabilities */
        /* security: { */
        /*   retry(3) { */
        /*     dockerContainer.inside(commonStages.DOCKER_ARGS) { */
        /*       sh "cd /application && npm run security-check" */
        /*     } */
        /*   } */
        /* }, */

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

  commonStages.prearchive(dockerContainer)

  commonStages.archive(dockerContainer, ref);
  commonStages.cacheDrupalContent(dockerContainer);

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
