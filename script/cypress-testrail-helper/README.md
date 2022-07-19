# Cypress-TestRail-Helper

## DO NOT USE!

**IMPORTANT: Do NOT use Cypress-TestRail Helper**, until further notice! Cypress 10 major upgrade has broken this helper-tool. When we've upgraded CTH, you'll be notified on DSVA Slack #vfs-frontend channel.

Cypress-TestRail-Helper (CTH) is a Node-CLI app that makes using [cy-tr-reporter][npm-cy-tr-reporter] (CTR) much easier. Once you've completed initial integration steps for your Cypress spec-file, you can use CTH to run the spec **just by inputting it's filename**!

**Private app**: This is **not a public-facing app** -- it pushes Cypress test-results to our private TestRail test case management system. You must be a VA employee/contractor officially onboarded to a VA.gov product team, in order to obtain private-systems access.

For basic TestRail help/info, see VSP's [TestRail docs][vsp-testrail-docs].

## Before using this app

You only need to follow these steps once:

1. Integrate your Cypress spec-file with TestRail -- you should have a TestRail test-case group/section for your spec, and within it TestRail test-cases corresponding to your spec's tests.
1. In TestRail, click the green info-button next to one of your test-case's Case ID. An alert should be displayed, providing the case's parent Group ID and ancestor Project & Suite IDs.
1. Integrate your Cypress spec-file with CTH -- prepend the following JSDOC comment to your spec [replacing `<placeholders>` with your actual values]:

   ```js
   /**
    * [TestRail-integrated] Spec for <spec description>
    * @testrailinfo projectId <your team's TestRail Project ID>
    * @testrailinfo suiteId <your team's TestRail Suite ID>
    * @testrailinfo groupId <your spec's TestRail Group ID>
    * @testrailinfo runName <unique Run Name you'd like to see in TestRail>
    */
   ```

   [for runName, do NOT use spaces. Use dashes/underscores instead to separate words.]

1. IF launching CTH for the first time, gather your team-specific\* TestRail credentials:

   - TestRail Username
   - TestRail API Key

[See VSP's [Cypress to TestRail Reporter Configuration doc][vsp-cypress-testrail-reporter-doc] for details on Steps 1 & 4. NOTE: No need to `export` environment-variables; just copy the values somewhere so they're ready for input into CTH.]

## Usage

1. **Start** your local **vets-website** app.
1. **Stop** your local **vets-api** app if it's running.
1. In a **separate Terminal/shell** window, **navigate** to your **vets-website** project-root [if your're not there already], then **Launch** the app:
   `yarn run cy:my-testrail-helper`

   - **If this is your first launch**, provide your TestRail Username, TestRail API Key when prompted.
   - **If you've used this app before**, you can optionally rerun your previous spec by appending the **--rerun** command-flag:
     `yarn run cy:my-testrail-helper --rerun`

1. **Provide** your Cypress spec's **filename** if prompted.
   [No need to include path or cypress-extensions (`.cypress...`); just input the filename.]
1. CTH will execute a child process to run your Cypress spec.

**That's it!** Once the Cypress-run child process exits, you'll see its output, and your CLI-prompt will return.

**Tip**: To quickly check your TestRail Test Run, **scroll** the child-process output up to the **(TestRail Reporter)** section, then next to **- Results are published to**, **Cmd-click** the generated run-path.

## Help & Support

For any questions about this app, contact VSA QA Engineer Tze-chiu Lei (Slack: @Tze Lei).

IF this app's not working, [open a Bug in va.gov-team GitHub repo][va-gov-team-new-bug]:

- assign to Tze-chiu Lei (GitHub @tlei123).
- add **vsa-qa** label.

---

\*Your product-team should already be set up in TestRail -- check with your Product Manager. If your team's not set up, your PM should reach out to VSP for account creation.
\*\*You only need to switch TestRail Projects if you need to run a _different_ product-team's Cypress spec. TestRail Projects are team-specific, and houses Test Cases/Plans/Runs/Results for all products assigned to the team.

[npm-cy-tr-reporter]: https://www.npmjs.com/package/cy-tr-reporter
[vsp-testrail-docs]: https://depo-platform-documentation.scrollhelp.site/developer-docs/How-to-use-TestRail.1600684126.html
[dsvavsp-testrail]: https://dsvavsp.testrail.io/
[vsp-cypress-testrail-reporter-doc]: https://depo-platform-documentation.scrollhelp.site/developer-docs/Cypress-to-TestRail-Reporter-Plugin-Configuration.1738047581.html
[va-gov-team-new-bug]: https://github.com/department-of-veterans-affairs/va.gov-team/issues/new?assignees=&labels=bug&template=bug-issue.md&title=
