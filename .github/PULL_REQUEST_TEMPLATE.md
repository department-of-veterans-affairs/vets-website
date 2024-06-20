**Note**: Delete the description statements, complete each step. **None are optional**, but can be justified as to why they cannot be completed as written. Provide known gaps to testing that may raise the risk of merging to production.

## Are you removing, renaming or moving a folder in this PR?
- [ ] No, I'm not changing any folders (skip to Summary and delete the rest of this section)
- [ ] Yes, I'm removing, renaming or moving a folder

If the folder you changed contains a `manifest.json`, search for its `entryName` in the content-build [registry.json](https://github.com/department-of-veterans-affairs/content-build/blob/main/src/applications/registry.json) (the `entryName` there will match).

If an entry for this folder exists in content-build and you are:
1. **Deleting a folder**: Delete the application entry in [registry.json](https://github.com/department-of-veterans-affairs/content-build/blob/main/src/applications/registry.json) and merge that PR **before** this one
- _Add the link to your merged content-build PR here_

2. **Renaming or moving a folder**: Update the entry in the [registry.json](https://github.com/department-of-veterans-affairs/content-build/blob/main/src/applications/registry.json), but do not merge it until your vets-website changes here are merged. The content-build PR must be merged immediately after your vets-website change is merged in to avoid CI errors with content-build (and Tugboat).
### :warning: Team Sites :warning:
Example of a Team Site: https://va.gov/health. This scenario is also referred to as the "injected" header and footer.

Did you make changes to the login modal (shown at https://www.va.gov/?next=loginModal)? TeamSites share the login modal code with va.gov and do not support web components. Please verify:

- [ ] The login modal does not contain any web components
- [ ] I used the [proxy-rewrite steps](https://github.com/department-of-veterans-affairs/vets-website/tree/main/src/applications/proxy-rewrite#that-sounds-normal-so-whats-the-proxy-all-about) to test the injected header scenario
- [ ] I reached out in the `#sitewide-public-websites` Slack channel for questions

## Summary

- _(Summarize the changes that have been made to the platform)_
- _(If bug, how to reproduce)_
- _(What is the solution, why is this the solution)_
- _(Which team do you work for, does your team own the maintenance of this component?)_
- _(If using a flipper, what is the end date of the flipper being required/success criteria being targeted)_

## Related issue(s)

- _Link to ticket created in va.gov-team repo_
department-of-veterans-affairs/va.gov-team#0000
- _Link to previous change of the code/bug (if applicable)_
department-of-veterans-affairs/vets-website#0000
- _Link to epic if not included in ticket_
department-of-veterans-affairs/va.gov-team#0000

## Testing done

- _Describe what the old behavior was prior to the change_
- _Describe the steps required to verify your changes are working as expected_
- _Describe the tests completed and the results_
- _Exclusively stating 'Specs and automated tests passing' is NOT acceptable as appropriate testing
- _Optionally, provide a link to your [test plan](https://depo-platform-documentation.scrollhelp.site/developer-docs/create-a-test-plan-in-testrail) and [test execution records](https://depo-platform-documentation.scrollhelp.site/developer-docs/execute-tests-in-testrail)_

## Screenshots

_Note: This field is mandatory for UI changes (non-component work should NOT have screenshots)._

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
- [ ] Linting warnings have been addressed
- [ ] Documentation has been updated ([link to documentation](#) \*if necessary)
- [ ] Screenshot of the developed feature is added
- [ ] [Accessibility testing](https://depo-platform-documentation.scrollhelp.site/developer-docs/wcag-2-1-success-criteria-and-foundational-testing) has been performed

### Error Handling

- [ ] Browser console contains no warnings or errors.
- [ ] Events are being sent to the appropriate logging solution
- [ ] Feature/bug has a monitor built into Datadog or Grafana (if applicable)

### Authentication

- [ ] Did you login to a local build and verify all authenticated routes work as expected with a test user

## Requested Feedback

(OPTIONAL) _What should the reviewers know in addition to the above. Is there anything specific you wish the reviewer to assist with. Do you have any concerns with this PR, why?_
