import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { setupI18n, teardownI18n } from '../../../../utils/i18n/i18n';
import CheckInProvider from '../../../../tests/unit/utils/CheckInProvider';
import TravelPayAlert from '../TravelPayAlert';

describe('check in', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('TravelPayAlert', () => {
    it('renders a eligible message', () => {
      const component = render(
        <CheckInProvider>
          <TravelPayAlert
            travelPayClaimError={false}
            travelPayClaimRequested
            travelPayEligible
          />
        </CheckInProvider>,
      );
      expect(component.getByTestId('travel-pay-message-success')).to.exist;
      expect(component.getByTestId('travel-pay-message-success')).to.have.text(
        'We’re processing your travel reimbursement claim. We’ll send you a text to let you know the status of your claim.',
      );
    });
    it('renders a not eligible message', () => {
      const component = render(
        <CheckInProvider>
          <TravelPayAlert
            travelPayClaimError={false}
            travelPayClaimRequested
            travelPayEligible={false}
          />
        </CheckInProvider>,
      );
      expect(component.getByTestId('travel-pay-message-ineligible')).to.exist;
      expect(
        component.getByTestId('travel-pay-message-ineligible'),
      ).to.have.text(
        'We’re sorry. We can’t file this type of travel reimbursement claim for you now. But you can still file within 30 days of the appointment.',
      );
    });
    it('renders a generic api error message', () => {
      const component = render(
        <CheckInProvider>
          <TravelPayAlert
            travelPayClaimError
            travelPayClaimRequested
            travelPayEligible
          />
        </CheckInProvider>,
      );
      expect(component.getByTestId('travel-pay-message-error')).to.exist;
    });
    it('renders a renders an info message if the veteran opted out', () => {
      const component = render(
        <CheckInProvider>
          <TravelPayAlert
            travelPayClaimError
            travelPayClaimRequested={false}
            travelPayEligible
          />
        </CheckInProvider>,
      );
      expect(component.getByTestId('travel-pay-info-message')).to.exist;
    });
  });
});
