import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import AddressBlock from '../AddressBlock';

describe('check-in', () => {
  describe('AddressBlock', () => {
    const address = {
      address1: 'line 1',
      address2: 'line 2',
      address3: 'line 3',
      city: 'city',
      state: 'state',
      zip: '00000',
    };
    it('Renders', () => {
      const component = render(<AddressBlock address={address} />);

      expect(component.getByTestId('address line 1')).to.exist;
      expect(component.getByTestId('address line 1')).to.have.text('line 1');
      expect(component.getByTestId('address line 2')).to.exist;
      expect(component.getByTestId('address line 2')).to.have.text(', line 2');
      expect(component.getByTestId('address line 3')).to.exist;
      expect(component.getByTestId('address line 3')).to.have.text(', line 3');
      expect(component.getByTestId('address city state and zip')).to.exist;
      expect(component.getByTestId('address city state and zip')).to.have.text(
        'city, state 00000',
      );
    });
  });
});
