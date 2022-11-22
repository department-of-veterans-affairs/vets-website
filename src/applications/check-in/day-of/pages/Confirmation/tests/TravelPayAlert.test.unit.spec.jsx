import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { I18nextProvider } from 'react-i18next';

import i18n from '../../../../utils/i18n/i18n';

import TravelPayAlert from '../TravelPayAlert';

describe('check in', () => {
  describe('TravelPayAlert', () => {
    it('renders a eligible message', () => {
      const component = render(
        <I18nextProvider i18n={i18n}>
          <TravelPayAlert
            travelPayEligible
            travelPayClaimData={{ claimdata: true }}
          />
        </I18nextProvider>,
      );
      expect(component.getByTestId('travel-pay-eligible-success-message')).to
        .exist;
      expect(
        component.getByTestId('travel-pay-eligible-success-message'),
      ).to.have.text(
        'You can check the status of your travel reimbursement claim online 24/7 on the Beneficiary Travel Self Service System (BTSSS). You can access BTSSS through the AccessVA travel claim portal.',
      );
    });
    it('renders a not eligible message', () => {
      const component = render(
        <I18nextProvider i18n={i18n}>
          <TravelPayAlert travelPayEligible={false} />
        </I18nextProvider>,
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
        <I18nextProvider i18n={i18n}>
          <TravelPayAlert
            travelPayEligible
            travelPayClaimError
            travelPayClaimErrorCode="CLM_011_LOL_DUNNO"
          />
        </I18nextProvider>,
      );
      expect(component.getByTestId('travel-pay-claim-error-message')).to.exist;
      expect(
        component.getByTestId('travel-pay-claim-error-message'),
      ).to.have.text(
        "We're sorry something went wrong on our end. We can't file a travel reimbursement claim for you now. But you can still file within 30 days of the appointment.",
      );
    });
    it('renders a already exists api error message', () => {
      const component = render(
        <I18nextProvider i18n={i18n}>
          <TravelPayAlert
            travelPayEligible
            travelPayClaimError
            travelPayClaimErrorCode="CLM_002_CLAIM_EXISTS"
          />
        </I18nextProvider>,
      );
      expect(component.getByTestId('travel-pay-claim-error-message')).to.exist;
      expect(
        component.getByTestId('travel-pay-claim-error-message'),
      ).to.have.text(
        'You can check the status of your travel reimbursement claim online 24/7 on the Beneficiary Travel Self Service System (BTSSS). You can access BTSSS through the AccessVA travel claim portal.',
      );
    });
  });
});
