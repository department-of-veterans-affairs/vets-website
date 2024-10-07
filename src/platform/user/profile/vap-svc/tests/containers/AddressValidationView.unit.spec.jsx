import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { expect } from 'chai';
import AddressValidationView from '../../containers/AddressValidationView';

const mockStore = configureMockStore([]);

describe('<AddressValidationView/>', () => {
  const store = mockStore({
    vapService: {
      fieldTransactionMap: {
        mailingAddress: {
          isPending: false,
        },
      },
      modal: 'addressValidation',
      addressValidation: {
        addressFromUser: {
          addressLine1: '12345 1st Ave',
          addressLine2: 'bldg 2',
          addressLine3: 'apt 23',
          city: 'Tampa',
          stateCode: 'FL',
          zipCode: '12346',
        },
        isAddressValidationModalVisible: true,
        addressValidationError: '',
        addressValidationType: 'mailingAddress',
        userEnteredAddress: {},
        validationKey: 1234,
        confirmedSuggestions: [],
        suggestedAddresses: [
          {
            addressLine1: '12345 1st Ave',
            addressLine2: 'bldg 2',
            addressLine3: 'apt 23',
            city: 'Tampa',
            stateCode: 'FL',
            zipCode: '12346',
            addressMetaData: {
              confidenceScore: 100.0,
              addressType: 'Domestic',
              deliveryPointValidation: 'CONFIRMED',
              residentialDeliveryIndicator: 'MIXED',
            },
          },
          {
            addressLine1: '22222 1st Ave',
            addressLine2: 'bldg 2',
            addressLine3: 'apt 23',
            city: 'Saint Petersburg',
            stateCode: 'FL',
            zipCode: '55555',
            addressMetaData: {
              confidenceScore: 100.0,
              addressType: 'Domestic',
              deliveryPointValidation: 'CONFIRMED',
              residentialDeliveryIndicator: 'MIXED',
            },
          },
        ],
      },
    },
  });

  it('renders AddressValidationView component', () => {
    const view = render(
      <Provider store={store}>
        <AddressValidationView />
      </Provider>,
    );
    expect(view).to.not.be.null;
  });

  it('renders VaAlert component', () => {
    const { getByRole } = render(
      <Provider store={store}>
        <AddressValidationView />
      </Provider>,
    );

    expect(getByRole('alert')).to.exist;
  });

  it('renders only the "Go back to edit" button with primary attribute', () => {
    const { container } = render(
      <Provider store={store}>
        <AddressValidationView />
      </Provider>,
    );

    const vaButtons = container.querySelectorAll('va-button[primary="true"]');
    expect(vaButtons.length).to.equal(1);
    expect(vaButtons[0]).to.have.attribute('text', 'Go back to edit');
  });
});
