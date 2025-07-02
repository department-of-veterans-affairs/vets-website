# [CST][ENG] Migrate va-file-input v43.0.2 to va-file-input-multiple latest version

## Goal
Replace the Claims Status Application's current file input implementation with the `va-file-input-multiple` latest version  while preserving all existing functionality and ensuring no user experience regression.

## Background
The current implementation of the file input uses the `va-file-input` v43.0.2 and extra logic to create a way for users to input multiple files at once. v43 of the `va-file-input` is the USWDS v1 while v44 of the file `va-file-input` is the USWDS v3. This large change resulted in no longer being able to use the same extra logic to allow users to input multiple files at once. It was requested that there was a `va-file-input-multiple` that implemented this multiple input ability within a web component. This was created, but there was multiple issues that were then attempted to be resolved. Both engineers from the team that worked on the component and fixes are no longer on that team.

## Tasks
- [x] Validate that we can access data from `va-file-input-multiple` children inputs
- [x] Outline current file input functionality (found in src/applications/claims-status/components/claim-files-tab/file-input-multiple/file-input-multiple-user-stories.md)
- [ ] Test Driven Development of updated `AddFilesForm.jsx` which is currently named `NewAddFilesForm.jsx` using `va-file-input-multiple` and aligning with the user stories outlined in src/applications/claims-status/components/claim-files-tab/file-input-multiple/file-input-multiple-user-stories.md. Use e2e testing since that works much better that unit testing with web components.
    - [x] 1
    - [x] 2
    - [x] 3
    - [x] 4
    - [x] 5
    - [x] 6
    - [ ] 7
    - [ ] 8
    - [ ] 9
    - [ ] 10
    - [ ] 11
    - [ ] 12
    - [ ] 13
    - [ ] 14
    - [ ] 15
    - [ ] 16
    - [ ] 17
    - [ ] 18
    - [ ] 19
    - [ ] 20
    - [ ] 21
    - [ ] 22
- [ ] Ensure submitting to backend as expected
- [ ] Add unit testing where applicable

## Acceptance Criteria
- [ ] All existing functionality is preserved and no user experience regressions exist - this doc outlines the current user stories: [file-input-multiple-implementation.md](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/claim-appeal-status/engineering/file-input-multiple-implementation.md)
- [ ] File submission works with existing backend endpoints
