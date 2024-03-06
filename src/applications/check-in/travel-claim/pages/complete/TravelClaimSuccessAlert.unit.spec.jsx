/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import TravelClaimSuccessAlert from './TravelClaimSuccessAlert';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import {
  singleFacility,
  multiFacility,
  singleAppointment,
} from '../travel-intro/testAppointments';

describe('Check-in experience', () => {
  describe('shared components', () => {
    describe('TravelClaimSuccessAlert', () => {
      it('renders correct content if only one facility', () => {
        const { getByTestId } = render(
          <CheckInProvider>
            <TravelClaimSuccessAlert appointments={singleFacility} />
          </CheckInProvider>,
        );
        expect(getByTestId('travel-pay-single-claim-submitted')).to.exist;
      });
      it('renders correct content if only one apppointment', () => {
        const { getByTestId } = render(
          <CheckInProvider>
            <TravelClaimSuccessAlert appointments={singleAppointment} />
          </CheckInProvider>,
        );
        expect(getByTestId('travel-pay-single-claim-submitted')).to.exist;
      });
      it('renders correct content if more than one facility', () => {
        const { getByTestId } = render(
          <CheckInProvider>
            <TravelClaimSuccessAlert appointments={multiFacility} />
          </CheckInProvider>,
        );
        expect(getByTestId('travel-pay-multi-claim-submitted')).to.exist;
      });
    });
  });
});
