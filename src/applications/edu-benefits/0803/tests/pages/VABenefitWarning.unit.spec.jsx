import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import * as page from '../../pages/VABenefitWarning';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0803 benenfit warning page', () => {
  it('renders the static content correctly', () => {
    const { getByText } = renderPage();
    expect(
      getByText(
        'You have not previously applied and been found eligible for the VA education benefit you want to use',
      ),
    ).to.exist;
    expect(
      getByText(
        'Based on your answer, you might not qualify for reimbursement right now.',
      ),
    ).to.exist;
  });
});
