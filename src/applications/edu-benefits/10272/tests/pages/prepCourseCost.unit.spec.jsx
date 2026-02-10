import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';
import { prepCourseCost } from '../../pages';

describe('Edu form 22-10272 Prep Course Details Step 4 - Page 5', () => {
  const { schema, uiSchema } = prepCourseCost;

  it('should render with a current and/or past date ranges', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-text-input', container).length).to.equal(1);
  });

  it('should render error messages if no date is given', async () => {
    const { container, getByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-text-input[error]', container).length).to.equal(0);
    getByRole('button', { name: /submit/i }).click();
    await waitFor(() => {
      expect($$('va-text-input[error]', container).length).to.equal(1);
    });
  });
});
