# vets.gov - beta [![Build Status](https://travis-ci.org/department-of-veterans-affairs/vets-website.svg?branch=master)](https://travis-ci.org/department-of-veterans-affairs/vets-website)

## Setup for your local environment

### Requirements

- [Git](https://git-scm.com/)
- [Node and NPM](https://nodejs.org/)
- [Bundler](http://bundler.io/)

If you are using OS X, there is a good chance that you already have these installed. To check:

1. Open Terminal.app (or iTerm, if that's what you're using)
1. Type `which [program]`, e.g.: `which npm` or `which git`

If the output is a path, then that package has been installed. If there is no output, install the appropriate software.

## Installation

### Cloning the repo 

Clone the repo to your local machine using the following.

```shell
$ git clone git@github.com:department-of-veterans-affairs/vets-website.git
```

If you haven't set up SSH or GPG keys, use the HTTPS URL instead.

```shell
$ git clone https://github.com/department-of-veterans-affairs/vets-website.git
```

These commands will add a `vets-website` directory to the current working directory.

If you'd rather this directory not be named `vets-website`, add a new directory name to the command, e.g. 

```shell
$ git clone https://github.com/department-of-veterans-affairs/vets-website.git chocolate
```

This will copy the repo to a `chocolate` directory.

### Installing the build environment

In a terminal window `cd` into the `vets-website` directory, then run:

```shell
$ rake install
```

Installation will take several minutes.

## Running the website locally

- Open a terminal window
- Use the `cd` command to navigate to the `vets-website` directory
- Run site by using:

    ```shell
    rake serve
    ```
- View the site in your browser at http://localhost:4000

Any changes made locally will cause the site to rebuild automagically.

## Deploying the website

Deployment is done by pushing changes to the `production` branch on github.
The most common paradigm is to promote `master` to `production` by doing a
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

## Development

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
rake tests:javascript-watch  # Runs all javascript tests continually watching for changes..
```

There is currently now way to automatically run `htmlproof` automatically on
a change to a source file. Patches welcome!

## Updating Karma.

If updating Karma, make sure to remember to rerun `npm shrinkwrap` to update `npm-shrinkwrap.json` (the `npm` equivalent of `Gemfile.lock` for `Bundler`).

## Troubleshooting
```
jekyll 2.4.0 | Error:  string not matched
```
If you get this error when running `rake serve` it may mean that case sensitivity in your OSX path names are interacting weirdly with Ruby string matching.

For example your path is:
```
/Users/awesomeuser/workspace/VA/vets-website/
```
but Jekyll is reading it as 
```
/Users/awesomeuser/workspace/va/vets-website/
```
Changing all the directory names to lower-case should fix it. For some reason, the root level `User` directory does not cause this issue.

## More documentation

- [Why Is My Build Breaking?](docs/WhyIsMyBuildBreaking.md)
- [How Breadcrumbs Work](docs/HowBreadCrumbsWork.md)
- [How URLs are Created](docs/HowURLsAreCreated.md)
- [How Search Works](docs/HowSearchWorks.md)
