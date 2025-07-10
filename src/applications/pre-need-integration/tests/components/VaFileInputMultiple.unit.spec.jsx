import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import formConfig from '../../config/form';

const getMockStore = (data = {}) => ({
  getState: () => ({ form: { data } }),
  subscribe: () => {},
  dispatch: () => ({ setFormData: () => {} }),
});

const renderFormPage = (Component, storeData = {}) => {
  const mockStore = getMockStore(storeData);
  return render(<Provider store={mockStore}>{Component}</Provider>);
};

describe('mock file input multiple page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.supportingDocuments.pages.supportingDocuments;
  const data = {};

  it('should have appropriate number of web components', () => {
    const { container } = renderFormPage(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={data}
        formData={{}}
      />,
    );
    const selector =
      'va-text-input, va-file-input-multiple, va-select, va-textarea, va-radio, va-checkbox, va-memorable-date';
    expect(container.querySelectorAll(selector)).to.have.lengthOf(1);
  });

  it('should have appropriate number of fields', () => {
    const { container } = renderFormPage(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={data}
        formData={{}}
      />,
    );
    expect(
      container.querySelectorAll('input, select, textarea'),
    ).to.have.lengthOf(0);
  });

  it('should show the correct number of errors on submit', () => {
    const { getByRole, queryAllByRole } = renderFormPage(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={data}
        formData={{}}
      />,
    );
    getByRole('button', { name: /submit/i }).click();
    const errors = queryAllByRole('alert');
    expect(errors).to.have.lengthOf(0);
  });
});
