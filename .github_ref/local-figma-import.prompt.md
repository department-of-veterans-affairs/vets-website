# Figma import instructions

- Prefer using Figma Framelink MPC and inform the user if they are not using it.
- Validate that the user has provided a figma URL with a node-id. If not, tell the user to provide a figma URL by right clicking on the frame and selecting "Copy as" > "Copy link to selection".
- When parsing figma data, we typically just care about the immediate title directly above the fields and the fields for building a page
- Do not take in consideration the header or footer or stepper information.
- use titleUI, titleSchema for the title and web component patterns for the fields.

Look at [forms pages adding or updating](../.github/prompts/add-edit-form-page.prompt.md) instructions on how to implement.

Validate.