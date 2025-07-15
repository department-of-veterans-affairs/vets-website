import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import SubmissionError from '../../../config/submissionError';

describe('SubmissionError', () => {
  it('renders the alert with headline and links', () => {
    const { getByText, getByRole, container } = render(<SubmissionError />);

    const alert = container.querySelector('#submission-error');
    expect(alert).to.exist;

    const headline = getByText('The form can’t be submitted');
    expect(headline).to.exist;

    const poaLink = getByRole('link', { name: /VA Form 21-22/i });
    expect(poaLink).to.have.attribute(
      'href',
      'https://www.va.gov/get-help-from-accredited-representative/appoint-rep/introduction/',
    );

    const backLink = getByRole('link', {
      name: /Go back to submissions page/i,
    });
    expect(backLink).to.have.attribute('href', '/representative/submissions');
  });
});
