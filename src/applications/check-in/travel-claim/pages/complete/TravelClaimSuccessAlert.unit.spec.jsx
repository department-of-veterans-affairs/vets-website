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
        const { getByText } = render(
          <CheckInProvider>
            <TravelClaimSuccessAlert appointments={singleFacility} />
          </CheckInProvider>,
        );
        expect(
          getByText(
            'This claim is for your appointment on February 23, 2024 at Wompsville. We’ll send you a text to let you know the status of your claim.',
          ),
        ).to.exist;
      });
      it('renders correct content if only one apppointment', () => {
        const { getByText } = render(
          <CheckInProvider>
            <TravelClaimSuccessAlert appointments={singleAppointment} />
          </CheckInProvider>,
        );
        expect(
          getByText(
            'This claim is for your appointment on February 23, 2024 at Wompsville. We’ll send you a text to let you know the status of your claim.',
          ),
        ).to.exist;
      });
      it('renders correct content if more than one facility', () => {
        const { getByText } = render(
          <CheckInProvider>
            <TravelClaimSuccessAlert appointments={multiFacility} />
          </CheckInProvider>,
        );
        expect(
          getByText(
            'These claims are for appointments on February 23, 2024 at Chittenango, Wompsville, and Canastota. We’ll send you a text to let you know the status of your claims.',
          ),
        ).to.exist;
      });
    });
  });
});
