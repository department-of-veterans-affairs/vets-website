import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { MemoryRouter, Routes, Route } from 'react-router-dom-v5-compat';
import { render } from '@testing-library/react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import LetterPage from '../../containers/LetterPage';

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
    letters: [
      {
        name: 'Commissary Letter',
        letterType: 'commissary',
      },
      {
        name: 'Benefit Summary and Service Verification Letter',
        letterType: 'benefit_summary',
      },
      {
        name: 'Benefit Verification Letter',
        letterType: 'benefit_verification',
      },
    ],
    featureToggles: {
      [FEATURE_FLAG_NAMES.tsaSafeTravelLetter]: true,
    },
  };
  return createStore(mockReducer, initialState, applyMiddleware(thunk));
};

describe('<LetterPage>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <MemoryRouter>
        <LetterPage />
      </MemoryRouter>,
    );
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });
  it('displays success alert when user successfully edit address', () => {
    const { container } = render(
      <Provider store={getStore()}>
        <MemoryRouter
          initialEntries={[{ pathname: '/', state: { success: true } }]}
        >
          <Routes>
            <Route path="/" element={<LetterPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    const successAlert = container.querySelector('va-alert');
    expect(successAlert).to.exist;
  });
});
