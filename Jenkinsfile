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
  def envUsedCache = [:]

  // setupStage
  dockerContainer = commonStages.setup()

  stage('Main') {
    def contentOnlyBuild = params.cmsEnvBuildOverride != 'none'
    def assetSource = contentOnlyBuild ? ref : 'local'

    try {
      parallel (
        failFast: true,

        buildDev: {
          if (commonStages.shouldBail()) { return }
          envName = 'vagovdev'
          
          shouldBuild = !contentOnlyBuild || envName == params.cmsEnvBuildOverride
          if (!shouldBuild) { return }

          try {
            commonStages.build(ref, dockerContainer, assetSource, envName, false, contentOnlyBuild)
            envUsedCache[envName] = false
          } catch (error) {
            if (!contentOnlyBuild) {
              dockerContainer.inside(DOCKER_ARGS) {
                sh "cd /application && node script/drupal-aws-cache.js --fetch --buildtype=${envName}"
              }
              commonStages.build(ref, dockerContainer, assetSource, envName, true, contentOnlyBuild)
              envUsedCache[envName] = true
            } else {
              commonStages.build(ref, dockerContainer, assetSource, envName, false, contentOnlyBuild)
              envUsedCache[envName] = false
            }
          }
        },

        buildStaging: {
          if (commonStages.shouldBail()) { return }
          envName = 'vagovstaging'

          shouldBuild = !contentOnlyBuild || envName == params.cmsEnvBuildOverride
          if (!shouldBuild) { return }

          try {
            commonStages.build(ref, dockerContainer, assetSource, envName, false, contentOnlyBuild)
            envUsedCache[envName] = false
          } catch (error) {
            if (!contentOnlyBuild) {
              dockerContainer.inside(DOCKER_ARGS) {
                sh "cd /application && node script/drupal-aws-cache.js --fetch --buildtype=${envName}"
              }
              commonStages.build(ref, dockerContainer, assetSource, envName, true, contentOnlyBuild)
              envUsedCache[envName] = true
            } else {
              commonStages.build(ref, dockerContainer, assetSource, envName, false, contentOnlyBuild)
              envUsedCache[envName] = false
            }
          }
        },

        buildProd: {
          if (commonStages.shouldBail()) { return }
          envName = 'vagovprod'

          shouldBuild = !contentOnlyBuild || envName == params.cmsEnvBuildOverride
          if (!shouldBuild) { return }
                    
          try {
            commonStages.build(ref, dockerContainer, assetSource, envName, false, contentOnlyBuild)
            envUsedCache[envName] = false
          } catch (error) {
            if (!contentOnlyBuild) {
              dockerContainer.inside(DOCKER_ARGS) {
                sh "cd /application && node script/drupal-aws-cache.js --fetch --buildtype=${envName}"
              }
              commonStages.build(ref, dockerContainer, assetSource, envName, true, contentOnlyBuild)
              envUsedCache[envName] = true
            } else {
              commonStages.build(ref, dockerContainer, assetSource, envName, false, contentOnlyBuild)
              envUsedCache[envName] = false
            }
          }
        },

        lint: {
          if (params.cmsEnvBuildOverride != 'none') { return }
          dockerContainer.inside(commonStages.DOCKER_ARGS) {
            sh "cd /application && npm --no-color run lint"
          }
        },

        // Check package.json for known vulnerabilities
        security: {
          if (params.cmsEnvBuildOverride != 'none') { return }
          retry(3) {
            dockerContainer.inside(commonStages.DOCKER_ARGS) {
              sh "cd /application && npm run security-check"
            }
          }
        },

        unit: {
          if (params.cmsEnvBuildOverride != 'none') { return }
          dockerContainer.inside(commonStages.DOCKER_ARGS) {
            sh "/cc-test-reporter before-build"
            sh "cd /application && npm --no-color run test:unit -- --coverage"
            sh "cd /application && /cc-test-reporter after-build -r fe4a84c212da79d7bb849d877649138a9ff0dbbef98e7a84881c97e1659a2e24"
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
      try {
        if (commonStages.IS_PROD_BRANCH && commonStages.VAGOV_BUILDTYPES.contains('vagovprod')) {
          parallel (
            failFast: true,

            'nightwatch-e2e': {
              sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p nightwatch-${env.EXECUTOR_NUMBER} up -d && docker-compose -p nightwatch-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e BABEL_ENV=test -e BUILDTYPE=vagovprod vets-website --no-color run nightwatch:docker"
            },     
            // 'nightwatch-accessibility': {
            //     sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p accessibility up -d && docker-compose -p accessibility run --rm --entrypoint=npm -e BABEL_ENV=test -e BUILDTYPE=vagovprod vets-website --no-color run nightwatch:docker -- --env=accessibility"
            // },
            cypress: {
              sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p cypress-${env.EXECUTOR_NUMBER} up -d && docker-compose -p cypress-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e CI=true -e NO_COLOR=1 vets-website --no-color run cy:test:docker"
            }
          )
        } else {
          nonce = System.currentTimeMillis()
          steps = 6

          // making sure nonce is set
          echo 'nonce:'
          echo nonce

          // making sure steps is set
          echo 'steps:'
          echo steps

          sh "$PERCY_TOKEN=aws ssm get-parameters --region us-gov-west-1 --names /dsva-vagov/vets-website/common/percy_token_vets-website --query Parameters[0].Value --with-decryption | sed \'s/\"//g\'"
          echo 'PERCY_TOKEN:'
          echo PERCY_TOKEN

          // parallel (
          //   failFast: false,

          //   'nightwatch-e2e': {
          //     sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p nightwatch-${env.EXECUTOR_NUMBER} up -d && docker-compose -p nightwatch-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e BABEL_ENV=test -e BUILDTYPE=vagovprod vets-website --no-color run nightwatch:docker"
          //   },
          //   // i'd like to include PERCY_TOKEN like this if possible:
          //   // 'cypress-1': {
          //   //   sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p cypress-${env.EXECUTOR_NUMBER} up -d && docker-compose -p cypress-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e CI=true -e NO_COLOR=1 -e STEP=0 -e NUM_STEPS=${steps} -e PERCY_PARALLEL_NONCE=${nonce} -e PERCY_TOKEN=${PERCY_TOKEN} vets-website --no-color run cy:test:docker"
          //   // },
          //   'cypress-1': {
          //     sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p cypress-${env.EXECUTOR_NUMBER} up -d && docker-compose -p cypress-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e CI=true -e NO_COLOR=1 -e STEP=0 -e NUM_STEPS=${steps} -e PERCY_PARALLEL_NONCE=${nonce} vets-website --no-color run cy:test:docker"
          //   },
          //   'cypress-2': {
          //     sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p cypress2-${env.EXECUTOR_NUMBER} up -d && docker-compose -p cypress2-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e CI=true -e NO_COLOR=1 -e STEP=1 -e NUM_STEPS=${steps} -e PERCY_PARALLEL_NONCE=${nonce} vets-website --no-color run cy:test:docker"
          //   },
          //   'cypress-3': {
          //     sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p cypress3-${env.EXECUTOR_NUMBER} up -d && docker-compose -p cypress3-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e CI=true -e NO_COLOR=1 -e STEP=2 -e NUM_STEPS=${steps} -e PERCY_PARALLEL_NONCE=${nonce} vets-website --no-color run cy:test:docker"
          //   },
          //   'cypress-4': {
          //     sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p cypress4-${env.EXECUTOR_NUMBER} up -d && docker-compose -p cypress4-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e CI=true -e NO_COLOR=1 -e STEP=3 -e NUM_STEPS=${steps} -e PERCY_PARALLEL_NONCE=${nonce} vets-website --no-color run cy:test:docker"
          //   },
          //   'cypress-5': {
          //     sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p cypress5-${env.EXECUTOR_NUMBER} up -d && docker-compose -p cypress5-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e CI=true -e NO_COLOR=1 -e STEP=4 -e NUM_STEPS=${steps} -e PERCY_PARALLEL_NONCE=${nonce} vets-website --no-color run cy:test:docker"
          //   },
          //   'cypress-6': {
          //     sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p cypress6-${env.EXECUTOR_NUMBER} up -d && docker-compose -p cypress6-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e CI=true -e NO_COLOR=1 -e STEP=5 vets-website --no-color run cy:test:docker"
          //   }
          // )

          parallel (
            failFast: false,

            'nightwatch-e2e': {
              sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p nightwatch-${env.EXECUTOR_NUMBER} up -d && docker-compose -p nightwatch-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e BABEL_ENV=test -e BUILDTYPE=vagovprod vets-website --no-color run nightwatch:docker"
            },     
            'cypress-1': {
              sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p cypress-${env.EXECUTOR_NUMBER} up -d && docker-compose -p cypress-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e CI=true -e NO_COLOR=1 -e STEP=0 vets-website --no-color run cy:test:docker"
            },     
            'cypress-2': {
              sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p cypress2-${env.EXECUTOR_NUMBER} up -d && docker-compose -p cypress2-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e CI=true -e NO_COLOR=1 -e STEP=1 vets-website --no-color run cy:test:docker"
            },
            'cypress-3': {
              sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p cypress3-${env.EXECUTOR_NUMBER} up -d && docker-compose -p cypress3-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e CI=true -e NO_COLOR=1 -e STEP=2 vets-website --no-color run cy:test:docker"
            },
            'cypress-4': {
              sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p cypress4-${env.EXECUTOR_NUMBER} up -d && docker-compose -p cypress4-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e CI=true -e NO_COLOR=1 -e STEP=3 vets-website --no-color run cy:test:docker"
            },
            'cypress-5': {
              sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p cypress5-${env.EXECUTOR_NUMBER} up -d && docker-compose -p cypress5-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e CI=true -e NO_COLOR=1 -e STEP=4 vets-website --no-color run cy:test:docker"
            },
            'cypress-6': {
              sh "export IMAGE_TAG=${commonStages.IMAGE_TAG} && docker-compose -p cypress6-${env.EXECUTOR_NUMBER} up -d && docker-compose -p cypress6-${env.EXECUTOR_NUMBER} run --rm --entrypoint=npm -e CI=true -e NO_COLOR=1 -e STEP=5 vets-website --no-color run cy:test:docker"
            }
          )
        }
      } catch (error) {
        commonStages.slackNotify()
        throw error
      } finally {
        sh "docker-compose -p nightwatch-${env.EXECUTOR_NUMBER} down --remove-orphans"
        // if (commonStages.IS_PROD_BRANCH && commonStages.VAGOV_BUILDTYPES.contains('vagovprod')) {
        //   sh "docker-compose -p accessibility down --remove-orphans"
        // }
        sh "docker-compose -p cypress-${env.EXECUTOR_NUMBER} down --remove-orphans"
        sh "docker-compose -p cypress2-${env.EXECUTOR_NUMBER} down --remove-orphans"
        sh "docker-compose -p cypress3-${env.EXECUTOR_NUMBER} down --remove-orphans"
        sh "docker-compose -p cypress4-${env.EXECUTOR_NUMBER} down --remove-orphans"
        sh "docker-compose -p cypress5-${env.EXECUTOR_NUMBER} down --remove-orphans"
        sh "docker-compose -p cypress6-${env.EXECUTOR_NUMBER} down --remove-orphans"
        step([$class: 'JUnitResultArchiver', testResults: 'logs/nightwatch/**/*.xml'])
      }
    }
  }

  commonStages.prearchiveAll(dockerContainer)

  commonStages.archiveAll(dockerContainer, ref);
  
  envsUsingDrupalCache = envUsedCache
  commonStages.cacheDrupalContent(dockerContainer, envsUsingDrupalCache);

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
