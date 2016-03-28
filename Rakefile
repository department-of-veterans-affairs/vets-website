require "tmpdir"

# TODO(awong): Add method for overriding these if building on the local
# machine. Currently it keys off of Travis configs only which makes it
# less natural as an "API" for local development.
enable_optimizations = (ENV['CI'])

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
  Rake::Task[:install].invoke
end

desc "Build the website to both _site with dev features and _site_production without dev features."
task :build do
  Rake::Task[:"build-dev"].invoke
  Rake::Task[:"build-prod"].invoke
end

desc "Build the website with development configs"
task :"build-dev" do
  Rake::Task[:"webpack-dev"].invoke
  sh "bundle exec jekyll build"
end

desc "Build the website with production configs"
task :"build-prod" do
  Rake::Task[:"webpack-prod"].invoke
  sh "bundle exec jekyll build --config _config.yml,_config_prod.yml"
end

desc "Install dependencies for serving and development"
task :install do
  sh "bundle install --jobs 3 --retry=3 --deployment"
  sh "npm install"
end

desc "Run lint"
task :lint do
  sh "npm run-script lint"
end

desc "Run webpack with development features turned on."
task :"webpack-dev" do
  sh "rm -rf assets/js/generated"
  if enable_optimizations then
    sh "BUILD_TYPE=dev npm run-script webpack"
  else
    sh "BUILD_TYPE=dev npm run-script webpack-noopt"
  end
end

desc "Run webpack with production features only "
task :"webpack-prod" do
  sh "rm -rf assets/js/generated"
  if enable_optimizations then
    sh "npm run-script webpack-prod"
  else
    sh "npm run-script webpack-prod-noopt"
  end
end

desc "Run the development webpack in watch mode"
task :"webpack-watch" do
  sh "BUILD_TYPE=dev npm run-script webpack-noopt -- -w"
end

desc "Run the development jekyll server in watch mode"
task :"jekyll-watch" do
  sh "bundle exec jekyll serve"
end

# TODO(awong): This does not respect the branch so heroku will always deploy
# no-opt with development features turned on even on the production branch
# build. Need to find a way to pipe the config into Heroku.
desc "Run the development jekyll server on a given port with webpack bootstrapped. Used by Heroku."
task :"heroku-serve", :port do |t, args|
  raise "heroku-serve needs port argument" if args[:port].empty?
  Rake::Task[:"webpack-dev"].invoke
  sh "bundle exec jekyll serve --no-watch -P #{args[:port]}"
end

desc "Serve the website"
multitask :serve => [ :"webpack-watch", :"jekyll-watch" ]

namespace :tests do
  task :all => [ :build, :"all-nobuild" ]

  desc "NO JEKYLL REBUILD: Run all tests including slow/flaky ones (eg external link checks)."
  task :"all-nobuild" => [ :"ci-nobuild", :"htmlproof-external-only" ]

  desc "Run by the continuous build system. Looks at the environment to decide between prod/dev configs."
  task :ci => [:build, :"ci-nobuild"]

  desc "Builds and tests the site in development configuration"
  task :"ci-dev" => [ :"build-dev", :"ci-nobuild" ]

  desc "Builds and tests the site in production configuration"
  task :"ci-prod" => [ :"build-prod", :"ci-nobuild" ]

  # TODO: Mistake. This only tests the dev build no matter what.
  desc "NO JEKYLL REBUILD: Run standard continuous integration tests."
  task :"ci-nobuild" => [ :lint, :htmlproof, :javascript ]

  desc "Validate HTML. No extenral checks."
  task :htmlproof do
    sh "bundle exec htmlproof ./_site --only-4xx --disable-external --check-favicon --check-html --allow-hash-href --href-ignore '/veterans-employment-center/','/gi-bill-comparison-tool/','/disability-benefits/learn/eligibility/.*','/disability-benefits/learn/','/disability-benefits/apply-for-benefits/','Employment-Resources/','/gibill/','/disability-benefits/'"
  end

  desc "Validate HTML *including* following external links. May be flaky/slow depending on external link."
  task :"htmlproof-external-only" do
    sh "bundle exec htmlproof ./_site --external_only"
  end

  desc "Run Javascript tests in a single-shot."
  task :javascript do
    sh "./node_modules/karma/bin/karma start --single-run --browsers PhantomJS"
  end

  desc "Run Javascript tests continuously."
  task :javascript_watch do
    sh "./node_modules/karma/bin/karma start --browsers PhantomJS"
  end
end
