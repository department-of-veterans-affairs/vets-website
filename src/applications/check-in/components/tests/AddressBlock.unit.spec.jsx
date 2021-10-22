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
      zip: '000001234',
    };
    const oneLineAddress = {
      street1: 'line 1',
      street2: '',
      city: 'city',
      state: 'state',
      zip: '00000',
    };
    const addressMissingStreet = {
      street1: '',
      street2: 'line 2',
      street3: 'line 3',
      city: 'city',
      state: 'state',
      zip: '00000',
    };
    const addressMissingCity = {
      street1: 'Line1',
      street2: 'line 2',
      street3: 'line 3',
      city: '',
      state: 'state',
      zip: '00000',
    };
    const addressMissingState = {
      street1: 'Line1',
      street2: 'line 2',
      street3: 'line 3',
      city: 'city',
      state: '',
      zip: '00000',
    };
    const addressMissingZip = {
      street1: 'Line1',
      street2: 'line 2',
      street3: 'line 3',
      city: 'city',
      state: 'state',
    };
    it('Renders with all address lines', () => {
      const component = render(<AddressBlock address={fullAddress} />);

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
    it('Renders with only address line 1', () => {
      const component = render(<AddressBlock address={oneLineAddress} />);
      expect(component.getByTestId('address-line-street1')).to.exist;
      expect(component.getByTestId('address-line-street1')).to.have.text(
        'line 1',
      );
      expect(component.queryByTestId('address-line-street2')).to.not.exist;
      expect(component.queryByTestId('address-line-street3')).to.not.exist;
      expect(component.getByTestId('address-city-state-and-zip')).to.exist;
      expect(component.getByTestId('address-city-state-and-zip')).to.have.text(
        'city, state 00000',
      );
    });
    it('Returns "Not Available" if missing street1', () => {
      const component = render(<AddressBlock address={addressMissingStreet} />);
      expect(component.getByText('Not Available')).to.exist;
    });
    it('Returns "Not Available" if missing city', () => {
      const component = render(<AddressBlock address={addressMissingCity} />);
      expect(component.getByText('Not Available')).to.exist;
    });
    it('Returns "Not Available" if missing state', () => {
      const component = render(<AddressBlock address={addressMissingState} />);
      expect(component.getByText('Not Available')).to.exist;
    });
    it('Returns "Not Available" if missing zip', () => {
      const component = render(<AddressBlock address={addressMissingZip} />);
      expect(component.getByText('Not Available')).to.exist;
    });
  });
});
