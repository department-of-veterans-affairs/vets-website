# Copilot Instructions
This is a monorepo for VA.gov, with shared code in `src/platform` and individual React applications under `src/applications`.

## General Instructions
- vets-website uses yarn, Javascript, React, RJSF, Redux, React router, platform/forms-system, platform/forms, and the va.gov design system.
- Use prettier conventions with 2 spaces for indentation, single quotes, and trailing commas.
- When using React, prefer web components such as va-button, va-text-input, or VaButton, VaTextInput, instead of HTML elements.
- When working with forms, reference `.github/prompts/forms.prompt.md` for guidance on creating or updating forms.
- When using RJSF, prefer web component patterns from `platform/forms-system/src/js/web-component-patterns` for individual fields for both uiSchema and schema such as textUI and textSchema.
- Use `src/applications/manifest-catalog.json` to find application directories.
- Use `src/platform/forms-system/src/js/web-component-patterns/web-component-patterns-catalog.json` to find RJSF web component patterns.
- For unit tests, use mocha, chai, sinon, and prefer RTL over Enzyme.
- Prefer functional components and hooks for new components.
- Files should end with a newline.
- Use ’ instead of ' for apostrophes in text content.
- Use `yarn lint:js:working:fix` to fix formatting issues.
- All code should conform to WCAG 2.2 AA and Section 508 accessibility guidelines.