import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';

describe('22-10272 Your education benefits information Step 1 - Page 1', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.educationBenefitsChapter.pages.hasPreviouslyApplied;

  it('should render with a yesNo radio button', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );
    const previouslyAppliedRadio = container.querySelector(
      'va-radio[label="Have you applied for VA education benefits before?"',
    );

    expect(previouslyAppliedRadio).to.exist;
    expect($$('va-radio-option', container).length).to.equal(2);
  });

  it('should render an error message if no radio button is selected', async () => {
    const { container, getByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-radio-option', container).length).to.equal(2);
    getByRole('button', { name: /submit/i }).click();
    await waitFor(() => {
      expect($$('va-radio[error]', container).length).to.equal(1);
    });
  });
});
