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
const getStoreWithValidationView = (lettersPageNewDesign = true) => {
  const initialState = {
    featureToggles: {
      // eslint-disable-next-line camelcase
      letters_page_new_design: lettersPageNewDesign,
    },
    vapService: {
      hasUnsavedEdits: false,
      initialFormFields: {},
      modal: 'addressValidation',
      modalData: null,
      formFields: {},
      transactions: [],
      fieldTransactionMap: {},
      transactionsAwaitingUpdate: [],
      metadata: {
        mostRecentErroredTransactionId: '',
      },
      addressValidation: {
        addressValidationType: 'mailingAddress',
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
  it('should render the title correctly', () => {
    const { getByRole } = render(
      <Provider store={getStore()}>
        <MemoryRouter initialEntries={['/edit-address']}>
          <Routes>
            <Route path="/edit-address" element={<EditAddress />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    const heading = getByRole('heading', { level: 2 });
    expect(heading).to.exist;
    expect(heading.textContent).to.equal('Edit mailing address');
    expect(document.activeElement).to.equal(heading);
  });
  it('should show info alert when validation view is not active', () => {
    const { container } = render(
      <Provider store={getStore()}>
        <MemoryRouter initialEntries={['/edit-address']}>
          <Routes>
            <Route path="/edit-address" element={<EditAddress />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
  });
  it('should not show alert when validation view is active', () => {
    const { queryByText } = render(
      <Provider store={getStoreWithValidationView()}>
        <MemoryRouter initialEntries={['/edit-address']}>
          <Routes>
            <Route path="/edit-address" element={<EditAddress />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    const alertInfo = queryByText(
      'Changing your address here will also update it in your VA.gov profile and across several VA benefits and services.',
    );
    expect(alertInfo).to.be.null;
  });
});
