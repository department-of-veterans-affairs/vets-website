import org.kohsuke.github.GitHub

def envNames = [
  // Vets.gov envs
  'development', 'staging', 'production',
  // VA.gov envs
  'preview', 'vagovdev', 'vagovstaging'
]

def devBranch = 'master'
def stagingBranch = 'master'
def prodBranch = 'master'

def isReviewable = {
  env.BRANCH_NAME != devBranch &&
    env.BRANCH_NAME != stagingBranch &&
    env.BRANCH_NAME != prodBranch
}

env.CONCURRENCY = 10

def isDeployable = {
  (env.BRANCH_NAME == devBranch ||
   env.BRANCH_NAME == stagingBranch) &&
    !env.CHANGE_TARGET &&
    !currentBuild.nextBuild // if there's a later build on this job (branch), don't deploy
}

def shouldBail = {
  // abort the job if we're not on deployable branch (usually master) and there's a newer build going now
  env.BRANCH_NAME != devBranch &&
  env.BRANCH_NAME != stagingBranch &&
  env.BRANCH_NAME != prodBranch &&
  !env.CHANGE_TARGET &&
  currentBuild.nextBuild
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
  if (env.BRANCH_NAME == devBranch ||
      env.BRANCH_NAME == stagingBranch ||
      env.BRANCH_NAME == prodBranch) {
    message = "vets-website ${env.BRANCH_NAME} branch CI failed. |${env.RUN_DISPLAY_URL}".stripMargin()
    slackSend message: message,
    color: 'danger',
    failOnError: true
  }
}

def comment_broken_links = {
  // Pull down console log replacing URL with IP since we can't hit internal DNS
  sh "curl -O \$(echo ${env.BUILD_URL} | sed 's/jenkins.vetsgov-internal/172.31.1.100/')consoleText"

  // Find all lines with broken links in production build
  def broken_links = sh (
    script: 'grep -o \'\\[production\\].*>>> href: ".*",\' consoleText',
    returnStdout: true
  ).trim()

  def github = GitHub.connect()
  def repo = github.getRepository('department-of-veterans-affairs/vets-website')
  def pr = repo.queryPullRequests().head("department-of-veterans-affairs:${env.BRANCH_NAME}").list().asList().get(0)


  // Post our comment with broken links formatted as a Markdown table
  pr.comment("### Broken links found by Jenkins\n\n|File| Link URL to be fixed|\n|--|--|\n" +
             broken_links.replaceAll(/\[production\] |>>> href: |,/,"|") +
             "\n\n _Note: Long file names or URLs may be cut-off_")
}

