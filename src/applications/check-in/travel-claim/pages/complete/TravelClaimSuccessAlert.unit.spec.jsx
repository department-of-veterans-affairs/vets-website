/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import TravelClaimSuccessAlert from './TravelClaimSuccessAlert';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';

describe('Check-in experience', () => {
  describe('travel-claim', () => {
    describe('TravelClaimSuccessAlert', () => {
      const multiFacility = [
        {
          stationNo: '622',
          startTime: '2024-03-12T19:53:22.881Z',
          appointmentCount: 1,
          facility: 'VA Facility 3',
        },
        {
          stationNo: '530',
          startTime: '2024-03-12T15:53:22.881Z',
          appointmentCount: 2,
          facility: 'Example Veterans Hospital',
        },
      ];
      const singleFacilityOneAppointment = [
        {
          stationNo: '622',
          startTime: '2024-03-12T18:28:22.404Z',
          appointmentCount: 1,
          facility: 'VA Facility 2',
        },
      ];
      const singleFacilityTwoAppointments = [
        {
          stationNo: '500',
          startTime: '2024-03-12T17:55:31.785Z',
          appointmentCount: 2,
          facility: 'VA Facility 2',
        },
      ];
      it('renders correct content if only one facility and one appointment', () => {
        const { getByTestId } = render(
          <CheckInProvider>
            <TravelClaimSuccessAlert claims={singleFacilityOneAppointment} />
          </CheckInProvider>,
        );
        expect(
          getByTestId('travel-pay-single-claim-single-appointment-submitted'),
        ).to.exist;
      });
      it('renders correct content if only one facility and multiple apppointments', () => {
        const { getByTestId } = render(
          <CheckInProvider>
            <TravelClaimSuccessAlert claims={singleFacilityTwoAppointments} />
          </CheckInProvider>,
        );
        expect(
          getByTestId('travel-pay-single-claim-multi-appointment-submitted'),
        ).to.exist;
      });
      it('renders correct content if more than one facility', () => {
        const { getByTestId } = render(
          <CheckInProvider>
            <TravelClaimSuccessAlert claims={multiFacility} />
          </CheckInProvider>,
        );
        expect(
          getByTestId('travel-pay-multi-claim-multi-appointment-submitted'),
        ).to.exist;
      });
    });
  });
});
