import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/submissionInstructions';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0989 submission instructions page', () => {
  it('renders the static content correctly', () => {
    const { getByText } = renderPage();
    expect(getByText('How to submit your form')).to.exist;
    expect(getByText(/This form does not submit automatically/)).to.exist;
  });
});
