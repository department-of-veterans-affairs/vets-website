import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';
import { prepCourseAddress } from '../../pages';

describe('Edu form 22-10272 Prep Course Details Step 4 - Page 2', () => {
  const { schema, uiSchema } = prepCourseAddress;

  const formData = {
    prepCourseOrganizationAddress: { country: 'USA' },
  };

  it('should render with text and select input fields', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
      />,
    );

    expect($$('va-text-input', container).length).to.equal(6);
    expect($$('va-select', container).length).to.equal(1);
  });

  it('should render error messages if nothing is entered', async () => {
    const { container, getByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
      />,
    );

    expect($$('va-text-input[error]', container).length).to.equal(0);
    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      expect($$('va-text-input[error]', container).length).to.equal(4);
      expect($$('va-select[error]', container).length).to.equal(1);
    });
  });
});
