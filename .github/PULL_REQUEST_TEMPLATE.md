**Note**: Delete the description statements, complete each step. **None are optional**, but can be justified as to why they cannot be completed as written. Provide known gaps to testing that may raise the risk of merging to production.

## Summary

> ### _(Summarize the changes that have been made to the platform)_

> ### _(If bug, how to reproduce)_

> ### _(What is the solution, why is this the solution)_

> ### _(Which team do you work for, does your team own the maintenance of this component?)_

> ### _(If using a flipper, what is the end date of the flipper being required/success criteria being targeted)_

## Related issue(s)

- _Link to ticket created in va.gov-team repo_
  - Closes department-of-veterans-affairs/va.gov-team#00000
- _Link to previous change of the code/bug (if applicable)_
  - department-of-veterans-affairs/vets-website#00000
- _Link to epic if not included in ticket_
  - department-of-veterans-affairs/va.gov-team#00000

## Testing done

> ### _Describe what the old behavior was prior to the change_

> ### _Describe the steps required to verify your changes are working as expected_

> ### _Describe the tests completed and the results_

> ### _Optionally, provide a link to your [test plan](https://depo-platform-documentation.scrollhelp.site/developer-docs/create-a-test-plan-in-testrail) and [test execution records](https://depo-platform-documentation.scrollhelp.site/developer-docs/execute-tests-in-testrail)_

## Screenshots

_Note: This field is mandatory for UI changes (non-UI work should NOT have screenshots)._

|         | Before | After |
| ------- | ------ | ----- |
| Mobile  |        |       |
| Desktop |        |       |

## What areas of the site does it impact?

> ### _(Describe what parts of the site are impacted)_

## Acceptance criteria

- [ ] I fixed|updated|added unit tests and integration tests for each feature (if applicable).
- [ ] No error nor warning in the console.
- [ ] Events are being sent to the appropriate logging solution
- [ ] Documentation has been updated (link to documentation)
- [ ] No sensitive information (i.e. PII/credentials/internal URLs/etc.) is captured in logging, hardcoded, or specs
- [ ] Feature/bug has a monitor built into Datadog or Grafana (if applicable)
- [ ] If app impacted requires authentication, did you login to a local build and verify all authenticated routes work as expected
- [ ] I added a screenshot of the developed feature
- [ ] [Accessibility foundational testing](https://depo-platform-documentation.scrollhelp.site/developer-docs/wcag-2-1-success-criteria-and-foundational-testing) has been performed

## Requested Feedback / Step-by-Step Testing Scenario

(OPTIONAL)_What should the reviewers know in addition to the above. Is there anything specific you wish the reviewer to assist with. Do you have any concerns with this PR, why?_
