import org.kohsuke.github.GitHub

env.CONCURRENCY = 10


node('vetsgov-general-purpose') {
  properties([[$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', daysToKeepStr: '60']],
              // a string param cannot be null, so we set the arbitrary value of 'none' here to make sure the default doesn't match anything
              [$class: 'ParametersDefinitionProperty', parameterDefinitions: [[$class: 'StringParameterDefinition', name: 'cmsEnv', defaultValue: 'none']]]]);

  checkout scm // shoot

  def buildUtil = load "Jenkinsfile.common";
  def dockerArgs = "-v ${WORKSPACE}/vets-website:/application -v ${WORKSPACE}/vagov-content:/vagov-content"
  def ref = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
  def cmsEnv = params.get('cmsEnv', 'none')

  def imageTag = java.net.URLDecoder.decode(env.BUILD_TAG).replaceAll("[^A-Za-z0-9\\-\\_]", "-")
  def dockerTag = "vets-website:" + imageTag

  
  // setupStage
  buildUtil.setup(ref, dockerTag, dockerArgs)

  stage('Lint|Security|Unit') {
    if (cmsEnv != 'none') { return }

    try {
      parallel (
        lint: {
          docker.image(dockerTag).inside(dockerArgs) {
            sh "cd /application && npm --no-color run lint"
          }
        },

        // Check package.json for known vulnerabilities
        security: {
          retry(3) {
            docker.image(dockerTag).inside(dockerArgs) {
              sh "cd /application && npm run security-check"
            }
          }
        },

        unit: {
          docker.image(dockerTag).inside(dockerArgs) {
            sh "cd /application && npm --no-color run test:coverage"
          }
        }
      )
    } catch (error) {
      buildUtil.slackNotify()
      throw error
    } finally {
      dir("vets-website") {
        step([$class: 'JUnitResultArchiver', testResults: 'test-results.xml'])
      }
    }
  }

  stage('Build: Redirects') {
    if (buildUtil.shouldBail()) { return }

    try {
      def builds = [:]

      for (int i=0; i<buildUtil.VETSGOV_BUILDTYPES.size(); i++) {
        def envName = buildUtil.VETSGOV_BUILDTYPES.get(i)
				def buildDetails = buildUtil.buildDetails(envName, ref)
        builds[envName] = {
          docker.image(dockerTag).inside(dockerArgs) {
            sh "cd /application && npm --no-color run build:redirects -- --buildtype=${envName}"
            sh "cd /application && echo \"${buildDetails}\" > build/${envName}/BUILD.txt"
          }
        }
      }

      parallel builds
    } catch (error) {
      buildUtil.slackNotify()
      throw error
    }
  }

  // Perform a build for each build type

  def assetSource = (cmsEnv != 'none' && cmsEnv != 'live') ? ref : 'local'
  buildUtil.build(ref, dockerTag, dockerArgs)
  
  // Run E2E and accessibility tests
  stage('Integration') {
    if (buildUtil.shouldBail() || !VAGOV_BUILDTYPES.contains('vagovprod')) { return }
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
        buildUtil.slackNotify()
        throw error
      } finally {
        sh "docker-compose -p e2e down --remove-orphans"
        sh "docker-compose -p accessibility down --remove-orphans"
        step([$class: 'JUnitResultArchiver', testResults: 'logs/nightwatch/**/*.xml'])
      }
    }
  }


  buildUtil.prearchive(dockerTag, dockerArgs)

  buildUtil.archive(dockerTag, dockerArgs, ref);

  stage('Review') {
    if (buildUtil.shouldBail()) {
      currentBuild.result = 'ABORTED'
      return
    }

    try {
      if (!buildUtil.isReviewable()) {
        return
      }
      build job: 'deploys/vets-review-instance-deploy', parameters: [
        stringParam(name: 'devops_branch', value: 'master'),
        stringParam(name: 'api_branch', value: 'master'),
        stringParam(name: 'web_branch', value: env.BRANCH_NAME),
        stringParam(name: 'source_repo', value: 'vets-website'),
      ], wait: false
    } catch (error) {
      buildUtil.slackNotify()
      throw error
    }
  }

  stage('Deploy dev or staging') {
    try {
      if (!buildUtil.isDeployable()) { return }

      dir("vets-website") {
        script {
          commit = sh(returnStdout: true, script: "git rev-parse HEAD").trim()
        }
      }

      if (IS_DEV_BRANCH && VAGOV_BUILDTYPES.contains('vagovdev')) {
        buildUtil.runDeploy('deploys/vets-website-dev', commit)
        buildUtil.runDeploy('deploys/vets-website-vagovdev', commit)
      }

      if (IS_STAGING_BRANCH && VAGOV_BUILDTYPES.contains('vagovstaging')) {
        buildUtil.runDeploy('deploys/vets-website-staging', commit)
        buildUtil.runDeploy('deploys/vets-website-vagovstaging', commit)
      }
    } catch (error) {
      buildUtil.slackNotify()
      throw error
    }
  }
}
