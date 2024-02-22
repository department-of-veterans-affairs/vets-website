import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';
import TravelEligibilityAddtionalInfo from '../TravelEligibilityAdditionalInfo';

describe('Check-in shared components', () => {
  describe('TravelEligibilityAddtionalInfo', () => {
    it('Renders', () => {
      const screen = render(
        <CheckInProvider>
          <TravelEligibilityAddtionalInfo />
        </CheckInProvider>,
      );

      expect(screen.queryByTestId('travel-reimbursement-content')).to.exist;
    });
  });
});
