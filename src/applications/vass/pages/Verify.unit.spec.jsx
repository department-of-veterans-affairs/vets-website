import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { Routes, Route, useLocation } from 'react-router-dom-v5-compat';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { commonReducer } from 'platform/startup/store';
import { renderWithStoreAndRouterV6 } from '~/platform/testing/unit/react-testing-library-helpers';
import {
  mockFetch,
  resetFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
  inputVaTextInput,
} from '@department-of-veterans-affairs/platform-testing/helpers';

import Verify from './Verify';
import {
  getDefaultRenderOptions,
  reducers,
  vassApi,
} from '../utils/test-utils';
import { FLOW_TYPES, URLS } from '../utils/constants';

// Helper component to display current location for testing navigation
const LocationDisplay = () => {
  const location = useLocation();
  return (
    <div data-testid="location-display">
      {location.pathname}
      {location.search}
    </div>
  );
};

const defaultRenderOptions = getDefaultRenderOptions();

describe('VASS Component: Verify', () => {
  beforeEach(() => {
    mockFetch();
  });

  afterEach(() => {
    resetFetch();
  });

  it('should render all content', () => {
    const { getByTestId, queryByTestId } = renderWithStoreAndRouterV6(
      <Verify />,
      defaultRenderOptions,
    );

    expect(getByTestId('header')).to.exist;
    expect(getByTestId('verify-intro-text')).to.exist;
    expect(getByTestId('last-name-input')).to.exist;
    expect(getByTestId('dob-input')).to.exist;
    expect(getByTestId('submit-button')).to.exist;
    expect(queryByTestId('verify-error-alert')).to.not.exist;
  });

  describe('when cancellation url parameter is true', () => {
    it('should set the flow type to cancel', async () => {
      const store = createStore(
        combineReducers({ ...commonReducer, ...reducers }),
        defaultRenderOptions.initialState,
        applyMiddleware(thunk, vassApi.middleware),
      );

      renderWithStoreAndRouterV6(<Verify />, {
        ...defaultRenderOptions,
        store,
        initialEntries: [`${URLS.VERIFY}?cancel=true&uuid=test-uuid`],
      });

      await waitFor(() => {
        expect(store.getState().vassForm.flowType).to.equal(FLOW_TYPES.CANCEL);
      });
    });
    it('should display the correct page title', () => {
      const { getByTestId } = renderWithStoreAndRouterV6(<Verify />, {
        ...defaultRenderOptions,
        initialEntries: [`${URLS.VERIFY}?cancel=true`],
      });

      expect(getByTestId('header').textContent).to.contain(
        'Cancel VA Solid Start appointment',
      );
    });

    it('should navigate to enter otc page', async () => {
      setFetchJSONResponse(global.fetch.onCall(0), {
        data: {
          message: 'OTC sent to registered email address',
          expiresIn: 600,
          email: 's****@email.com',
        },
      });

      const { container, getByTestId } = renderWithStoreAndRouterV6(
        <>
          <Routes>
            <Route path={URLS.VERIFY} element={<Verify />} />
            <Route path={URLS.ENTER_OTC} element={<div>Enter OTC Page</div>} />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...defaultRenderOptions,
          initialEntries: [URLS.VERIFY],
        },
      );

      // Fill in valid credentials
      inputVaTextInput(
        container,
        'Smith',
        'va-text-input[data-testid="last-name-input"]',
      );
      const dobInput = container.querySelector(
        'va-memorable-date[data-testid="dob-input"]',
      );
      dobInput.__events.dateChange({ target: { value: '1935-04-07' } });

      const submitButton = getByTestId('submit-button');
      submitButton.click();

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          URLS.ENTER_OTC,
        );
      });
    });
  });

  describe('successful verification', () => {
    it('should navigate to enter-otc page with valid credentials', async () => {
      setFetchJSONResponse(global.fetch.onCall(0), {
        data: {
          message: 'OTC sent to registered email address',
          expiresIn: 600,
          email: 's****@email.com',
        },
      });

      const { container, getByTestId } = renderWithStoreAndRouterV6(
        <>
          <Routes>
            <Route path={URLS.VERIFY} element={<Verify />} />
            <Route path={URLS.ENTER_OTC} element={<div>Enter OTC Page</div>} />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...defaultRenderOptions,
          initialEntries: ['/?uuid=c0ffee-1234-beef-5678'],
        },
      );

      // Fill in valid credentials
      inputVaTextInput(
        container,
        'Smith',
        'va-text-input[data-testid="last-name-input"]',
      );
      const dobInput = container.querySelector(
        'va-memorable-date[data-testid="dob-input"]',
      );
      dobInput.__events.dateChange({ target: { value: '1935-04-07' } });

      const submitButton = getByTestId('submit-button');
      submitButton.click();

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          URLS.ENTER_OTC,
        );
      });
    });

    it('should set low auth form data when verification is successful', async () => {
      setFetchJSONResponse(global.fetch.onCall(0), {
        data: {
          message: 'OTC sent to registered email address',
          expiresIn: 600,
          email: 's****@email.com',
        },
      });

      const store = createStore(
        combineReducers({ ...commonReducer, ...reducers }),
        defaultRenderOptions.initialState,
        applyMiddleware(thunk, vassApi.middleware),
      );

      const { container, getByTestId } = renderWithStoreAndRouterV6(
        <>
          <Routes>
            <Route path="/" element={<Verify />} />
            <Route path="/enter-otc" element={<div>Enter OTC Page</div>} />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...defaultRenderOptions,
          store,
          initialEntries: ['/?uuid=c0ffee-1234-beef-5678'],
        },
      );

      // Fill in valid credentials
      inputVaTextInput(
        container,
        'Smith',
        'va-text-input[data-testid="last-name-input"]',
      );
      const dobInput = container.querySelector(
        'va-memorable-date[data-testid="dob-input"]',
      );
      dobInput.__events.dateChange({ target: { value: '1935-04-07' } });

      const submitButton = getByTestId('submit-button');
      submitButton.click();

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          '/enter-otc',
        );
      });
      // check for redux state
      const state = store.getState();
      expect(state.vassForm.uuid).to.equal('c0ffee-1234-beef-5678');
      expect(state.vassForm.lastname).to.equal('Smith');
      expect(state.vassForm.dob).to.equal('1935-04-07');
      expect(state.vassForm.obfuscatedEmail).to.equal('s****@email.com');
    });
  });

  describe('API error handling', () => {
    it('should display error alert when credentials are invalid', async () => {
      setFetchJSONFailure(global.fetch.onCall(0), {
        errors: [
          {
            code: 'invalid_credentials',
            detail: 'Unable to verify identity. Please check your information.',
          },
        ],
      });

      const {
        getByTestId,
        queryByTestId,
        container,
      } = renderWithStoreAndRouterV6(<Verify />, defaultRenderOptions);

      const submitButton = getByTestId('submit-button');

      const dobInput = container.querySelector(
        'va-memorable-date[data-testid="dob-input"]',
      );
      dobInput.__events.dateChange({ target: { value: '1990-01-01' } });

      inputVaTextInput(
        container,
        'WrongName',
        'va-text-input[data-testid="last-name-input"]',
      );

      submitButton.click();

      await waitFor(() => {
        expect(queryByTestId('verify-error-alert')).to.exist;
      });
    });

    it('should display verification error message when rate limit is exceeded', async () => {
      setFetchJSONFailure(global.fetch.onCall(0), {
        errors: [
          {
            code: 'rate_limit_exceeded',
            detail: 'Too many OTC requests.  Please try again later.',
            retryAfter: 900,
          },
        ],
      });

      const {
        getByTestId,
        queryByTestId,
        container,
      } = renderWithStoreAndRouterV6(<Verify />, defaultRenderOptions);

      const submitButton = getByTestId('submit-button');

      const dobInput = container.querySelector(
        'va-memorable-date[data-testid="dob-input"]',
      );
      dobInput.__events.dateChange({ target: { value: '1990-01-01' } });

      inputVaTextInput(
        container,
        'WrongName',
        'va-text-input[data-testid="last-name-input"]',
      );

      submitButton.click();

      await waitFor(() => {
        expect(queryByTestId('verification-error-alert')).to.exist;
      });
    });
  });
});
