import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import AddressBlock from '../AddressBlock';

describe('check-in', () => {
  describe('AddressBlock', () => {
    const fullAddress = {
      street1: 'line 1',
      street2: 'line 2',
      street3: 'line 3',
      city: 'city',
      state: 'state',
      zip: '00000',
    };
    const oneLineAddress = {
      street1: 'line 1',
      street2: '',
      city: 'city',
      state: 'state',
      zip: '00000',
    };
    it('Renders with all address lines', () => {
      const component = render(<AddressBlock address={fullAddress} />);

      expect(component.getByTestId('address-line-1')).to.exist;
      expect(component.getByTestId('address-line-1')).to.have.text('line 1');
      expect(component.getByTestId('address-line-2')).to.exist;
      expect(component.getByTestId('address-line-2')).to.have.text(', line 2');
      expect(component.getByTestId('address-line-3')).to.exist;
      expect(component.getByTestId('address-line-3')).to.have.text(', line 3');
      expect(component.getByTestId('address-city-state-and-zip')).to.exist;
      expect(component.getByTestId('address-city-state-and-zip')).to.have.text(
        'city, state 00000',
      );
    });
    it('Renders with only address line 1', () => {
      const component = render(<AddressBlock address={oneLineAddress} />);
      expect(component.getByTestId('address-line-1')).to.exist;
      expect(component.getByTestId('address-line-1')).to.have.text('line 1');
      expect(component.queryByTestId('address-line-2')).to.not.exist;
      expect(component.queryByTestId('address-line-3')).to.not.exist;
      expect(component.getByTestId('address-city-state-and-zip')).to.exist;
      expect(component.getByTestId('address-city-state-and-zip')).to.have.text(
        'city, state 00000',
      );
    });
  });
});
