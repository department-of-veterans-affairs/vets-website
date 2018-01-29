import org.kohsuke.github.GitHub

def envNames = ['development', 'staging', 'production']

def isReviewable = {
  env.BRANCH_NAME != 'production' &&
    env.BRANCH_NAME != 'user_feedback_footer_form-I3445' &&
    env.BRANCH_NAME != 'master'
}

env.CONCURRENCY = 10

def isDeployable = {
  (env.BRANCH_NAME == 'master' ||
    env.BRANCH_NAME == 'user_feedback_footer_form-I3445' ||
    env.BRANCH_NAME == 'production') &&
    !env.CHANGE_TARGET &&
    !currentBuild.nextBuild   // if there's a later build on this job (branch), don't deploy
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

def notify = { message, color='good' ->
    if (env.BRANCH_NAME == 'master' ||
        env.BRANCH_NAME == 'user_feedback_footer_form-I3445' ||
        env.BRANCH_NAME == 'production') {
        slackSend message: message,
                  color: color,
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
  def dockerImage, args, ref

  // Checkout source, create output directories, build container

  stage('Setup') {
    try {
      checkout scm

      ref = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()

      sh "mkdir -p build"
      sh "mkdir -p logs/selenium"
      sh "mkdir -p coverage"

      def imageTag = java.net.URLDecoder.decode(env.BUILD_TAG).replaceAll("[^A-Za-z0-9\\-\\_]", "-")

      dockerImage = docker.build("vets-website:${imageTag}")
      args = "-v ${pwd()}:/application"
    } catch (error) {
      notify("vets-website ${env.BRANCH_NAME} branch CI failed in setup stage!", 'danger')
      throw error
    }
  }

  // Check package.json for known vulnerabilities

  stage('Security') {
    try {
      dockerImage.inside(args) {
        sh "cd /application && nsp check"
      }
    } catch (error) {
      notify("vets-website ${env.BRANCH_NAME} branch CI failed in security stage!", 'danger')
      throw error
    }
  }

  // Check source for syntax issues

  stage('Lint') {
    try {
      dockerImage.inside(args) {
        sh "cd /application && npm --no-color run lint"
      }
    } catch (error) {
      notify("vets-website ${env.BRANCH_NAME} branch CI failed in lint stage!", 'danger')
      throw error
    }
  }

  stage('Unit') {
    try {
      dockerImage.inside(args) {
        sh "cd /application && npm --no-color run test:coverage"
        sh "cd /application && CODECLIMATE_REPO_TOKEN=fe4a84c212da79d7bb849d877649138a9ff0dbbef98e7a84881c97e1659a2e24 codeclimate-test-reporter < ./coverage/lcov.info"
      }
    } catch (error) {
      notify("vets-website ${env.BRANCH_NAME} branch CI failed in unit stage!", 'danger')
      throw error
    }
  }

  // Perform a build for each build type

  stage('Build') {
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
      notify("vets-website ${env.BRANCH_NAME} branch CI failed in build stage!", 'danger')

      // For content team PRs, add comment in GH so they don't need direct Jenkins access to find broken links
      if (env.BRANCH_NAME.startsWith("content")) {
        comment_broken_links()
      }
      throw error
    }
  }

  // Run E2E and accessibility tests

  stage('Integration') {
    try {
      parallel (
        e2e: {
          dockerImage.inside(args + " -e BUILDTYPE=production") {
            sh "Xvfb :99 & cd /application && DISPLAY=:99 npm --no-color run test:e2e"
          }
        },

        accessibility: {
          dockerImage.inside(args + " -e BUILDTYPE=production") {
            sh "Xvfb :98 & cd /application && DISPLAY=:98 npm --no-color run test:accessibility"
          }
        }
      )
    } catch (error) {
      notify("vets-website ${env.BRANCH_NAME} branch CI failed in integration stage!", 'danger')
      throw error
    } finally {
      step([$class: 'JUnitResultArchiver', testResults: 'logs/nightwatch/**/*.xml'])
    }
  }

  stage('Archive') {
    try {
      def builds = [ 'development', 'staging', 'production' ]

      dockerImage.inside(args) {
        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'vetsgov-website-builds-s3-upload',
                          usernameVariable: 'AWS_ACCESS_KEY', passwordVariable: 'AWS_SECRET_KEY']]) {
          for (int i=0; i<builds.size(); i++) {
            sh "tar -C /application/build/${builds.get(i)} -cf /application/build/${builds.get(i)}.tar.bz2 ."
            sh "s3-cli put --acl-public --region us-gov-west-1 /application/build/${builds.get(i)}.tar.bz2 s3://vetsgov-website-builds-s3-upload/${ref}/${builds.get(i)}.tar.bz2"
          }
        }
      }
    } catch (error) {
      notify("vets-website ${env.BRANCH_NAME} branch CI failed in archive stage!", 'danger')
      throw error
    }
  }

  stage('Review') {
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
      notify("vets-website ${env.BRANCH_NAME} branch CI failed in review stage!", 'danger')
      throw error
    }
  }

  stage('Deploy') {
    try {
      if (!isDeployable()) {
        return
      }

      // Create a new GitHub release for this merge to production
      if (env.BRANCH_NAME == 'production') {
        build job: 'releases/vets-website', parameters: [
          stringParam(name: 'ref', value: ref),
        ], wait: true
      }

      def targets = [
        'master': [ 'staging' ],
        'user_feedback_footer_form-I3445': [ 'dev' ],
        'production': [ 'prod' ],
      ][env.BRANCH_NAME]

      // Deploy the build associated with this ref. To deploy from a release use
      // the `deploys/vets-website-env-from-build` jobs from the Jenkins web console.
      for (int i=0; i<targets.size(); i++) {
        build job: "deploys/vets-website-${targets.get(i)}-from-build", parameters: [
          stringParam(name: 'ref', value: ref),
        ], wait: false
      }
    } catch (error) {
      notify("vets-website ${env.BRANCH_NAME} branch CI failed in deploy stage!", 'danger')
      throw error
    }
  }
}
