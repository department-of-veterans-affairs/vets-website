import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { NewAddressSection } from '../../containers/NewAddressSection';

const mockReducer = (state = {}) => state;
const getStore = () => {
  const initialState = {
    vapService: {
      hasUnsavedEdits: false,
      initialFormFields: {},
      modal: null,
      modalData: null,
      formFields: {},
      transactions: [],
      fieldTransactionMap: {},
      transactionsAwaitingUpdate: [],
      metadata: {
        mostRecentErroredTransactionId: '',
      },
      addressValidation: {
        addressValidationType: '',
        suggestedAddresses: [],
        confirmedSuggestions: [],
        addressFromUser: {
          addressLine1: '',
          addressLine2: '',
          addressLine3: '',
          city: '',
          stateCode: '',
          zipCode: '',
          countryCodeIso3: '',
        },
        addressValidationError: false,
        validationKey: null,
        selectedAddress: {},
        selectedAddressId: null,
      },
      copyAddressModal: null,
    },
  };

  return createStore(mockReducer, initialState, applyMiddleware(thunk));
};

describe('<NewAddressSection>', () => {
  it('should show intro text', () => {
    const { container, getByText, getByRole } = render(
      <Provider store={getStore()}>
        <MemoryRouter>
          <NewAddressSection success />
        </MemoryRouter>
      </Provider>,
    );
    const link = getByRole('link', {
      name: /learn about changing your address in your VA\.gov profile/i,
    });
    expect(
      getByText(
        /This mailing address will be listed on your benefit letters and documentation. You can edit this address./,
      ).exist,
    );
    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(
      getByText(
        /Changing your address here will also update it in your VA.gov profile. We use this address for several VA benefits and services./,
      ).exist,
    );
    expect(link).to.exist;
  });
});
