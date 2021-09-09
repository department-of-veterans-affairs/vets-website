# Cypress-TestRail Helper

A Node-CLI app to make using [cypress-testrail-reporter][npm-cypress-testrail-reporter] (CTR) easier. Use this to help collect/save all your CTR reporter-options before running your Cypress spec.

## Private app

This is **not a public-facing app** -- it pushes Cypress test-results to our private TestRail test case management system. You must be a VA employee/contractor officially onboarded to a VA.gov product team, in order to obtain private-systems access.

## Before using this app

Some pieces of info need to be ready for initial app configuration:

- TestRail Username
- TestRail API Key
- TestRail Project ID
- TestRail Suite ID

[See VSP's [Cypress to TestRail Reporter Configuration][vsp-cypress-testrail-doc] doc for details on how to find these items. NOTE: No need to `export` these as environment-variables -- this app will store them in a git-ignored configuration-file for easy reuse.]

## Initial configuration

The app uses a git-ignored config-file to store your TestRail login-credentials and CTR reporter-options that don't change across test-runs.

You only need to set this up once:

1. **Save** `/script/cypress-testrail-helper/my-config.txt` **as** `my-config.json`.
1. **Substitute** your **real values** for the newly-saved .js file's `<placeholder-values>`, then **Save** the file again.

## Usage

1. **Start** your local **vets-website** app.
1. **Stop** your local **vets-api** app if it's running.
1. In a **separate Terminal** window, **navigate** to your **vets-website** project-root [if your're not there already], then **Launch** the app:
   `yarn run cy:my-testrail-helper`
   NOTE: IF you ever need to change your saved TestRail Project & Suite IDs, append the option `--switch-project` (alias `--sp`) to your launch-command.
1. **Provide** run-specific info for **TestRail Group ID** & **TestRail Run Name** when prompted.
   NOTE: IF you launched with `--switch-project` or `--sp` option, you'll first be prompted for **TestRail Project ID** & **TestRail Suite ID**.
1. After the app exits, run your Cypress spec:
   `yarn cy:my-testrail-run --spec <project-root-path-to-spec-file>`
   E.g., `yarn cy:my-testrail-run --spec src/applications/appeals/tests/10182-notice-of-disagreement.cypress.spec.js`

That's it! Once it's gathered all your info, the app will run your Cypress spec and push results to TestRail. Options that don't change across test-runs are saved in a git-ignored `my-config.json` file, so you won't have to re-input those values again. Typically, you'll only have to provide your Cypress spec path, TestRail Group ID, and TestRail Run Name each time you run a Cypress spec.

## Help & Support

For any questions about this app, contact QA Engineer Tze-chiu Lei (GitHub: @tlei123).

IF this app's not working, [open a Bug in va.gov-team GitHub repo][va-gov-team-new-bug] and assign to Tze-chiu Lei (GitHub @tlei123).

[npm-cypress-testrail-reporter]: https://www.npmjs.com/package/cypress-testrail-reporter
[vsp-cypress-testrail-doc]: https://depo-platform-documentation.scrollhelp.site/developer-docs/Cypress-to-TestRail-Reporter-Plugin-Configuration.1738047581.html
[va-gov-team-new-bug]: https://github.com/department-of-veterans-affairs/va.gov-team/issues/new?assignees=&labels=bug&template=bug-issue.md&title=
