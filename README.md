# vets.gov - beta [![Build Status](https://travis-ci.org/department-of-veterans-affairs/vets-website.svg?branch=master)](https://travis-ci.org/department-of-veterans-affairs/vets-website)

## Setup for your local environment

### Requirements

If you don't have Xcode installed (for OS X), install from the Mac App store. Once installed, add command line tools by going to Preferences > Downloads > Components.

Next, you will need [Ruby](https://www.ruby-lang.org). You may
consider using a Ruby version manager such as
[rbenv](https://github.com/sstephenson/rbenv) or [rvm](https://rvm.io/) to
help ensure that Ruby version upgrades don't mean all your
[gems](https://rubygems.org/) will need to be rebuilt.

#### Normal installation.

Most development systems will already have the requirements installed
including `bundler` and `npm`. If that describes you, just run

```shell
$ rake install
```

#### Bootstrap

If the requirements are missing, do the following.

On OS X, you can use [Homebrew](http://brew.sh/) to install Ruby in
`/usr/local/bin`, which may require you to update your `$PATH` environment
variable. Once you have brew installed, here are the commands to follow to install via homebrew in terminal:

```shell
$ brew update
$ brew install ruby
```

Next run this rake task to ensure `bundler` and `npm` are installed.

```shell
$ rake bootstrap
```

[Node Package Manager](https://nodejs.org/en/download/) is used by
[Karma](http://karma-runner.github.io/), the  test runner for javascript.
Karma is written in [Node.js](https://nodejs.org/en/).

### Running the website

- Open terminal
- 'cd' to directory (leave a space after 'cd', then drag and drop your site folder into the terminal window)
```shell
cd <path to vets-website directory>
```

- Run site by using:
```shell
rake serve
```
- View the site in your browser by going to http://localhost:4000

Any changes made locally will cause the site to rebuild automagically.

### Deploying the website

Deployment is done by pushing changes to the `production` branch on github.
The most common paradigm is to promote `master` to `produciton` by doing a
fast-forward merge into the branch. This can be accomplished via

```shell
rake deploy
```

If someone has had to push emergency changes to the production branch that
have yet to be merged into master, then you will need "merge down" from
production into master before doing a deploy. This will ensure that master
has all the changes pushed to production. *THIS SHOULD NOT HAPPEN NORMALLY.*
If this has occurred, run

```shell
rake mergedown
```

After this, ensure the CI on `master` goes green. Double-check staging as
you've just introduced a new change to the code. If everything looks good,
perform a deploy as described earlier to push all changes into production.

### Development

When developing, you will want one terminal open window running the Jekyll server (see Running the website).

For testing, the following commands are useful:

```shell
rake tests:ci  # Rebuilds the website. Runs all tests that the CI system runs.
rake tests:ci-nobuild  # Same as above but w/o rebuilding for faster iteraion.

rake tests:all  # Rebuilds the website. Runs all tests, including slow ones. Superset of tests:ci
rake tests:all-nobuild  # Same as above but w/o rebuilding for faster iteration.

rake tests:htmlproof  # Runs HTML validation as a single-shot.
rake tests:htmlproof-external-only  # Runs HTML validation of external links only as a single-shot.

rake tests:javascript  # Runs all javascript tests as a single-shot.
rake tests:javascript-watch  # Runs all javascript tests continually watching for changes.
```

There is currently now way to automatically run `htmlproof` automatically on
a change to a source file. Patches welcome!

### Updating Karma.

If updating Karma, make sure to remember to rerun `npm shrinkwrap` to update `npm-shrinkwrap.json` (the `npm` equivalent of `Gemfile.lock` for `Bundler`).

## Troubleshooting

- [How Breadcrumbs Work](docs/HowBreadCrumbsWork.md)
- [Why Is My Build Breaking?](docs/WhyIsMyBuildBreaking.md)
- [How URLs are Created](docs/HowURLsAreCreated.md)
