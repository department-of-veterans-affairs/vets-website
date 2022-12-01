**Note**: Delete the description statements, complete each step. **None are optional**, but can be justified as to why they cannot be completed as written. Provide known gaps to testing that may raise the risk of merging to production.


## Summary

- *(Summarize the changes that have been made to the platform)*
- *(If bug, how to reproduce)*
- *(What is the solution, why is this the solution)*
- *(Which team do you work for, does your team own the maintainence of this component?)*
- *(If using a flipper, what is the end date of the flipper being required/success criteria being targeted)*

## Related issue(s)

- *Link to ticket created in va.gov-team repo*
- *Link to previous change of the code/bug (if applicable)*
- *Link to epic if not included in ticket*

## Testing done

- *Describe what the old behavior was prior to the change*
- *Describe the steps required to verify your changes are working as expected*
- *Describe the tests completed and the results*

## Screenshots

- [ ] *Add screenshot of current state prior to change*
- [ ] *Add screenshot showing successful change and what should be expected of those verifying your changes work as intended*

## What areas of the site does it impact?
*(Describe what parts of the site are impacted and*if*code touched other areas)*

## Acceptance criteria

- [ ]  I fixed|updated|added unit tests and integration tests for each feature (if applicable).
- [ ]  No error nor warning in the console.
- [ ]  Events are being sent to the appropriate logging solution
- [ ]  Documentation has been updated (link to documentation)
- [ ]  No sensitive information (i.e. PII/credentials/internal URLs/etc.) is captured in logging, hardcoded, or specs
- [ ]  Feature/bug has a monitor built into Datadog or Grafana (if applicable)
- [ ]  If app impacted requires authentication, did you login to a local build and verify all authenticated routes work as expected
- [ ]  I added a screenshot of the developed feature

## Requested Feedback
_What should the reviewers know in addition to the above. Is there anything specific you wish the reviewer to assist with. Do you have any concerns with this PR, why?_
