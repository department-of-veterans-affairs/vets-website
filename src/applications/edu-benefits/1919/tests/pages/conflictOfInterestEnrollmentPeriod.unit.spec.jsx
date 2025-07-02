import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';
import { conflictOfInterestEnrollmentPeriod } from '../../pages';

describe('Conflict of Interest Step 3 - Page 4', () => {
  const { schema, uiSchema } = conflictOfInterestEnrollmentPeriod;

  it('should render with an additional info section', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-additional-info', container).length).to.equal(1);
  });

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

  it('should render an error message if no start date is given', () => {
    const { container, getByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-memorable-date[error]', container).length).to.equal(0);
    getByRole('button', { name: /submit/i }).click();
    expect($$('va-memorable-date[error]', container).length).to.equal(1);
  });
});
