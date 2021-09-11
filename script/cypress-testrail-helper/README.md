# Cypress-TestRail-Helper

Cypress-TestRail-Helper (CTH) is a Node-CLI app that makes using [cypress-testrail-reporter][npm-cypress-testrail-reporter] (CTR) easier. Use this to help collect/save all your CTR reporter-options before running your Cypress spec.

**Private app**: This is **not a public-facing app** -- it pushes Cypress test-results to our private TestRail test case management system. You must be a VA employee/contractor officially onboarded to a VA.gov product team, in order to obtain private-systems access.

For basic TestRail help/info, see VSP's [TestRail docs][vsp-testrail-docs].

## Before using this app

Gather your team-specific\* [TestRail][dsvavsp-testrail] info before launching CTH for the first time. You'll only need to input this info once into CTH:

- TestRail Username
- TestRail API Key
- TestRail Project ID
- TestRail Suite ID

[See VSP's [Cypress to TestRail Reporter Configuration doc][vsp-cypress-testrail-reporter-doc] for details on how to find these items. NOTE: No need to `export` these as environment-variables -- this app will store them in a git-ignored configuration-file for easy reuse.]

## Initial configuration

At initial launch, CTH will prompt you for your team-specific TestRail info, and generate a git-ignored app config-file to store that info. You'll only need to provide the info once.

## Usage

1. **Start** your local **vets-website** app.
1. **Stop** your local **vets-api** app if it's running.
1. In a **separate Terminal** window, **navigate** to your **vets-website** project-root [if your're not there already], then **Launch** the app:
   `yarn run cy:my-testrail-helper`
   NOTE: IF you ever need to change your saved TestRail Project & Suite IDs\*\*, launch with the option `--switch-project` (alias `--sp`).
1. **Provide** run-specific info for **TestRail Group ID**, **TestRail Run Name**, & **Cypress spec-file path** when prompted.
   IF you launched with `--switch-project` or `--sp` option, you'll first be prompted for **TestRail Project ID** & **TestRail Suite ID**.
   CTH will generate an updated, run-specific, git-ignored Cypress config-file to store your inputs.
1. CTH will execute a child process to run your Cypress spec.

**That's it!** Once the Cypress-run child process exits, you'll see its output, and your CLI-prompt will return.

**Tip**: To quickly check your TestRail Test Run, **scroll** the child-process output up to the **(TestRail Reporter)** section, then next to **- Results are published to**, **Cmd-click** the generated run-path.

Options that don't usually change across test-runs are saved in a git-ignored `my-config.json` file, so you won't have to re-input those values again. Typically, you'll only have to provide your Cypress spec path, TestRail Group ID, and TestRail Run Name each time you run a Cypress spec.

## Help & Support

For any questions about this app, contact QA Engineer Tze-chiu Lei (GitHub: @tlei123).

IF this app's not working, [open a Bug in va.gov-team GitHub repo][va-gov-team-new-bug] and assign to Tze-chiu Lei (GitHub @tlei123).

---

\*Your product-team should already be set up in TestRail -- check with your Product Manager. If your team's not set up, your PM should reach out to VSP for account creation.
\*\*You only need to switch TestRail Projects if you need to run a _different_ product-team's Cypress spec. TestRail Projects are team-specific, and houses Test Cases/Plans/Runs/Results for all products assigned to the team.

[npm-cypress-testrail-reporter]: https://www.npmjs.com/package/cypress-testrail-reporter
[vsp-testrail-docs]: https://depo-platform-documentation.scrollhelp.site/developer-docs/How-to-use-TestRail.1600684126.html
[dsvavsp-testrail]: https://dsvavsp.testrail.io/
[vsp-cypress-testrail-reporter-doc]: https://depo-platform-documentation.scrollhelp.site/developer-docs/Cypress-to-TestRail-Reporter-Plugin-Configuration.1738047581.html
[va-gov-team-new-bug]: https://github.com/department-of-veterans-affairs/va.gov-team/issues/new?assignees=&labels=bug&template=bug-issue.md&title=
