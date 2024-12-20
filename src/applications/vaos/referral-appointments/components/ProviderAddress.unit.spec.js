import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ProviderAddress from './ProviderAddress';

describe('VAOS Component: ProviderAddress', () => {
  const address = {
    street1: 'test street',
    street2: '',
    street3: '',
    state: 'testylvania',
    city: 'testland',
    zip: '88888',
  };
  it('render the address and phone with no street 1 or 2', () => {
    const screen = render(
      <ProviderAddress address={address} phone="555-555-5555" />,
    );
    expect(screen.getByTestId('address-block')).to.exist;
    expect(screen.getByTestId('phone')).to.exist;
    expect(screen.queryByTestId('street2')).to.not.exist;
    expect(screen.queryByTestId('street3')).to.not.exist;
  });
  it('render the address with street 1 and 2', () => {
    const addressWithStreets = {
      ...address,
      ...{ street2: 'test two', street3: 'test three' },
    };
    const screen = render(
      <ProviderAddress address={addressWithStreets} phone="555-555-5555" />,
    );
    expect(screen.getByTestId('address-block')).to.exist;
    expect(screen.queryByTestId('street2')).to.exist;
    expect(screen.queryByTestId('street3')).to.exist;
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
