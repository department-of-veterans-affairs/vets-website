import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import TravelPayOMB from '../TravelPayOMB';

describe('check-in', () => {
  describe('TravelPayOMB', () => {
    it('renders the OMB information correctly', () => {
      const { getByTestId } = render(<TravelPayOMB />);

      // Verify the `va-omb-info` element exists with the correct data-testid
      const ombInfo = getByTestId('travel-pay-omb');
      expect(ombInfo).to.exist;

      // Verify the `exp-date` prop
      expect(ombInfo.getAttribute('exp-date')).to.equal('11/30/2027');

      // Verify the `omb-number` prop
      expect(ombInfo.getAttribute('omb-number')).to.equal('2900-0798');

      // Verify the `res-burden` prop
      expect(ombInfo.getAttribute('res-burden')).to.equal('10');

      // Verify text content within the component
      // Verify the Burder Statement Act section
      const burderStatement = getByTestId('travel-pay-omb-burdern-statement');
      expect(burderStatement).to.exist;
      // Verify the statement includes the OMB information
      expect(burderStatement.textContent).to.include('2900-0798');
      expect(burderStatement.textContent).to.include('11/30/2027');
      expect(burderStatement.textContent).to.include('10 minutes');

      // Verify the Privacy Act section
      const privayActInfo = getByTestId('travel-pay-omb-privacy-act-info');
      expect(privayActInfo).to.exist;
    });
  });
});
