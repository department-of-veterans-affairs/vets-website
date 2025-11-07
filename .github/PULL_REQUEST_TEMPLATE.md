## Are you removing, renaming or moving a folder in this PR?
- [ ] No, I'm not changing any folders (skip to TeamSites and delete the rest of this section)
- [ ] Yes, I'm removing, renaming or moving a folder

If the folder you changed contains a `manifest.json`, search for its `entryName` in the content-build [registry.json](https://github.com/department-of-veterans-affairs/content-build/blob/main/src/applications/registry.json) (the `entryName` there will match).

If an entry for this folder exists in content-build and you are:
1. **Deleting a folder**:
   1. First search `vets-website` for _all_ instances of the `entryName` in your `manifest.json` and remove them in a separate PR. Look particularly for references in `src/applications/static-pages/static-pages-entry.js` and `src/platform/forms/constants.js`. _**If you do not do this, other applications will break!**_
      - _Add the link to your merged vets-website PR here_
   2. Then, Delete the application entry in [registry.json](https://github.com/department-of-veterans-affairs/content-build/blob/main/src/applications/registry.json) and merge that PR **before** this one
      - _Add the link to your merged content-build PR here_

2. **Renaming or moving a folder**: Update the entry in the [registry.json](https://github.com/department-of-veterans-affairs/content-build/blob/main/src/applications/registry.json), but do not merge it until your vets-website changes here are merged. The content-build PR must be merged immediately after your vets-website change is merged in to avoid CI errors with content-build (and Tugboat).

### :warning: TeamSites :warning:
Examples of a TeamSite: https://va.gov/health and https://benefits.va.gov/benefits/. This scenario is also referred to as the "injected" header and footer. You can reach out in the `#sitewide-public-websites` Slack channel for questions.

Did you change site-wide styles, platform utilities or other infrastructure?
- [ ] No
- [ ] Yes, and I used the [proxy-rewrite steps](https://github.com/department-of-veterans-affairs/vets-website/tree/main/src/applications/proxy-rewrite#that-sounds-normal-so-whats-the-proxy-all-about) to test the injected header scenario

## Summary

- _(Summarize the changes that have been made to the platform)_
- _(If bug, how to reproduce)_

## Related issue(s)

- _Link to ticket created in va.gov-team repo_
department-of-veterans-affairs/va.gov-team#0000
- _Link to epic if not included in ticket_
department-of-veterans-affairs/va.gov-team#0000

## Testing done

-  [ ] _Updated unit tests_
-  [ ] _Updated e2e tests_
- _Describe the steps required to verify your changes are working as expected_
- _Exclusively stating 'Specs and automated tests passing' is NOT acceptable as appropriate testing_
## Screenshots
_Note: Mandatory for UI changes (non-component work should NOT have screenshots)._

|         | Before | After |
| ------- | ------ | ----- |
| Mobile  |        |       |
| Desktop |        |       |

## What areas of the site does it impact?
*(Describe what parts of the site are impacted **if** code touched other areas)*

## Acceptance criteria

### Quality Assurance & Testing

- [ ] I fixed|updated|added unit tests and integration tests for each feature (if applicable).
- [ ] No sensitive information (i.e. PII/credentials/internal URLs/etc.) is captured in logging, hardcoded, or specs
- [ ] Documentation has been updated ([link to documentation](#) \*if necessary)
- [ ] Screenshot of the developed feature is added
- [ ] [Accessibility testing](https://depo-platform-documentation.scrollhelp.site/collaboration-cycle/prepare-for-an-accessibility-staging-review) has been performed

### Error Handling

- [ ] Browser console contains no warnings or errors.
- [ ] Events are being sent to the appropriate logging solution
- [ ] Feature/bug has a monitor built into Datadog or Grafana (if applicable)

### Authentication

- [ ] Did you login to a local build and verify all authenticated routes work as expected with a test user