/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import TravelClaimSuccessAlert from './TravelClaimSuccessAlert';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import {
  singleFacility,
  multiFacility,
} from '../../../travel-claim/pages/travel-intro/testAppointments';

describe('Check-in experience', () => {
  describe('shared components', () => {
    describe('TravelClaimSuccessAlert', () => {
      it('renders correct content if only one facility', () => {
        const { getByTestId } = render(
          <CheckInProvider>
            <TravelClaimSuccessAlert appointments={singleFacility} />
          </CheckInProvider>,
        );
        expect(getByTestId('travel-pay-message-single-facility')).to.exist;
      });
      it('renders correct content if only more than facility', () => {
        const { getByTestId, getByText } = render(
          <CheckInProvider>
            <TravelClaimSuccessAlert appointments={multiFacility} />
          </CheckInProvider>,
        );
        expect(getByTestId('travel-pay-message-mulitple-facilities')).to.exist;
        expect(
          getByText(
            'These claims are for appointments on February 23, 2024 at Chittenango, Wompsville, and Canastota. We’ll send you a text to let you know the status of your claims.',
          ),
        ).to.exist;
      });
    });
  });
});