node('vetsgov-general-purpose') {
  properties([[$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', daysToKeepStr: '60']]]);
  def dockerImage, args, ref, imageTag

  // Checkout source, create output directories, build container

  stage('Setup') {
    try {

      dir("vets-website") {
        checkout scm
      }

      // clone vagov-content
      checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'CloneOption', noTags: true, reference: '', shallow: true], [$class: 'RelativeTargetDirectory', relativeTargetDir: 'vagov-content']], submoduleCfg: [], userRemoteConfigs: [[url: 'git@github.com:department-of-veterans-affairs/vagov-content.git']]]

      args = "-v ${pwd()}/vets-website:/application -v ${pwd()}/vagov-content:/vagov-content"

      dir("vets-website") {
        ref = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
  
        sh "mkdir -p build"
        sh "mkdir -p logs/selenium"
        sh "mkdir -p coverage"
  
        imageTag = java.net.URLDecoder.decode(env.BUILD_TAG).replaceAll("[^A-Za-z0-9\\-\\_]", "-")
  
        dockerImage = docker.build("vets-website:${imageTag}")
        retry(5) {
          dockerImage.inside(args) {
            sh "cd /application && yarn install --production=false"
          }
        }
      }
    } catch (error) {
      notify()
      throw error
    }
  }

  stage('Lint|Security|Unit') {
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
              sh "cd /application && nsp check"
            }
          }
        },

        unit: {
          dockerImage.inside(args) {
            sh "cd /application && npm --no-color run test:coverage"
            sh "cd /application && CODECLIMATE_REPO_TOKEN=fe4a84c212da79d7bb849d877649138a9ff0dbbef98e7a84881c97e1659a2e24 codeclimate-test-reporter < ./coverage/lcov.info"
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

  // Perform a build for each build type

  stage('Build') {
    if (shouldBail()) { return }

    try {
      def builds = [:]

      for (int i=0; i<envNames.size(); i++) {
        def envName = envNames.get(i)

        builds[envName] = {
          dockerImage.inside(args) {
            sh "cd /application && npm --no-color run build -- --buildtype=${envName}"
            sh "cd /application && echo \"${buildDetails('buildtype': envName, 'ref': ref)}\" > build/${envName}/BUILD.txt"
          }
        }
      }

      parallel builds
    } catch (error) {
      notify()

      // For content team PRs, add comment in GH so they don't need direct Jenkins access to find broken links
      if (env.BRANCH_NAME.startsWith("content")) {
        comment_broken_links()
      }
      throw error
    }
  }

  // Run E2E and accessibility tests
  stage('Integration') {
    if (shouldBail()) { return }
    dir("vets-website") {
      try {
        parallel (
          e2e: {
            sh "export IMAGE_TAG=${imageTag} && docker-compose -p e2e up -d && docker-compose -p e2e run --rm --entrypoint=npm -e BABEL_ENV=test -e BUILDTYPE=production vets-website --no-color run nightwatch:docker"
          },

          accessibility: {
            sh "export IMAGE_TAG=${imageTag} && docker-compose -p accessibility up -d && docker-compose -p accessibility run --rm --entrypoint=npm -e BABEL_ENV=test -e BUILDTYPE=production vets-website --no-color run nightwatch:docker -- --env=accessibility"
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
  stage('Archive') {
    if (shouldBail()) { return }

    try {
      dockerImage.inside(args) {
        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'vetsgov-website-builds-s3-upload',
                          usernameVariable: 'AWS_ACCESS_KEY', passwordVariable: 'AWS_SECRET_KEY']]) {
          for (int i=0; i<envNames.size(); i++) {
            sh "tar -C /application/build/${envNames.get(i)} -cf /application/build/${envNames.get(i)}.tar.bz2 ."
            sh "s3-cli put --acl-public --region us-gov-west-1 /application/build/${envNames.get(i)}.tar.bz2 s3://vetsgov-website-builds-s3-upload/${ref}/${envNames.get(i)}.tar.bz2"
          }
        }
      }
    } catch (error) {
      notify()
      throw error
    }
  }

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
      if (!isDeployable()) {
        return
      }
      dir("vets-website") {
        script {
          commit = sh(returnStdout: true, script: "git rev-parse HEAD").trim()
        }
      }
      if (env.BRANCH_NAME == devBranch) {
        build job: 'deploys/vets-website-dev', parameters: [
          booleanParam(name: 'notify_slack', value: true),
          stringParam(name: 'ref', value: commit),
        ], wait: false
        build job: 'deploys/vets-website-vagovdev', parameters: [
          booleanParam(name: 'notify_slack', value: true),
          stringParam(name: 'ref', value: commit),
        ], wait: false
      }
      if (env.BRANCH_NAME == stagingBranch) {
        build job: 'deploys/vets-website-staging', parameters: [
          booleanParam(name: 'notify_slack', value: true),
          stringParam(name: 'ref', value: commit),
        ], wait: false
        build job: 'deploys/vets-website-vagovstaging', parameters: [
          booleanParam(name: 'notify_slack', value: true),
          stringParam(name: 'ref', value: commit),
        ], wait: false
      }
    } catch (error) {
      notify()
      throw error
    }
  }
}
