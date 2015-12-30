# Vets.gov - beta [![Build Status](https://travis-ci.org/department-of-veterans-affairs/vets-website.svg?branch=master)](https://travis-ci.org/department-of-veterans-affairs/vets-website)

## Setup for your local environment

### Requirements

If you don't have Xcode installed (for OS X), install from the Mac App store. Once installed, add command line tools by going to Preferences > Downloads > Components.

Next, you will need [Ruby](https://www.ruby-lang.org). You may
consider using a Ruby version manager such as
[rbenv](https://github.com/sstephenson/rbenv) or [rvm](https://rvm.io/) to
help ensure that Ruby version upgrades don't mean all your
[gems](https://rubygems.org/) will need to be rebuilt.

On OS X, you can also use [Homebrew](http://brew.sh/) to install Ruby in
`/usr/local/bin`, which may require you to update your `$PATH` environment
variable. Once you have brew installed, here are the commands to follow to install via homebrew in terminal:

```shell
$ brew update
$ brew install ruby
```

### Development.
You will also need [Node Package Manager](https://nodejs.org/en/download/) because the
testing framework uses [Karma](http://karma-runner.github.io/) as the test runner which is written in [Node.js](https://nodejs.org/en/).

Using homebrew, you can also do

```shell
$ brew update
$ brew install npm
```

After this, install karma

```shell
$ npm install
```

If updating Karma, make sure to remember to rerun `npm shrinkwrap` to update `npm-shrinkwrap.json` (the `npm` equivalent of `Gemfile.lock` for `Bundler`).

### To run

- Once you have ruby installed (see above)
- Open terminal
- 'cd' to directory (leave a space after 'cd', then drag and drop your site folder into the terminal window)
- Install Jekyll by running:
```shell
cd <path to vets-website directory>
bundle install
```

- Run site by using:
```shell
jekyll serve
```
- View the site in your browser by going to http://localhost:4000

Any changes made locally will cause the site to rebuild automagically.
