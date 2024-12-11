import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import TravelPayOMB from '../TravelPayOMB';

describe('check-in', () => {
  describe('TravelPayOMB', () => {
    it('renders the OMB information correctly', () => {
      const { getByTestId, getByText } = render(<TravelPayOMB />);

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
      expect(getByText(/VA Burden Statement:/)).to.exist;
      expect(
        getByText(
          /An agency may not conduct or sponsor, and a person is not required to respond to, a collection of information unless it displays a currently valid OMB control number./,
        ),
      ).to.exist;
      expect(
        getByText(
          /The OMB control number for this project is 2900-0798, and it expires 11\/30\/2027./,
        ),
      ).to.exist;

      // Verify the Privacy Act section
      expect(getByText(/Privacy Act information:/)).to.exist;
      expect(
        getByText(
          /VA is asking you to provide the information on this form under 38 U.S.C. Sections 111 to determine your eligibility for Beneficiary Travel benefits and will be used for that purpose./,
        ),
      ).to.exist;
    });
  });
});
