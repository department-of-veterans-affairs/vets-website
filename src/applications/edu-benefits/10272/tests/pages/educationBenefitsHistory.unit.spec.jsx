import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';

describe('22-10272 Your education benefits information Step 1 - Page 2', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.educationBenefitsChapter.pages.educationBenefitsHistory;

  it('should render with a textarea', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );
    const benefitsHistoryTextarea = container.querySelector(
      'va-textarea[label="Please enter all VA education benefits you have previously applied for"',
    );

    expect(benefitsHistoryTextarea).to.exist;
    expect($$('va-textarea', container).length).to.equal(1);
  });

  it('should render an error message if the textarea has no input', async () => {
    const { container, getByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-textarea', container).length).to.equal(1);
    getByRole('button', { name: /submit/i }).click();
    await waitFor(() => {
      expect($$('va-textarea[error]', container).length).to.equal(1);
    });
  });
});
