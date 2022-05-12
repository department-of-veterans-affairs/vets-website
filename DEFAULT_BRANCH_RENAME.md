# Default Branch Rename

## What’s happening?
Currently, the default branch in this repository is named `master`. We are updating the name of the default branch to `main`.

## Why is this important?
Words matter. We are changing the name of the default branch to appropriately and accurately represent the function of the branch. The newly named `main` branch represents exactly what it is - the single source of truth, that is, all the code that works, is tested, and ready to be pushed to production.

We are not alone in this effort. To view information on other companies making the change, including GitHub, see GitHub's documentation on [Renaming the default branch from master](https://github.com/github/renaming#renaming-the-default-branch-from-master).

## How will this change impact users

### The default branch rename will:
- Re-target any open pull requests
- Update any draft releases based on the branch
- Move any branch protection rules that explicitly reference the old name
- Update the branch used to build GitHub Pages, if applicable
- Show a notice to repository contributors, maintainers, and admins on the repository homepage with instructions to update local copies of the repository
- Show a notice to contributors who git push to the old branch
- Redirect web requests for the old branch name to the new branch name
- Return a "Moved Permanently" response in API requests for the old branch name

_Source_: [Renaming existing branches](https://github.com/github/renaming#renaming-existing-branches)

Contributers will **not** be able to push commits locally or remotely until they have updated the default branch in their local clone of the repository. An error will be thrown with instructions on how to update the default branch locally.

### Updating default branch locally
All contributers to the repository will need to update the default branch for their local clone of the repository to `main`. You can run the following commands to update your local clone's default branch:
```
$ git branch -m master main
$ git fetch origin
$ git branch -u origin/main main
$ git remote set-head origin -a
```
Verify your default branch is now `main` by running the following command:
```
$ git rev-parse --abbrev-ref origin/HEAD
```

After the default branch has been updated, you must pull and merge the latest changes from `main` into existing branches you are working on. Continuous integration will fail for existing branches until they are up-to-date.
