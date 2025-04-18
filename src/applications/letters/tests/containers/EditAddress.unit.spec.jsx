import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { MemoryRouter, Route, Routes } from 'react-router-dom-v5-compat';
import { render } from '@testing-library/react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import thunk from 'redux-thunk';

import EditAddress from '../../containers/EditAddress';

const mockReducer = (state = {}) => state;

const getStore = (lettersPageNewDesign = true) => {
  const initialState = {
    featureToggles: {
      // eslint-disable-next-line camelcase
      letters_page_new_design: lettersPageNewDesign,
    },
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
describe('<EditAddress>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <MemoryRouter>
        <EditAddress />
      </MemoryRouter>,
    );
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });
  it('should have need help section', () => {
    const { container } = render(
      <Provider store={getStore()}>
        <MemoryRouter initialEntries={[`/edit-address`]}>
          <Routes>
            <Route path="/edit-address" element={<EditAddress />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    const needHelpEl = container.querySelector('va-need-help');
    expect(needHelpEl).to.exist;
  });
});
