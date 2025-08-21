#### Form 21P-0960

#### Helpful installation tips

1. Make sure to update the `content-build` package by pulling from `main` and running `yarn fetch-drupal-cache`.
2. Update `vets-api` by pulling from `main`.
3. Enable the flipper feature `income_and_assets_form_enabled`
4. Add the `income-and-asset-statement` to your `watch` configuration. Example: `yarn run watch --env entry=static-pages,auth,login-page,pensions,income-and-asset-statement`

##### Context

VA Form 21P-0960 (Income and Asset Statement Form) is intended to be used to report or verify income and/or net worth, and changes to income and net worth over multiple years must be.

# Income and Asset Statement Form

### Base URLs

[https://www.staging.va.gov/income-and-asset-statement-form-21p-0969](https://www.staging.va.gov/income-and-asset-statement-form-21p-0969)

[https://www.va.gov/income-and-asset-statement-form-21p-0969](https://www.va.gov/income-and-asset-statement-form-21p-0969)

### Content

#### Chapters and Pages

The details of the chapters and pages of the form can be found in the generated [structure.json](../structure.json) file. The `generate-form-docs` script outputs the title and page details of each chapter, including page 'titles', 'paths', and 'depends' values.

##### How to generate structure.json

1. Run the `generate-form-docs` script

This will output the latest form documentation to the 'structure.json' file

```sh
yarn generate-form-docs -- income-and-asset-statement
```

#### Review and Submit

### Form Submission