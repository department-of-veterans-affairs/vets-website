import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import sinon from 'sinon';

import { ADDRESS_TYPES_ALTERNATE } from '@@vap-svc/constants';

import { AddressSection } from '../../containers/AddressSection';
import * as VAProfileWrapper from '../../containers/VAProfileWrapper';

const address = {
  addressOne: '2476 Main Street',
  addressTwo: '',
  addressThree: '',
  city: 'Reston',
  countryName: 'USA',
  stateCode: 'VA',
  type: ADDRESS_TYPES_ALTERNATE.domestic,
  zipCode: '12345',
};

const emptyAddress = {
  addressOne: '',
  addressTwo: '',
  addressThree: '',
  city: '',
  countryName: '',
  stateCode: '',
  type: ADDRESS_TYPES_ALTERNATE.domestic,
};

describe('<AddressSection>', () => {
  let stub;

  before(() => {
    // Stubbing out VAProfileWrapper because we're not interested
    // in setting up all of the redux state needed to test it
    stub = sinon.stub(VAProfileWrapper, 'default');
    stub.returns(<div />);
  });

  after(() => {
    stub.restore();
  });

  it('should enable the View Letters button with default props', () => {
    const screen = render(
      <MemoryRouter initialEntries={[`/confirm-address`]}>
        <AddressSection address={address} />
      </MemoryRouter>,
    );

    expect(screen.getByText('View Letters')).to.not.have.attr('disabled');
  });

  it('should render an empty address warning on the view screen and disable the View Letters button', () => {
    const screen = render(
      <MemoryRouter initialEntries={[`/confirm-address`]}>
        <AddressSection address={emptyAddress} />
      </MemoryRouter>,
    );

    expect(screen.getByText('We don’t have a valid address on file for you')).to
      .exist;
    expect(screen.getByText('View Letters')).to.have.attr('disabled');
  });
});
