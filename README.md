# Beta site Veterans.gov

## Setup for your local environment

### Requirements

You will need [Ruby](https://www.ruby-lang.org) ( > version 2.1.5 ). You may
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


### To run

- Once you have ruby installed (see above)
- Open terminal
- 'cd' to directory (leave a space after 'cd', then drag and drop your site folder into the terminal window)
- Install Jekyll by running 'gem install jekyll'
- Run site by using 'jekyll serve'
- View the site in your browser by going to http://localhost:4000

Any changes made locally will cause the site to rebuild automagically.
