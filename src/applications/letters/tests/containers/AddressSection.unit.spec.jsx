import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import { ADDRESS_TYPES_ALTERNATE } from '@@vap-svc/constants';
import { AddressSection } from '../../containers/AddressSection';

const mailingAddress = {
  type: ADDRESS_TYPES_ALTERNATE.domestic,
  addressOne: '2476 Main Street',
  addressTwo: '',
  addressThree: '',
  city: 'Reston',
  countryName: 'USA',
  stateCode: 'VA',
  zipCode: '12345',
};

const store = createStore(
  () => ({
    user: {
      profile: {
        vapContactInfo: {
          mailingAddress,
        },
      },
    },
    vapService: {
      addressValidation: {
        addressValidationType: '',
      },
      fieldTransactionMap: {},
      formFields: {
        mailingAddress: {},
      },
      hasUnsavedEdits: false,
      transactions: [],
    },
  }),
  {},
  applyMiddleware(thunk),
);

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
  it('should enable the View Letters button with default props', () => {
    const screen = render(
      <MemoryRouter initialEntries={[`/confirm-address`]}>
        <Provider store={store}>
          <AddressSection address={mailingAddress} />
        </Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText('View Letters')).to.not.have.attr('disabled');
  });

  it('should render an empty address warning on the view screen and disable the View Letters button', () => {
    const screen = render(
      <MemoryRouter initialEntries={[`/confirm-address`]}>
        <Provider store={store}>
          <AddressSection address={emptyAddress} />
        </Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText('We don’t have a valid address on file for you')).to
      .exist;
    expect(screen.getByText('View Letters')).to.have.attr('disabled');
  });
});
