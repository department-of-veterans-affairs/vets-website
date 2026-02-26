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

describe('22-0976 submission instructions page', () => {
  it('renders the static content correctly', () => {
    const { getByText } = renderPage();
    expect(
      getByText(
        'You’ll need to upload supporting documents regarding your institution’s financial health',
      ),
    ).to.exist;
    expect(
      getByText(
        /Have documentation that can support the status of your institution/,
      ),
    ).to.exist;
  });
});
