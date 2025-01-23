**Note**: Delete the description statements, complete each step. **None are optional**, but can be justified as to why they cannot be completed as written. Provide known gaps to testing that may raise the risk of merging to production.

## Are you removing, renaming or moving a folder in this PR?
- [ ] No, I'm not changing any folders (skip to TeamSites and delete the rest of this section)
- [ ] Yes, I'm removing, renaming or moving a folder

If the folder you changed contains a `manifest.json`, search for its `entryName` in the content-build [registry.json](https://github.com/department-of-veterans-affairs/content-build/blob/main/src/applications/registry.json) (the `entryName` there will match).

If an entry for this folder exists in content-build and you are:

**Deleting a folder**:
1.  First search `vets-website` for _all_ instances of the `entryName` in your `manifest.json` and remove them in a separate PR. Look particularly for references in `src/applications/static-pages/static-pages-entry.js` and `src/platform/forms/constants.js`. _**If you do not do this, other applications will break!**_

- _Add the link to your merged vets-website PR here_

2. Then, Delete the application entry in [registry.json](https://github.com/department-of-veterans-affairs/content-build/blob/main/src/applications/registry.json) and merge that PR **before** this one

- _Add the link to your merged content-build PR here_

2.  **Renaming or moving a folder**: Update the entry in the [registry.json](https://github.com/department-of-veterans-affairs/content-build/blob/main/src/applications/registry.json), but do not merge it until your vets-website changes here are merged. The content-build PR must be merged immediately after your vets-website change is merged in to avoid CI errors with content-build (and Tugboat).

### :warning: TeamSites :warning:
Examples of a TeamSite: https://va.gov/health and https://benefits.va.gov/benefits/. This scenario is also referred to as the "injected" header and footer. You can reach out in the `#sitewide-public-websites` Slack channel for questions.

## Did you change site-wide styles, platform utilities or other infrastructure?
- [ ] No
- [ ] Yes, and I used the [proxy-rewrite steps](https://github.com/department-of-veterans-affairs/vets-website/tree/main/src/applications/proxy-rewrite#that-sounds-normal-so-whats-the-proxy-all-about) to test the injected header scenario

## Summary
Summary of changes on the Pension Benefits form (21P-527EZ)

## Issue
- _Link to ticket created in va.gov-team repo_

## Related issue(s)
- _Link to previous change of the code/bug (if applicable)_
- _Link to epic if not included in ticket_

## Associated Pull Request(s)
- _Link to associated vets-website, vets-api or vets-json-schema PR (if applicable)_
- _Link to previous changes (if applicable)_

## How to run in local environment
1. Check out this branch locally
2. Run `vets-website` and `vets-api`
3. In your local environment, set the `{{flipper_name}}` flipper to 'enabled' at http://localhost:3000/flipper/features/{{flipper_name}} (if applicable)
4. Go to `http://localhost:3001/pension/apply-for-veteran-pension-form-21p-527ez/` in your browser

## How to verify
1. _Step 1_
2. _Step 2_
3. _Step 3_

## What areas of the site does it impact?
Pension Benefits Application

## Screenshots
### Desktop
| Before      | After       |
| ----------- | ----------- |
| Upload file | Upload file |

### Mobile (if applicable)
| Before      | After       |
| ----------- | ----------- |
| Upload file | Upload file |

### Quality Assurance & Testing
- [ ] New unit tests (if applicable)
- [ ] New E2E tests added (if applicable)
- [ ] Existing unit tests and integration tests are passing
- [ ] Existing E2E tests are passing
- [ ] No sensitive information (i.e. PII/credentials/internal URLs/etc.) is captured in logging, hardcoded, or specs
- [ ] Linting warnings have been addressed
- [ ] Documentation has been updated ([link to documentation](#) \*if necessary)
- [ ] Screenshot style, layout and content matches the design references
- [ ] [Accessibility testing](https://depo-platform-documentation.scrollhelp.site/developer-docs/wcag-2-1-success-criteria-and-foundational-testing) has been performed

### Error Handling
- [ ] Browser console contains no warnings or errors.
- [ ] Events are being sent to the appropriate logging solution
- [ ] Feature/bug has a monitor built into Datadog or Grafana (if applicable)

### Authentication
- [ ] Did you login to a local build and verify all authenticated routes work as expected with a test user

## Requested Feedback
(OPTIONAL) _What should the reviewers know in addition to the above. Is there anything specific you wish the reviewer to assist with. Do you have any concerns with this PR, why?_
