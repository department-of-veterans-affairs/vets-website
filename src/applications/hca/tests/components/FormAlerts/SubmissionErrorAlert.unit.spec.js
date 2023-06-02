import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import SubmissionErrorAlert from '../../../components/FormAlerts/SubmissionErrorAlert';

describe('hca <SubmissionErrorAlert>', () => {
  it('should render', () => {
    const view = render(<SubmissionErrorAlert />);
    const selector = view.container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.contain.text(
      'We didn’t receive your online application',
    );
  });

  it('should render PDF form download link', () => {
    const view = render(<SubmissionErrorAlert />);
    const selector = view.container.querySelector(
      '[data-testid="hca-fillable-pdf-link"]',
    );
    expect(selector).to.exist;
    expect(selector).to.have.attribute(
      'href',
      'https://www.va.gov/vaforms/medical/pdf/10-10EZ-fillable.pdf',
    );
  });
});
