import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
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

  it('should enable the View letters button with default props', () => {
    const { container } = render(
      <MemoryRouter initialEntries={[`/confirm-address`]}>
        <AddressSection address={address} />
      </MemoryRouter>,
    );

    expect($('va-button', container).getAttribute('text')).to.eq(
      'View letters',
    );
    expect($('va-button', container).getAttribute('disabled')).to.be.null;
  });

  it('should render an empty address warning on the view screen and disable the View letters button', () => {
    const { container, getByText } = render(
      <MemoryRouter initialEntries={[`/confirm-address`]}>
        <AddressSection address={emptyAddress} />
      </MemoryRouter>,
    );

    expect(getByText('We don’t have a valid address on file for you').exist);
    expect($('va-button', container).getAttribute('text')).to.eq(
      'View letters',
    );
    expect($('va-button', container).getAttribute('disabled')).to.eq('true');
  });
});
