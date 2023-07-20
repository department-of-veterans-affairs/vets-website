import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import EnrollmentStatusWarning from '../../../../../components/IntroductionPage/EnrollmentStatus/Warning';

describe('hca <EnrollmentStatusWarning>', () => {
  describe('when the component renders', () => {
    const props = {
      applicationDate: '2019-04-24T12:00:00.000-00:00',
      enrollmentDate: '2019-04-30T12:00:00.000-00:00',
      enrollmentStatus: 'enrolled',
      preferredFacility: '463 - CHEY6',
    };
    it('renders a `warning` alert', () => {
      const { container } = render(<EnrollmentStatusWarning {...props} />);
      const alertBox = container.querySelector('va-alert');
      expect(alertBox).to.exist;
      expect(alertBox).to.have.attribute('status', 'warning');
    });
  });
});
