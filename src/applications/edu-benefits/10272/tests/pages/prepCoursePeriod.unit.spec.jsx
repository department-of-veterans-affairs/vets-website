import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';
import { prepCoursePeriod } from '../../pages';

describe('Edu form 22-10272 Prep Course Details Step 4 - Page 4', () => {
  const { schema, uiSchema } = prepCoursePeriod;

  it('should render with a current and/or past date ranges', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-memorable-date', container).length).to.equal(2);
  });

  it('should render error messages if no date is given', async () => {
    const { container, getByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-memorable-date[error]', container).length).to.equal(0);
    getByRole('button', { name: /submit/i }).click();
    await waitFor(() => {
      expect($$('va-memorable-date[error]', container).length).to.equal(2);
    });
  });
});
