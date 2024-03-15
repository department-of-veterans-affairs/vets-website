import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import TravelMileage from '.';

describe('travel-review', () => {
  describe('Review page', () => {
    const singleStore = {
      facilitiesToFile: [
        {
          stationNo: '555',
          startTime: '',
          facility: 'test facility',
          appointmentCount: 1,
        },
      ],
    };
    const multiStore = {
      facilitiesToFile: [
        {
          stationNo: '555',
          startTime: '',
          facility: 'test facility',
          appointmentCount: 1,
        },
        {
          stationNo: '556',
          startTime: '',
          facility: 'another test facility',
          appointmentCount: 3,
        },
      ],
    };
    it('renders page details', () => {
      const component = render(
        <CheckInProvider store={singleStore}>
          <TravelMileage />
        </CheckInProvider>,
      );
      expect(component.getByTestId('review-body')).to.exist;
    });
    it('displays single claimList', () => {
      const component = render(
        <CheckInProvider store={singleStore}>
          <TravelMileage />
        </CheckInProvider>,
      );
      expect(component.getByTestId('claiming-1-facilities')).to.exist;
      expect(component.getByTestId('claim-list')).to.contain.text(
        'Mileage-only reimbursement for 1 appointment at test facility',
      );
    });
    it('displays multi claimList', () => {
      const component = render(
        <CheckInProvider store={multiStore}>
          <TravelMileage />
        </CheckInProvider>,
      );
      expect(component.getByTestId('claiming-2-facilities')).to.exist;
      expect(component.getByTestId('claim-list')).to.contain.text(
        'Mileage-only reimbursement for 1 appointment at test facility, and 3 appointments at another test facility',
      );
    });
  });
});
