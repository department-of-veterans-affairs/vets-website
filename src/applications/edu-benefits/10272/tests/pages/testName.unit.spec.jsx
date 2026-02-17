import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';

describe('22-10272 Licensing and Certification Details Step 3 - Page 1', () => {
  const { schema, uiSchema } =
    formConfig.chapters.licensingAndCertificationChapter.pages.testName;

  it('should render with a text input field', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );
    const testNameTextInput = container.querySelector(
      `va-text-input[label^="What's the name of the licensing"`,
    );

    expect(testNameTextInput).to.exist;
    expect($$('va-text-input', container).length).to.equal(1);
  });

  it('should render an error message if the text input has no input', async () => {
    const { container, getByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-text-input', container).length).to.equal(1);
    getByRole('button', { name: /submit/i }).click();
    await waitFor(() => {
      expect($$('va-text-input[error]', container).length).to.equal(1);
    });
  });
});
