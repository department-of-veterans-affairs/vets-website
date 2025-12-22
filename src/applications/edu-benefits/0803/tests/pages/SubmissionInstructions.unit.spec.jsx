import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import * as page from '../../pages/SubmissionInstructions';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0803 submission instructions page', () => {
  it('renders the static content correctly', () => {
    const { getByText } = renderPage();
    expect(getByText('How to submit your form')).to.exist;
    expect(
      getByText(
        'This form does not submit automatically. After you review your information, download your completed VA Form 22-0803. Then, gather the required additional attachments, and take all of your documents to QuickSubmit to complete the submission process. This is the fastest way for us to process your form.',
      ),
    ).to.exist;
  });
});
