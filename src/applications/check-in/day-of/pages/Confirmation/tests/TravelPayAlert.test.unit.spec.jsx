import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import CheckInProvider from '../../../../tests/unit/utils/CheckInProvider';
import TravelPayAlert from '../TravelPayAlert';

describe('check in', () => {
  describe('TravelPayAlert', () => {
    it('renders a eligible message', () => {
      const component = render(
        <CheckInProvider>
          <TravelPayAlert
            travelPayEligible
            travelPayClaimData={{ claimdata: true }}
          />
        </CheckInProvider>,
      );
      expect(component.getByTestId('travel-pay-eligible-success-message')).to
        .exist;
      expect(
        component.getByTestId('travel-pay-eligible-success-message'),
      ).to.have.text(
        'We’re processing your travel reimbursement claim. We’ll send you a text to let you know the status of your claim.',
      );
    });
    it('renders a not eligible message', () => {
      const component = render(
        <CheckInProvider>
          <TravelPayAlert travelPayEligible={false} />
        </CheckInProvider>,
      );
      expect(component.getByTestId('travel-pay-not-eligible-message')).to.exist;
      expect(
        component.getByTestId('travel-pay-not-eligible-message'),
      ).to.have.text(
        'We’re sorry. We can’t file this type of travel reimbursement claim for you now. But you can still file within 30 days of the appointment.',
      );
    });
    it('renders a generic api error message', () => {
      const component = render(
        <CheckInProvider>
          <TravelPayAlert travelPayEligible travelPayClaimError />
        </CheckInProvider>,
      );
      expect(component.getByTestId('travel-pay-error-message')).to.exist;
      expect(component.getByTestId('travel-pay-error-message')).to.have.text(
        "We’re sorry, something went wrong on our end. We can't file a travel reimbursement claim for you now. But you can still file within 30 days of the appointment.",
      );
    });
  });
});
