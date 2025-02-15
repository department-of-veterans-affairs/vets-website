# Form Upload Tool README

The Form Upload tool was developed by the Veteran Facing Forms team to provide an application where a Veteran can upload a PDF of their form. Their upload would travel through Lighthouse to the [Benefits Intake API](https://developer.va.gov/explore/api/benefits-intake/docs?version=current) and then along to Central Mail/VBMS. Currently, APIs other than the Benefits Intake API are not supported.

## Adding a new form to the Form Upload Tool

The Form Upload tool launched with support for four forms: `21-0779`, `21-509`, `21P-0518-1`, and `21P-0516-1`. If you'd like to add support for additional forms, follow the steps below.

1. Follow the instructions in the `vets-api` repo to add support from the back end.

Explanation: It's best to enable the additional form(s) on the backend before enabling them on the front end.

2. Add an entry to [this array](https://github.com/department-of-veterans-affairs/vets-website/blob/a95dc7bcbc929ca097daab034c3b74b7a5957815/src/applications/simple-forms/form-upload/routes.jsx#L6).

Explanation: This array allows routes for the specified form ids.

3. Add an entry to [this object](https://github.com/department-of-veterans-affairs/vets-website/blob/a95dc7bcbc929ca097daab034c3b74b7a5957815/src/applications/simple-forms/form-upload/helpers/index.js#L9-L29).

Explanation: The `formMappings` object specifies two pieces of text that the Form Upload tool needs: sub-title and PDF download URL.

4. Add an entry similar to [this line in this object](https://github.com/department-of-veterans-affairs/vets-website/blob/a95dc7bcbc929ca097daab034c3b74b7a5957815/src/platform/forms/constants.js#L23).

Explanation: Enables prefill.

5. Add an entry similar to [this object in this array](https://github.com/department-of-veterans-affairs/vets-website/blob/a95dc7bcbc929ca097daab034c3b74b7a5957815/src/platform/forms/constants.js#L464-L470).

Explanation: Enables prefill.