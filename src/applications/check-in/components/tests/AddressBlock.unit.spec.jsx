import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { setupI18n, teardownI18n } from '../../utils/i18n/i18n';

import AddressBlock from '../AddressBlock';

describe('check-in', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
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
    it('Returns "Not available" if missing street1', () => {
      const component = render(<AddressBlock address={addressMissingStreet} />);
      expect(component.getByText('Not available')).to.exist;
    });
    it('Returns "Not available" if missing city', () => {
      const component = render(<AddressBlock address={addressMissingCity} />);
      expect(component.getByText('Not available')).to.exist;
    });
    it('Returns "Not available" if missing state', () => {
      const component = render(<AddressBlock address={addressMissingState} />);
      expect(component.getByText('Not available')).to.exist;
    });
    it('Returns "Not available" if missing zip', () => {
      const component = render(<AddressBlock address={addressMissingZip} />);
      expect(component.getByText('Not available')).to.exist;
    });
    it('Does not display directions link when false', () => {
      const component = render(
        <AddressBlock
          address={oneLineAddress}
          showDirections={false}
          placeName="test place"
        />,
      );
      expect(component.queryByTestId('directions-link')).to.not.exist;
    });
    it('Displays directions link when true', () => {
      const component = render(
        <AddressBlock
          address={oneLineAddress}
          showDirections
          placeName="test place"
        />,
      );
      expect(component.getByTestId('directions-link')).to.exist;
    });
    it('Builds the link with all address parts', () => {
      const component = render(
        <AddressBlock
          address={fullAddress}
          showDirections
          placeName="test place"
        />,
      );
      expect(component.getByTestId('directions-link')).to.have.attribute(
        'href',
        'https://maps.google.com?addr=Current+Location&daddr=line 1, line 2, line 3, city, state, 000001234',
      );
    });
    it('Builds the link with some missing address parts', () => {
      const component = render(
        <AddressBlock
          address={oneLineAddress}
          showDirections
          placeName="test place"
        />,
      );
      expect(component.getByTestId('directions-link')).to.have.attribute(
        'href',
        'https://maps.google.com?addr=Current+Location&daddr=line 1, city, state, 00000',
      );
    });
  });
});
