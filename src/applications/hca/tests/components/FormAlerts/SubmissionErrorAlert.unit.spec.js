import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import SubmissionErrorAlert from '../../../components/FormAlerts/SubmissionErrorAlert';

describe('hca <SubmissionErrorAlert>', () => {
  describe('when the component renders', () => {
    it('should render `va-alert` with correct title', () => {
      const { container } = render(<SubmissionErrorAlert />);
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.contain.text(
        'We didn’t receive your online application',
      );
    });
    it('should render PDF form download link', () => {
      const { container } = render(<SubmissionErrorAlert />);
      const selector = container.querySelector(
        '[data-testid="hca-fillable-pdf-link"]',
      );
      expect(selector).to.exist;
      expect(selector).to.have.attribute(
        'href',
        'https://www.va.gov/vaforms/medical/pdf/10-10EZ-fillable.pdf',
      );
    });
  });
});
