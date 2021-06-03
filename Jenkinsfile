@Library('va.gov-devops-jenkins-lib') _
import org.kohsuke.github.GitHub

env.CONCURRENCY = 10

node('vetsgov-general-purpose') {
  properties([[$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', daysToKeepStr: '60']],
              parameters([booleanParam(name: "cancelBuild",
                                       defaultValue: true,
                                       description: "Hack to cancel the run triggered by webhook")])]);

  stage('Cancel') {
    if (params.cancelBuild) {
      currentBuild.result = 'ABORTED'
      error("Aborting run triggered by webhook. Please wait for the run triggered by the GitHub Actions workflow.");
    }
  }

  // Checkout vets-website code
  dir("vets-website") {
    checkout scm
    ref = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
  }

  def commonStages = load "vets-website/jenkins/common.groovy"

  // setupStage
  dockerContainer = commonStages.setup()

  stage('Review instance') {
    if (commonStages.shouldBail()) { return }

    try {
      if (!commonStages.isReviewable()) {
        return
      }
      build job: 'deploys/vets-review-instance-deploy', parameters: [
        stringParam(name: 'devops_branch', value: 'master'),
        stringParam(name: 'api_branch', value: 'master'),
        stringParam(name: 'web_branch', value: env.BRANCH_NAME),
        stringParam(name: 'content_branch', value: env.BRANCH_NAME),
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
        commonStages.runDeploy('deploys/application-build-vagovdev', ref, false)
        commonStages.runDeploy('deploys/vets-website-vagovdev', ref, false)
      }

      if (commonStages.IS_STAGING_BRANCH && commonStages.VAGOV_BUILDTYPES.contains('vagovstaging')) {
        commonStages.runDeploy('deploys/application-build-vagovstaging', ref, false)
        commonStages.runDeploy('deploys/vets-website-vagovstaging', ref, false)
      }

    } catch (error) {
      commonStages.slackNotify()
      throw error
    }
  }
}
