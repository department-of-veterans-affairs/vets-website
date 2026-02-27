import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/eligibilityWarning';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0989 eligibility warning page', () => {
  it('renders the static content correctly', () => {
    const { getByText } = renderPage();
    expect(
      getByText(
        'Based on your responses, you may not be eligible for entitlement restoration at this time',
      ),
    ).to.exist;
    expect(
      getByText(
        'You have not attended a school that suspended, closed, or withdrew your program.',
      ),
    ).to.exist;
  });
});
