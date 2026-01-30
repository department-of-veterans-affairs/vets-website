import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';

describe('payeeNumber', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.personalInformationChapter.pages.payeeNumber;

  it('should render with a text input field', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );
    const payeeNumberTextInput = container.querySelector(
      'va-text-input[label="Payee number"',
    );

    expect(payeeNumberTextInput).to.exist;
    expect($$('va-text-input', container).length).to.equal(1);
  });

  it('should not render an error message if the input valid', async () => {
    const formData = { payeeNumber: 'M2' };

    const { container, getByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
      />,
    );

    await waitFor(() => {
      getByRole('button', { name: /submit/i }).click();
      expect($$('va-text-input[error]', container).length).to.equal(0);
    });
  });

  it('should render an error message if the input is invalid', async () => {
    const formData = { payeeNumber: '#3' };

    const { container, getByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
      />,
    );

    await waitFor(() => {
      getByRole('button', { name: /submit/i }).click();
      expect(
        $$(
          'va-text-input[error="Enter your response in a valid format"]',
          container,
        ).length,
      ).to.equal(1);
    });
  });
});
