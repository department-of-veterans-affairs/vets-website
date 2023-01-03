# Cypress-TestRail-Helper

Cypress-TestRail-Helper (CTH) is a Node-CLI helper-app that makes using [vagov-cy-tr-reporter][npm-vagov-cy-tr-reporter] (CTR) much easier. Once you've completed initial integration steps for your Cypress spec-file, you can use CTH to run the spec **just by inputting it&apos;s filename**!

**Private app**: This is **not a public-facing app** -- it pushes Cypress test-results to our private TestRail test case management system. You must be a VA employee/contractor officially onboarded to a VA.gov product team, in order to obtain private-systems access.

For basic TestRail help/info, see Platform&apos;s [TestRail Guide][platform-testrail-docs].

## Before using CTH

You need to do the following before using CTH:

1. **Integrate your Cypress spec-file with TestRail** -- you should have a TestRail test-case section containing TestRail test-cases which correspond to your spec&apos;s tests.
2. **Integrate your Cypress spec-file with CTH** -- copy the following JSDOC comment-block and prepend to your spec [replacing `<placeholders>` with your actual values from the previous step]:

   ```js
   /**
    * [TestRail-integrated] Spec for <spec description>
    * @testrailinfo projectId <your team's TestRail Project ID>
    * @testrailinfo suiteId <your team's TestRail Suite ID>
    * @testrailinfo groupId <your spec's TestRail Group ID>
    * @testrailinfo runName <Run-Name-you-want-to-see-in-TestRail>
    */
   ```

   **NOTE**: Do NOT use spaces for **runName**. Use dashes/underscores instead to separate words.

   [For an already-integrated example, see [hlr-contact-loop.cypress.spec.js][spec-example-line-1].]

3. IF you&apos;ll be launching CTH for the first time, **gather your team-specific[^1] TestRail credentials**:

   - TestRail Username
   - TestRail API Key

[See Platform&apos;s [Cypress to TestRail Reporter Configuration doc][platform-cypress-testrail-reporter-doc] for details on Step 1.  NOTE: No need to `export` environment-variables here with CTH; just copy the values somewhere so they&apos;re ready for input into CTH.]

For each new spec with which you want to use CTH, just repeat Steps 1-2 above.

## Using CTH

1. **Start** your local **vets-website** app.
1. **Stop** your local **vets-api** app if it&apos;s running.
1. In a **separate Terminal/shell** window, **navigate** to your **vets-website** project-root [if your&apos;re not there already], then **Launch** the app:
   `yarn cy:my-testrail-helper`

   - **If this is your first launch**, provide your TestRail Username, TestRail API Key when prompted.
   - **If you&apos;ve used this app before**, you can optionally rerun your previous spec by appending the **--rerun** command-flag:
     `yarn cy:my-testrail-helper --rerun`

2. **Provide** your Cypress spec&apos;s **filename** if prompted.
   [No need to include path or cypress-extensions (`.cypress...`); just input the filename.]
3. CTH will execute a child process to run your Cypress spec.

**That's it!** You&apos;ll see the Cypress-run child-process output, and then your user-prompt returns after the child-process exits.

**Tip**: To quickly check your TestRail Test Run, **scroll up** the child-process output to **(TestRail Reporter)** section, then next to **[VCTR] Run should be viewable at:**, **Cmd-click** [or Ctrl-click on Windows] the generated URL on the next line.

## Help & Support

For any questions about this app, contact Shared-Support QA Engineer Tze-chiu Lei:
- GitHub: **tlei123**
- Slack:
    - DSVA workspace: **Tze-chiu Lei**
    - Ad Hoc workspace: **Tze Lei**

IF this app&apos;s not working, [open a Bug][va-gov-team-new-bug].


[^1]: Your product-team should already be set up in TestRail -- check with your Product Manager. If your team&apos;s not set up, your PM should reach out to Platform for account creation.

[npm-vagov-cy-tr-reporter]: https://www.npmjs.com/package/@tlei123/vagov-cy-tr-reporter
[platform-testrail-docs]: https://depo-platform-documentation.scrollhelp.site/developer-docs/testrail-guide
[dsvavsp-testrail]: https://dsvavsp.testrail.io/
[platform-cypress-testrail-reporter-doc]: https://depo-platform-documentation.scrollhelp.site/developer-docs/cypress-to-testrail-reporter-plugin-configuration
[spec-example-line-1]: https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/appeals/996/tests/hlr-contact-loop.cypress.spec.js#L1
[va-gov-team-new-bug]: https://github.com/department-of-veterans-affairs/va.gov-team/issues/new?assignees=tlei123&labels=bug%2C+QA%2C+qa-test-plan%2C+Shared+Support+Team&template=bug-issue.md&title=%5BBug%5D+vagov-cy-tr-helper+-+
