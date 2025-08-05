import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { render, cleanup } from '@testing-library/react';
import IntroductionPage from '../../containers/IntroductionPage';

const makeUserReducer = loaCurrent => () => ({
  profile: {
    loa: { current: loaCurrent },
    loading: false,
    prefillsAvailable: [],
    savedForms: [],
  },
  login: {
    currentlyLoggedIn: true,
  },
});

const formsReducer = () => ({
  formId: 'test-form-id',
  migrations: [],
  prefillTransformer: () => ({}),
  loadedData: { metadata: { returnUrl: '/' } },
  lastSavedDate: null,
  saveInProgress: {},
});

const rootReducer = userReducer =>
  combineReducers({
    user: userReducer,
    form: formsReducer,
  });

const mockRoute = {
  formConfig: {
    prefillEnabled: false,
    savedFormMessages: {},
    title: 'Test Title',
    subTitle: 'Test Subtitle',
  },
  pageList: [],
};

describe('IntroductionPage LOA logic', () => {
  afterEach(cleanup);

  it('renders VerifyAlert for LOA1', () => {
    const store = createStore(rootReducer(makeUserReducer(1)));
    const { getByTestId, queryByText } = render(
      <Provider store={store}>
        <IntroductionPage route={mockRoute} />
      </Provider>,
    );
    expect(getByTestId('ezr-identity-alert')).to.exist;
    expect(queryByText('Start your Application')).to.not.exist;
  });

  it('renders SaveInProgressIntro for LOA3', () => {
    const store = createStore(rootReducer(makeUserReducer(3)));
    const { getByText, queryByTestId } = render(
      <Provider store={store}>
        <IntroductionPage route={mockRoute} />
      </Provider>,
    );
    expect(getByText('Start your Application')).to.exist;
    expect(queryByTestId('ezr-identity-alert')).to.not.exist;
  });
});
