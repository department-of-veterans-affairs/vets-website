task :default => [ :"tests:ci" ]

desc "Build the website"
task :build do
  sh "bundle exec jekyll build"
end

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

  desc "Run Javascript tests."
  task :javascript do
    sh "./node_modules/.bin/karma start --single-run --browsers PhantomJS"
  end

  desc "Run Javascript tests."
  task :javascript_watch do
    sh "./node_modules/.bin/karma start --browsers PhantomJS"
  end
end
