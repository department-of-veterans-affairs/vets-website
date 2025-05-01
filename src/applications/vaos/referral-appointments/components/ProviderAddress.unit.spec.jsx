import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ProviderAddress from './ProviderAddress';

describe('VAOS Component: ProviderAddress', () => {
  const address = {
    address1: 'test Address',
    address2: '',
    address3: '',
    state: 'testylvania',
    city: 'testland',
    zip: '88888',
  };
  it('renders the address and phone with no Address 1 or 2', () => {
    const screen = render(
      <ProviderAddress address={address} phone="555-555-5555" />,
    );
    expect(screen.getByTestId('address-block')).to.exist;
    expect(screen.getByTestId('phone')).to.exist;
    expect(screen.queryByTestId('Address2')).to.not.exist;
    expect(screen.queryByTestId('Address3')).to.not.exist;
  });
  it('renders the address with Address 1 and 2', () => {
    const addressWithStreets = {
      ...address,
      ...{ address2: 'test two', address3: 'test three' },
    };
    const screen = render(
      <ProviderAddress address={addressWithStreets} phone="555-555-5555" />,
    );
    expect(screen.getByTestId('address-block')).to.exist;
    expect(screen.queryByTestId('Address2')).to.exist;
    expect(screen.queryByTestId('Address3')).to.exist;
  });
  it('show directions if showDirections is true and name is provider', () => {
    const screen = render(
      <ProviderAddress
        address={address}
        phone="555-555-5555"
        showDirections
        directionsName="test place"
      />,
    );
    expect(screen.getByTestId('directions-link-wrapper')).to.exist;
  });
  it('not show directions if showDirections is false', () => {
    const screen = render(
      <ProviderAddress
        address={address}
        phone="555-555-5555"
        showDirections={false}
      />,
    );
    expect(screen.queryByTestId('directions-link-wrapper')).to.not.exist;
  });
});
