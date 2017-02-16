# How To Deploy
Because this is a static site, deployment is simply synchronizing the generated artifacts
with a remote s3 bucket.  Travis handles the synchronization by using the
[s3-cli](https://www.npmjs.com/package/s3-cli) commandline tool.

Commits to `master` pushes `buildtype=development` to `dev.vets.gov` and
`buildtype=staging` to `staging.vets.gov`.

Commits to `production` pushes `buildtype=production` to `www.vets.gov`.

AWS access is granted to travis via the encrypted envrionment variables
`AWS_ACCESS_KEY` and `AWS_SECRET_KEY`. The same access key is reused for all pushed because
there is no trust boundary between the different deploys in Travis CI and in the source
repository.

For exact details, look in the deployment stanza of `.travis.yml`.
