/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
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
    const mockData = {
      appointmentToFile: {
        stationNo: '555',
        startTime: '2021-08-19T13:56:31Z',
        clinicStopCodeName: 'Endoscopy',
        clinicFriendlyName: 'Endoscopy clinic',
        timezone: 'America/Los_Angeles',
      },
    };
    describe('TravelClaimSuccessAlert', () => {
      it('renders the travel pay message', () => {
        const { getByTestId } = render(
          <CheckInProvider store={mockData}>
            <TravelClaimSuccessAlert />
          </CheckInProvider>,
        );
        expect(getByTestId('travel-pay-message')).to.exist;
        expect(getByTestId('travel-pay--claim--submitted')).to.contain.text(
          `August 19, 2021, 6:56 a.m.`,
        );
      });
    });
  });
});
