import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import DemographicItem from '../DemographicItem';

describe('check-in', () => {
  describe('DemographicItem', () => {
    const address = {
      street1: 'line 1',
      street2: 'line 2',
      street3: 'line 3',
      city: 'city',
      state: 'state',
      zip: '00000',
    };
    const phone = '5552223333';
    const email = 'email@email.com';

    it('Renders an address', () => {
      const component = render(<DemographicItem demographic={address} />);

      expect(component.getByTestId('address-line-street1')).to.exist;
      expect(component.getByTestId('address-line-street1')).to.have.text(
        'line 1',
      );
      expect(component.getByTestId('address-line-street2')).to.exist;
      expect(component.getByTestId('address-line-street2')).to.have.text(
        ', line 2',
      );
      expect(component.getByTestId('address-line-street3')).to.exist;
      expect(component.getByTestId('address-line-street3')).to.have.text(
        ', line 3',
      );
      expect(component.getByTestId('address-city-state-and-zip')).to.exist;
      expect(component.getByTestId('address-city-state-and-zip')).to.have.text(
        'city, state 00000',
      );
    });
    it('Renders a phone number', () => {
      const component = render(<DemographicItem demographic={phone} />);
      expect(component.getByText('555-222-3333')).to.exist;
    });
    it('Renders an email address', () => {
      const component = render(<DemographicItem demographic={email} />);
      expect(component.getByText('email@email.com')).to.exist;
    });
  });
});
