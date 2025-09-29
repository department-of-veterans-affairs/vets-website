# VA Design System Playground

This app exists to quickly demo and manually test VA Design System web components in the vets-website environment.

## Running locally

1. Start vets-website as usual (localhost:3001). To run only this app, use `yarn watch --env entry=ds-v3-playground`.
2. Navigate to the app route `/ds-v3-playground`

---

## va-file-input-multiple (File uploads)

The `va-file-input-multiple` component in this app provides an example of using the component outside of the forms-system. The example is a recommendation and not a required approach. Implementation of the file input component is flexible and can be adapted to specific needs.

### Other File Input References

- [Component Architecture Overview](https://github.com/department-of-veterans-affairs/component-library/tree/main/packages/web-components/src/components/va-file-input-multiple) - Technical documentation for the va-file-input-multiple web component including props, events, and implementation details.

- [Files Pattern](https://design.va.gov/patterns/ask-users-for/files) - VA Design System guidance on when and how to ask users for file uploads, including accessibility and UX best practices.

- [File Input non-forms system example](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/ds-v3-playground/pages/VaFileInputMultiple.jsx) - For standalone file input components not using the forms system.

- **Forms System Patterns** - Ready-to-use patterns for integrating file inputs into vets-website forms:
  - [Multiple File Pattern](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/platform/forms-system/src/js/web-component-patterns/fileInputMultiplePattern.jsx) - For forms that need multiple file uploads with validation and error handling.
  - [Single File Pattern](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/platform/forms-system/src/js/web-component-patterns/fileInputPattern.jsx) - For forms that need a single file upload with built-in form system integration.
