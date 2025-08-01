import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import employmentStatusDescription from '../../../../pages/03-employment-information-chapter/employmentStatusDescription';

describe('Employment Status Description Page', () => {
  it('renders the textarea with the correct label', () => {
    const form = render(
      <DefinitionTester
        schema={employmentStatusDescription.schema}
        uiSchema={employmentStatusDescription.uiSchema}
        data={{ employmentStatus: 'UNEMPLOYED' }}
      />,
    );
    const { container } = form;
    const textarea = $(
      'va-textarea[label="Describe your employment situation."]',
      container,
    );
    expect(textarea).to.exist;
  });
});
