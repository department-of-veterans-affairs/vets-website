---
mode: 'agent'
---
### Task

Identify and list any components in the codebase that may be considered "imposter" components, meaning an regular component/element was used in place of a va- or Va component. Provide a brief explanation for each identified component, including the file name and line number where it was found, and page title. The goal is to ensure there are no imposter components in the given app or scope.

### Preferred scope

Search within a single application [form-app](.github/instructions/form-app-info.instructions.md) for imposter components.

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

### Strategy
- Figure out the best way to search for imposter components. For example any direct use of button, input, select, textarea, etc. or any use of a component that is not either in the web-component-patterns-catalog.md file or is a va- or Va component. It's possible the some have abstracted helpers, so you may need to follow references to find the actual component being used.