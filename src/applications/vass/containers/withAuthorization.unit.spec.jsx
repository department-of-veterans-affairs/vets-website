import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import { Routes, Route, useLocation } from 'react-router-dom-v5-compat';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { commonReducer } from 'platform/startup/store';
import { renderWithStoreAndRouterV6 } from '~/platform/testing/unit/react-testing-library-helpers';

import withAuthorization from './withAuthorization';
import { AUTH_LEVELS, URLS } from '../utils/constants';
import * as formSlice from '../redux/slices/formSlice';
import {
  getDefaultRenderOptions,
  reducers,
  vassApi,
} from '../utils/test-utils';

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

// Simple test component to wrap
const TestComponent = () => (
  <div data-testid="test-component">Test Content</div>
);

describe('VASS Containers: withAuthorization', () => {
  let loadFormDataFromStorageStub;

  beforeEach(() => {
    loadFormDataFromStorageStub = sinon.stub(
      formSlice,
      'loadFormDataFromStorage',
    );
    loadFormDataFromStorageStub.returns(null);
  });

  afterEach(() => {
    loadFormDataFromStorageStub.restore();
  });

  describe('with AUTH_LEVELS.TOKEN', () => {
    describe('when user has a valid token', () => {
      it('should render the wrapped component', () => {
        const WrappedComponent = withAuthorization(
          TestComponent,
          AUTH_LEVELS.TOKEN,
        );

        const { getByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ token: 'valid-token', hydrated: true }),
        );

        expect(getByTestId('test-component')).to.exist;
      });
    });

    describe('when user has no token', () => {
      it('should not render the component', () => {
        const WrappedComponent = withAuthorization(
          TestComponent,
          AUTH_LEVELS.TOKEN,
        );

        const { queryByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ token: null, hydrated: true }),
        );

        expect(queryByTestId('test-component')).to.not.exist;
      });

      it('should not render the component after hydration completes', async () => {
        const WrappedComponent = withAuthorization(TestComponent);

        const { queryByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ token: null, hydrated: false }),
        );

        await waitFor(() => {
          expect(queryByTestId('test-component')).to.not.exist;
        });
      });

      it('should redirect to Verify page when no token but uuid exists', async () => {
        const WrappedComponent = withAuthorization(TestComponent);

        const { getByTestId, queryByTestId } = renderWithStoreAndRouterV6(
          <>
            <Routes>
              <Route path="/test" element={<WrappedComponent />} />
              <Route
                path="/"
                element={<div data-testid="verify-page">Verify</div>}
              />
            </Routes>
            <LocationDisplay />
          </>,
          {
            ...getDefaultRenderOptions({
              token: null,
              uuid: 'test-uuid-1234',
              hydrated: true,
            }),
            initialEntries: ['/test'],
          },
        );

        await waitFor(() => {
          expect(getByTestId('location-display').textContent).to.equal(
            `${URLS.VERIFY}?uuid=test-uuid-1234`,
          );
        });

        expect(queryByTestId('test-component')).to.not.exist;
      });
    });
  });

  describe('with AUTH_LEVELS.LOW_AUTH_ONLY', () => {
    describe('when user has no token', () => {
      it('should render the wrapped component', () => {
        const WrappedComponent = withAuthorization(
          TestComponent,
          AUTH_LEVELS.LOW_AUTH_ONLY,
        );

        const { getByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ token: null, hydrated: true }),
        );

        expect(getByTestId('test-component')).to.exist;
      });
    });

    describe('when user has a token', () => {
      it('should not render the component', () => {
        const WrappedComponent = withAuthorization(
          TestComponent,
          AUTH_LEVELS.LOW_AUTH_ONLY,
        );

        const { queryByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ token: 'valid-token', hydrated: true }),
        );

        expect(queryByTestId('test-component')).to.not.exist;
      });

      it('should redirect to first token route when user has a token', async () => {
        const WrappedComponent = withAuthorization(
          TestComponent,
          AUTH_LEVELS.LOW_AUTH_ONLY,
        );

        const { getByTestId } = renderWithStoreAndRouterV6(
          <>
            <Routes>
              <Route path={URLS.ENTER_OTC} element={<WrappedComponent />} />
              <Route
                path={URLS.DATE_TIME}
                element={<div data-testid="date-time-page">Date Time</div>}
              />
            </Routes>
            <LocationDisplay />
          </>,
          {
            ...getDefaultRenderOptions({
              token: 'valid-token',
              hydrated: true,
            }),
            initialEntries: [URLS.ENTER_OTC],
          },
        );

        await waitFor(() => {
          expect(getByTestId('location-display').textContent).to.equal(
            URLS.DATE_TIME,
          );
        });
      });
    });
  });

  describe('hydration behavior', () => {
    it('should attempt to hydrate from sessionStorage when not hydrated and no token', async () => {
      const savedData = {
        uuid: 'saved-uuid',
        lastname: 'SavedName',
        dob: '1990-01-01',
        token: 'saved-token',
      };
      loadFormDataFromStorageStub.returns(savedData);

      const WrappedComponent = withAuthorization(TestComponent);

      const { getByTestId } = renderWithStoreAndRouterV6(
        <WrappedComponent />,
        getDefaultRenderOptions({ hydrated: false, token: null }),
      );

      await waitFor(() => {
        expect(loadFormDataFromStorageStub.calledOnce).to.be.true;
      });

      await waitFor(() => {
        expect(getByTestId('test-component')).to.exist;
      });
    });

    it('should not attempt to load from storage when already hydrated', async () => {
      const WrappedComponent = withAuthorization(TestComponent);

      renderWithStoreAndRouterV6(
        <WrappedComponent />,
        getDefaultRenderOptions({ hydrated: true, token: 'existing-token' }),
      );

      await waitFor(() => {
        expect(loadFormDataFromStorageStub.called).to.be.false;
      });
    });

    describe('auth level is LOW_AUTH_ONLY', () => {
      it('should complete hydration even when no saved data exists', async () => {
        loadFormDataFromStorageStub.returns(null);

        const WrappedComponent = withAuthorization(
          TestComponent,
          AUTH_LEVELS.LOW_AUTH_ONLY,
        );

        const { getByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ hydrated: false, token: null }),
        );

        // For LOW_AUTH_ONLY with no token, component should render after hydration completes
        await waitFor(() => {
          expect(getByTestId('test-component')).to.exist;
        });
      });
    });

    describe('auth level is TOKEN', () => {
      it('should not render anything while waiting for hydration on token route', () => {
        const WrappedComponent = withAuthorization(
          TestComponent,
          AUTH_LEVELS.TOKEN,
        );

        const { queryByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ token: null, hydrated: false }),
        );

        expect(queryByTestId('test-component')).to.not.exist;
      });
    });
  });

  describe('clearFormData behavior', () => {
    it('should dispatch clearFormData when redirecting unauthenticated user to Verify', async () => {
      const WrappedComponent = withAuthorization(TestComponent);

      const initialState = {
        vassForm: {
          hydrated: true,
          selectedDate: '2025-01-01',
          obfuscatedEmail: 's***@example.com',
          token: null,
          selectedTopics: [{ topicId: '1', topicName: 'Topic 1' }],
          uuid: 'test-uuid',
          lastname: 'Smith',
          dob: '1935-04-07',
        },
      };

      const store = createStore(
        combineReducers({ ...commonReducer, ...reducers }),
        initialState,
        applyMiddleware(thunk, vassApi.middleware),
      );

      const { getByTestId } = renderWithStoreAndRouterV6(
        <>
          <Routes>
            <Route path="/test" element={<WrappedComponent />} />
            <Route
              path={URLS.VERIFY}
              element={<div data-testid="verify-page">Verify</div>}
            />
          </Routes>
          <LocationDisplay />
        </>,
        {
          reducers,
          additionalMiddlewares: [vassApi.middleware],
          store,
          initialEntries: ['/test'],
        },
      );

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.include(
          URLS.VERIFY,
        );
      });

      const state = store.getState();
      expect(state.vassForm.selectedDate).to.be.null;
      expect(state.vassForm.selectedTopics).to.deep.equal([]);
    });
  });
});
