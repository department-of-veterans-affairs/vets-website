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
  });
});
