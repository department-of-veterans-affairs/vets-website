# Form Upload Tool README

The Form Upload tool was developed by the Veteran Facing Forms team to provide an application where a Veteran can upload a PDF of their form. Their upload would travel through Lighthouse to the [Benefits Intake API](https://developer.va.gov/explore/api/benefits-intake/docs?version=current) and then along to Central Mail/VBMS. Currently, APIs other than the Benefits Intake API are not supported.

## Adding a new form to the Form Upload Tool

The Form Upload tool launched with support for four forms: `21-0779`, `21-509`, `21P-0518-1`, and `21P-0516-1`. If you'd like to add support for additional forms, you can use the automated script or follow the manual steps below.

### Automated Method: Using the Add Form Script

We've created a script that automates steps 2-4 below. After completing step 1 in the `vets-api` repo, you can use this script to add a new form to the Form Upload tool:

#### Usage

```bash
# With all parameters specified
node script/add-form-upload-form.js --formId=21-XXXX --title="Form Title" --url="https://www.vba.va.gov/pubs/forms/VBA-21-XXXX-ARE.pdf"

# Or, with just the form ID (you'll be prompted for the rest)
node script/add-form-upload-form.js --formId=21-XXXX

# Or, with no parameters (you'll be prompted for all information)
node script/add-form-upload-form.js
```

#### Parameters

- `--formId`: The form ID (e.g., 21-0779). Any letters in the form ID will be automatically uppercased when added to constants.js (e.g., 21p-0518-1 becomes 21P-0518-1)
- `--title`: The form subtitle (displayed to users). If the title contains single quotes, they will be automatically escaped in the output files.
- `--url`: The URL to the PDF download

### Manual Method: Step-by-Step

#### 1. Follow the instructions in the `vets-api` repo

- [Follow the instructions here](https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/simple_forms_api/docs/form_upload_tool_README.md) to enable the form on the back-end.

  **Why?**  
  It's best to enable the additional form(s) on the backend before enabling them on the front end.

#### 2. Enable the routes

- Add an entry to [this array](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/simple-forms/form-upload/routes.jsx#L6-L13).

  **Why?**  
  This array enables routes for the specified form ids.

#### 3. Add necessary text elements

- Add an entry to [this object](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/simple-forms/form-upload/helpers/index.js#L9-L39).

  **Why?**  
  The `formMappings` object specifies two pieces of text that the Form Upload tool needs: sub-title and PDF download URL.

#### 4. Add the form to the prefill configuration

- Add an entry similar to [this line in this object](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/platform/forms/constants.js#L23).

  **Why?**  
  This registers the form for Save in Progress functionality.

- Add an entry similar to [this object in this array](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/platform/forms/constants.js#L295-L300).

  **Why?**  
  This provides some Save in Progress metadata.

- Add an entry to the getAllFormLinks function in this file. (https://github.com/department-of-veterans-affairs/vets- website/blob/main/src/platform/forms/constants.js#L164).

  **Why?**
  My VA uses this to generate clickable links to saved forms. Without this entry, users won't be able to access their saved form from My VA.
