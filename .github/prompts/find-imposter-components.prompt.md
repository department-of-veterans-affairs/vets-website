---
mode: 'agent'
---
### Task

Identify and list any components in the codebase that may be considered "imposter" components, meaning they do not accurately represent the data or functionality they are supposed to. Provide a brief explanation for each identified component.

### Scope

Search within a single application [form-app](.github/instructions/form-app.instructions.md) for how to find the app.

### Acceptable components
- [web-component-patterns-catalog.md](src/platform/forms-system/src/js/web-component-patterns/web-component-patterns-catalog.md) is a list of RJSF components that are acceptable to use in the form app.
- Any element or component starting with va- or Va, for example:
    - `<va-button>`
    - `<VaButton>`
    - `<va-text-input>`
    - `<VaTextInput>`
- Use of `ui:webComponentField` is acceptable.

### Imposter components
- Any RJSF components that are not listed in the [web-component-patterns-catalog.md](src/platform/forms-system/src/js/web-component-patterns/web-component-patterns-catalog.md) file.
    - Examples:
        - addressUI NOT imported from web-component-patterns
        - any ui:widget
        - any date pattern not imported from web-component-patterns
- On React pages, any primitive interactive element that is not a web component or a Va component.
    - Examples:
        - <button>
        - <input>
        - <select>
        - <textarea>