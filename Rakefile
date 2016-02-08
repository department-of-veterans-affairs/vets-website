require "tmpdir"

# Clones the current git repository into a temp directory that shares the
# object store. Also sets up a github remote.
#
# Commands can be run against this clone can be used to manipulate the
# github remote without affecting your current checkout.
def run_in_cloned_git
  Dir.mktmpdir("vets-website-deploy") do |dir|
    sh "git clone -l --single-branch -s . #{dir}"
    Dir.chdir(dir) do
      sh "echo `pwd`"
      sh "if (git remote | grep -q '^github$'); then git remote remove github; fi"
      sh "git remote add github https://github.com/department-of-veterans-affairs/vets-website.git"
      sh "git fetch github"
      yield dir
    end
  end
end

task :default => [ :"tests:ci" ]

desc "Bootstrap bundler and npm using brew"
task :bootstrap do
  # If we're here, ruby is already installed. Just ensure bundler is here.
  sh "gem install bundler --no-rdoc --no-ri"

  # Install npm.
  sh "brew update"
  sh "brew install npm"

  # Continue with install.
  Rake::Task["install"].invoke
end

desc "Build the website"
task :build do
  sh "webpack"
  sh "bundle exec jekyll build"
end

desc "Push the *remote* master branch to *remote* production. Does NOT merge."
task :deploy do
  run_in_cloned_git do
    sh "git checkout -B master github/master"
    sh "git push github master:production"
  end
end

desc "Merge production back into master."
task :mergedown do
  run_in_cloned_git do
    sh "git checkout -B master github/master"
    sh "git pull github production"
    sh "git push github master:master"
  end
end

desc "Install dependencies for serving and development"
task :install do
  sh "bundle install"
  sh "npm install"
end

desc "Serve the website"
task :serve do
  sh "bundle exec jekyll serve"
end

namespace :tests do
  task :all => [ :build, :all_nobuild ]

  desc "NO JEKYLL REBUILD: Run all tests including slow/flaky ones (eg external link checks)."
  task :all_nobuild => [ :ci_nobuild, :htmlproof_external_only ]

  task :ci=> [ :build, :ci_nobuild ]

  desc "NO JEKYLL REBUILD: Run standard continuous integration tests."
  task :ci_nobuild => [ :htmlproof, :javascript ]

  desc "Validate HTML. No extenral checks."
  task :htmlproof do
    sh "bundle exec htmlproof ./_site --only-4xx --disable-external --check-favicon --check-html --allow-hash-href --href-ignore '/veterans-employment-center/','/gi-bill-comparison-tool/','/disability-benefits/learn/eligibility/.*','/disability-benefits/learn/','/disability-benefits/apply-for-benefits/','Employment-Resources/','/gibill/','/disability-benefits/'"
  end

  desc "Validate HTML *including* following external links. May be flaky/slow depending on external link."
  task :htmlproof_external_only do
    sh "bundle exec htmlproof ./_site --external_only"
  end

  desc "Run Javascript tests in a single-shot."
  task :javascript do
    sh "./node_modules/.bin/karma start --single-run --browsers PhantomJS"
  end

  desc "Run Javascript tests continuously."
  task :javascript_watch do
    sh "./node_modules/.bin/karma start --browsers PhantomJS"
  end
end
