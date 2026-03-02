# form-renderer

form-renderer is a library containing FormRenderer, a reusable React component for rendering Fully Digital Forms. For further information about the Fully Digital Forms, see this [initiative issue](https://github.com/department-of-veterans-affairs/va.gov-team/issues/115163) or join the [#benefits-fullydigitalforms](https://dsva.slack.com/archives/C09789GSPB8) channel.

# Shared FormRenderer component

FormRenderer is a React component that renders a Veteran-submitted form, given the following props:

| name   | value                                                   |
| ------ | ------------------------------------------------------- |
| config | JSON describing structure and formatting of the VA form |
| data   | JSON canonical representation of a form submission      |

Example usage in a VA.gov React application:

```js
import FormRenderer from 'platform/form-renderer/FormRenderer';

const form1234Config = {
  sections: [
    {
      label: "Veteran information",
      parts: [
        {
          label: "Name",
          value: "{{name.first}} {{name.last}}",
        }
      ]
    }
  ]
};
const form1234Submission = {
  name: {
    first: "John",
    last: "Smith",
  }
};

<FormRenderer config={form1234Config} data={form1234Submission} />
```

## Technical notes

This is configured as a yarn workspace, so code can be imported using the `@department-of-veterans-affairs/form-renderer` identifier.

For more information, please read [the Platform documentation on "Yarn Workspaces"](https://depo-platform-documentation.scrollhelp.site/developer-docs/yarn-workspaces).

