# Unit tests

- Use chai, mocha, sinon, and react-testing-library (RTL) for unit tests.
- Use DefinitionTester if working with RJSF (React JSON Schema Form).
- Use Provider to wrap all DefinitionTester tests, and any component using Redux.

If we are testing RJSF, use DefinitionTester
```js
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
```

Example:
```js
const getProps = () => {
  return {
    mockStore: {
      getState: () => ({
        form: { data: {} },
      }),
      subscribe: () => {},
      dispatch: () => ({
        setFormData: () => {},
      }),
    },
  };
};

const expectedFieldTypesWebComponents =
  'va-text-input, va-select, va-textarea, va-radio, va-checkbox, va-memorable-date';
const wrapperWebComponents = 'va-checkbox-group, va-memorable-date';

it('should show the correct number of errors on submit for web components', () => {
    const { mockStore } = getProps();

    const { container, getByRole } = render(
    <Provider store={mockStore}>
        <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={data}
        formData={{}}
        />
    </Provider>,
    );

    getByRole('button', { name: /submit/i }).click();
    const nodes = Array.from(
    container.querySelectorAll(
        `${expectedFieldTypesWebComponents}, ${wrapperWebComponents}`,
    ),
    );
    const errors = nodes.filter(node => node.error);
    expect(errors).to.have.lengthOf(expectedNumberOfErrors);
});
```