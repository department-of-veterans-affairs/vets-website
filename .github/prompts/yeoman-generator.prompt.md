# Instructions for creating a new form application using Yeoma Generator
`
Our goal is to create a new form using the `yo` command
We must provide all the necessary values for generating a new form.
If insufficient information is provided, ask the user for more details.

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

## Valid Terminal Command
yo @department-of-veterans-affairs/vets-website \
  --appName="My App" \
  --folderName="my-app" \
  --entryName="my-app" \
  --rootUrl="/my-app" \
  --isForm=true \
  --slackGroup="@my-group" \
  --contentLoc="../vagov-content" \
  --formNumber="21P-530" \
  --trackingPrefix="burials-530-" \
  --respondentBurden="30" \
  --ombNumber="2900-0797" \
  --expirationDate="12/31/2026" \
  --benefitDescription="burial benefits" \
  --usesVetsJsonSchema=false \
  --usesMinimalHeader=false \
  --templateType="WITH_1_PAGE"