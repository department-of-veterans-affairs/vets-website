---
mode: 'agent'
---
Our goal is to create a json file representing all the necessary values for generating a new form.
If insufficient information is provided, ask the user for more details.

Create or overwrite the file `.agent/tmp/new_form.json` that contain our key value pairs for generating a new form. Instructions below on key/values.

You must come up with valid values yourself based on provided context.

After you create the file, validate it using task `validate-new-form-json`. If there are errors, fix them and try again.

Once finished, show the new_form.json file to the user to confirm, and ask to confirm or edit for corrections.

Example:
```json
{
  "appName": "My Test Form",
  "folderName": "my-test-form",
  "entryName": "my-test-form",
  "rootUrl": "/my-test-form",
  "isForm": true,
  "slackGroup": "none",
  "contentLoc": "path.resolve('../vagov-content')",
  "formNumber": "21P-530",
  "trackingPrefix": "test-530-",
  "respondentBurden": "30",
  "ombNumber": "2900-0797",
  "expirationDate": "12/31/2026",
  "benefitDescription": "test benefits",
  "usesVetsJsonSchema": false,
  "usesMinimalHeader": false,
  "templateType": "WITH_1_PAGE",
}
```

## Arguments
appName: "What's the name of your application? This will be the default page title. Examples: '21P-530 Burials benefits form' or 'GI Bill School Feedback Tool'"
folderName: "What folder in `src/applications/` should your app live in? This can be a subfolder. Examples: 'burials' or 'edu-benefits/0993'"
entryName: "What should be the name of your app's entry bundle? Examples: '0993-edu-benefits' or 'feedback-tool'"
rootUrl: "What's the root url for this app? Examples: '/gi-bill-comparison-tool' or '/education/opt-out-information-sharing/opt-out-form-0993'"
formNumber: "Form number (e.g. '22-0993' or '21P-530')"
trackingPrefix: "What's the Google Analytics event prefix that you want to use? Examples: 'burials-530-' or 'edu-0993-'"
respondentBurden: "Respondent burden in minutes (e.g. '30')"
ombNumber: "OMB number (e.g. '2900-0797')"
expirationDate: "Expiration date in M/D/YYYY format (e.g. '12/31/2026')"
benefitDescription: "Benefit description (e.g. 'GI Bill benefits' or 'Burials benefits')"
templateType:
  "WITH_1_PAGE" - A form with 1 page - name and date of birth
  "WITH_4_PAGES" - A form with 4 pages - name and date of birth, identification information, mailing address, and phone and email