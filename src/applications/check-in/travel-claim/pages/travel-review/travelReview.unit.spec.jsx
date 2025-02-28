import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import TravelMileage from '.';
import { setupI18n, teardownI18n } from '../../../utils/i18n/i18n';

describe('travel-review', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('Review page', () => {
    const mockData = {
      appointmentToFile: {
        stationNo: '555',
        startTime: '2021-08-19T13:56:31Z',
        clinicStopCodeName: 'Endoscopy',
        timezone: 'America/Los_Angeles',
        facility: 'Test Facility',
      },
    };
    it('renders page details', () => {
      const component = render(
        <CheckInProvider store={mockData}>
          <TravelMileage />
        </CheckInProvider>,
      );
      expect(component.getByTestId('review-body')).to.exist;
      expect(component.getByTestId('claim-info')).to.contain.text(
        'Mileage-only reimbursement for your appointment at Test Facility on August 19, 2021, 6:56 a.m.',
      );
    });
  });
});
