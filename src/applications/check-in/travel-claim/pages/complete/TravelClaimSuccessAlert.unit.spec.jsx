/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { format } from 'date-fns';
import TravelClaimSuccessAlert from './TravelClaimSuccessAlert';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import { setupI18n, teardownI18n } from '../../../utils/i18n/i18n';

describe('Check-in experience', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('travel-claim', () => {
    describe('TravelClaimSuccessAlert', () => {
      it('renders the travel pay message', () => {
        const dateString = format(new Date(), 'MMMM dd, yyyy');
        const { getByTestId } = render(
          <CheckInProvider>
            <TravelClaimSuccessAlert />
          </CheckInProvider>,
        );
        expect(getByTestId('travel-pay-message')).to.exist;
        expect(getByTestId('travel-pay--claim--submitted')).to.have.text(
          `This claim is for your appointment on ${dateString}. We’ll send you a text to let you know the status of your claim.`,
        );
      });
    });
  });
});
