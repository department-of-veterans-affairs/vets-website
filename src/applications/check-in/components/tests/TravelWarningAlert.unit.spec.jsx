import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';
import TravelWarningAlert from '../TravelWarningAlert';

describe('check-in', () => {
  describe('TravelWarningAlert', () => {
    it('renders the travel warning alert if travel reimbursement is disabled', () => {
      const { getByTestId } = render(
        <CheckInProvider>
          <TravelWarningAlert />
        </CheckInProvider>,
      );
      expect(getByTestId('travel-btsss-message')).to.exist;
    });
  });
});
