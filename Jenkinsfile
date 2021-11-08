@Library('va.gov-devops-jenkins-lib') _
import org.kohsuke.github.GitHub

env.CONCURRENCY = 10

node('vetsgov-general-purpose') {
  properties([[$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', daysToKeepStr: '60']]]);

  // Checkout vets-website code
  dir("vets-website") {
    checkout scm
    ref = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
  }

  def commonStages = load "vets-website/jenkins/common.groovy"

  // setupStage
  dockerContainer = commonStages.setup()

  stage('Main') {
    try {
      parallel (
        failFast: true,

        buildDev: {
          if (commonStages.shouldBail()) { return }
          def envName = 'vagovdev'

          try {
            // Try to build using fresh drupal content
            commonStages.build(ref, dockerContainer, envName)
          } catch (error) {
            commonStages.build(ref, dockerContainer, envName)
          }
        },

        buildStaging: {
          if (commonStages.shouldBail()) { return }
          def envName = 'vagovstaging'

          try {
            // Try to build using fresh drupal content
            commonStages.build(ref, dockerContainer, envName)
          } catch (error) {
            commonStages.build(ref, dockerContainer, envName)
          }
        },

        buildProd: {
          if (commonStages.shouldBail()) { return }
          def envName = 'vagovprod'

          try {
            // Try to build using fresh drupal content
            commonStages.build(ref, dockerContainer, envName)
          } catch (error) {
            commonStages.build(ref, dockerContainer, envName)
          }
        },

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
            sh "/cc-test-reporter before-build"
            if (commonStages.isReviewable()) {
                sh "cd /application && npm --no-color run test:unit -- --coverage --log-level trace"
            } else {
                sh "cd /application && npm --no-color run test:unit -- --coverage"
            }
            sh "cd /application && /cc-test-reporter after-build -r fe4a84c212da79d7bb849d877649138a9ff0dbbef98e7a84881c97e1659a2e24"
          }
        },

        reviewInstance: {
          if (commonStages.shouldBail()) { return }

          try {
            if (!commonStages.isReviewable()) {
              return
            }
            build job: 'deploys/vets-review-instance-deploy', parameters: [
              stringParam(name: 'devops_branch', value: 'master'),
              stringParam(name: 'api_branch', value: env.BRANCH_NAME),
              stringParam(name: 'web_branch', value: env.BRANCH_NAME),
              stringParam(name: 'content_branch', value: env.BRANCH_NAME),
              stringParam(name: 'source_repo', value: 'vets-website'),
            ], wait: false
          } catch (error) {
            commonStages.slackNotify()
            throw error
          }
        },

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

  // Run E2E tests
  stage('Integration') {
    if (commonStages.shouldBail() || !commonStages.VAGOV_BUILDTYPES.contains('vagovprod')) { return }
    dir("vets-website") {
      // Set timeout of 60 minutes for integration tests
      timeout(60) {
        try {
          parallel (
            failFast: true,
            'cypress-1': {
              sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p cypress-${env.EXECUTOR_NUMBER} up -d && docker-compose -p cypress-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e CI=true -e STEP=0 vets-website run cy:test:docker"
            },
            'cypress-2': {
              sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p cypress2-${env.EXECUTOR_NUMBER} up -d && docker-compose -p cypress2-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e CI=true -e STEP=1 vets-website run cy:test:docker"
            },
            'cypress-3': {
              sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p cypress3-${env.EXECUTOR_NUMBER} up -d && docker-compose -p cypress3-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e CI=true -e STEP=2 vets-website run cy:test:docker"
            },
            'cypress-4': {
              sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p cypress4-${env.EXECUTOR_NUMBER} up -d && docker-compose -p cypress4-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e CI=true -e STEP=3 vets-website run cy:test:docker"
            },
            'cypress-5': {
              sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p cypress5-${env.EXECUTOR_NUMBER} up -d && docker-compose -p cypress5-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e CI=true -e STEP=4 vets-website run cy:test:docker"
            },
            'cypress-6': {
              sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p cypress6-${env.EXECUTOR_NUMBER} up -d && docker-compose -p cypress6-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e CI=true -e STEP=5 vets-website run cy:test:docker"
            }
          )
        } catch (error) {
          commonStages.slackNotify()
          throw error
        } finally {
          sh "docker-compose -p cypress-${env.EXECUTOR_NUMBER} down --remove-orphans"
          sh "docker-compose -p cypress2-${env.EXECUTOR_NUMBER} down --remove-orphans"
          sh "docker-compose -p cypress3-${env.EXECUTOR_NUMBER} down --remove-orphans"
          sh "docker-compose -p cypress4-${env.EXECUTOR_NUMBER} down --remove-orphans"
          sh "docker-compose -p cypress5-${env.EXECUTOR_NUMBER} down --remove-orphans"
          sh "docker-compose -p cypress6-${env.EXECUTOR_NUMBER} down --remove-orphans"
        }
      }
    }
  }

  // commonStages.archiveAll(dockerContainer, ref);
}
