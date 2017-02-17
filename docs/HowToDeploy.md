# How To Deploy
Because this is a static site, deployment is simply synchronizing the generated artifacts
with a remote S3 bucket, which Jenkins handles

Commits to `master` pushes `buildtype=development` to `dev.vets.gov` and
`buildtype=staging` to `staging.vets.gov`.

Commits to `production` pushes `buildtype=production` to `www.vets.gov`.
