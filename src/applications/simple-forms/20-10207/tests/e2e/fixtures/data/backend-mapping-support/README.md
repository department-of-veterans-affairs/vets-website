# Data-fixtures for Back-end Mapping

This README doc describes the organization of data-fixture files in this folder. There are many files here because we have 4 different preparer-types [stories], plus some internal optional pages that depend on checkbox-selections within each preparer-type stories.

## Stories & data

### Veteran story

This is the story (or flow) for the Veteran preparer, the 1st (default) 4 stories.

- veteran-minimal.json:
  - has basically just the required data for the story.
- veteran-maximal-1.json:
  - has above plus all optional data for 1st livingSituation conditional-branch:
    - liviningSituation only has 'NONE' selected
    - mailingAddressYesNo is true
    - mailingAddressYesNo's true triggers optional veteranMailingAddress optional-page, where this fixture fills all address fields.
- veteran-maximal-2.json:
  - has veteran-minimal data plus all optional data for 2nd livingSituation conditional-branch:
    - liviningSituation only has all options selected except 'NONE'
    - mailingAddressYesNo is false
    - mailingAddressYesNo's true hides veteranMailingAddress optional-page.

### Non-veteran story

nonVeteran.minimal.json, nonVeteran-maximal-1.json, & nonVeteran-maximal-2.json are organized the same way as for Veteran story, except with nonVeteran fields/values.

### Third-party-veteran story

thirdPartyVeteran.minimal.json, thirdPartyVeteran-maximal-1.json, & thirdPartyVeteran-maximal-2.json are organized the same way as for Veteran story, plus third-party data.

### Third-party-non-veteran story

thirdPartyNonVeteran.minimal.json, thirdPartyNonVeteran-maximal-1.json, & thirdPartyNonVeteran-maximal-2.json are organized the same way as for Non-veteran story, plus third-party data.

## Optional evidence (file-upload) pages

Depending on otherReasons User-selections, we'll have evidence....js optional pages come up in the form-flow. There're NO file-upload data in our fixture-files, so be sure to handle the file-uploads in the backend.

Update front-end's initially-defined upload-URLs as needed to work better with backend endpoints.

## Questions?

If you have further questions about the fixture-files or data organization, please contact Tze Lei, Sr. Software Engineer FEBE, Ad Hoc LLC.
[email: tze@adhocteam.us; Slack: @Tze Lei; GitHub: @tlei123]
