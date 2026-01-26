import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import { Routes, Route, useLocation } from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouterV6 } from '~/platform/testing/unit/react-testing-library-helpers';

import withAuthorization from './withAuthorization';
import { AUTH_LEVELS, URLS } from '../utils/constants';
import * as formSlice from '../redux/slices/formSlice';
import * as authUtils from '../utils/auth';
import { createMockJwt } from '../utils/mock-helpers';
import {
  getDefaultRenderOptions,
  getHydratedFormRenderOptions,
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
  let getVassTokenStub;
  let isTokenExpiredStub;
  let removeVassTokenStub;

  beforeEach(() => {
    loadFormDataFromStorageStub = sinon.stub(
      formSlice,
      'loadFormDataFromStorage',
    );
    loadFormDataFromStorageStub.returns(null);

    getVassTokenStub = sinon.stub(authUtils, 'getVassToken');
    isTokenExpiredStub = sinon.stub(authUtils, 'isTokenExpired');
    removeVassTokenStub = sinon.stub(authUtils, 'removeVassToken');

    // Default: no token
    getVassTokenStub.returns(null);
    isTokenExpiredStub.returns(false);
  });

  afterEach(() => {
    loadFormDataFromStorageStub.restore();
    getVassTokenStub.restore();
    isTokenExpiredStub.restore();
    removeVassTokenStub.restore();
  });

  /**
   * Helper to set up auth stubs for a valid token scenario
   */
  const setupValidToken = () => {
    const validToken = createMockJwt('test-uuid', 3600);
    getVassTokenStub.returns(validToken);
    isTokenExpiredStub.returns(false);
    return validToken;
  };

  /**
   * Helper to set up auth stubs for an expired token scenario
   */
  const setupExpiredToken = () => {
    const expiredToken = createMockJwt('test-uuid', -3600);
    getVassTokenStub.returns(expiredToken);
    isTokenExpiredStub.returns(true);
    return expiredToken;
  };

  /**
   * Helper to set up auth stubs for no token scenario
   */
  const setupNoToken = () => {
    getVassTokenStub.returns(null);
    isTokenExpiredStub.returns(false);
  };

  describe('with AUTH_LEVELS.TOKEN', () => {
    describe('when user has a valid token', () => {
      it('should render the wrapped component', () => {
        setupValidToken();
        const WrappedComponent = withAuthorization(
          TestComponent,
          AUTH_LEVELS.TOKEN,
        );

        const { getByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ hydrated: true }),
        );

        expect(getByTestId('test-component')).to.exist;
      });
    });

    describe('when user has no token', () => {
      it('should not render the component', () => {
        setupNoToken();
        const WrappedComponent = withAuthorization(
          TestComponent,
          AUTH_LEVELS.TOKEN,
        );

        const { queryByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ hydrated: true }),
        );

        expect(queryByTestId('test-component')).to.not.exist;
      });

      it('should not render the component after hydration completes', async () => {
        setupNoToken();
        const WrappedComponent = withAuthorization(TestComponent);

        const { queryByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ hydrated: false }),
        );

        await waitFor(() => {
          expect(queryByTestId('test-component')).to.not.exist;
        });
      });

      it('should redirect to Verify page when no token but uuid exists', async () => {
        setupNoToken();
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

    describe('when user has an expired token', () => {
      it('should not render the component', () => {
        setupExpiredToken();
        const WrappedComponent = withAuthorization(
          TestComponent,
          AUTH_LEVELS.TOKEN,
        );

        const { queryByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ hydrated: true }),
        );

        expect(queryByTestId('test-component')).to.not.exist;
      });

      it('should remove the expired token cookie', async () => {
        setupExpiredToken();
        const WrappedComponent = withAuthorization(TestComponent);

        renderWithStoreAndRouterV6(
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
              uuid: 'test-uuid',
              hydrated: true,
            }),
            initialEntries: ['/test'],
          },
        );

        await waitFor(() => {
          expect(removeVassTokenStub.calledOnce).to.be.true;
        });
      });

      it('should redirect to Verify page when token is expired', async () => {
        setupExpiredToken();
        const WrappedComponent = withAuthorization(TestComponent);

        const { getByTestId } = renderWithStoreAndRouterV6(
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
      });
    });
  });

  describe('with AUTH_LEVELS.LOW_AUTH_ONLY', () => {
    describe('when user has no token', () => {
      it('should render the wrapped component', () => {
        setupNoToken();
        const WrappedComponent = withAuthorization(
          TestComponent,
          AUTH_LEVELS.LOW_AUTH_ONLY,
        );

        const { getByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ hydrated: true }),
        );

        expect(getByTestId('test-component')).to.exist;
      });
    });

    describe('when user has a valid token', () => {
      it('should not render the component', () => {
        setupValidToken();
        const WrappedComponent = withAuthorization(
          TestComponent,
          AUTH_LEVELS.LOW_AUTH_ONLY,
        );

        const { queryByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ hydrated: true }),
        );

        expect(queryByTestId('test-component')).to.not.exist;
      });

      it('should redirect to first token route when user has a valid token', async () => {
        setupValidToken();
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

    describe('when user has an expired token', () => {
      it('should render the wrapped component (expired token is treated as no token)', () => {
        setupExpiredToken();
        const WrappedComponent = withAuthorization(
          TestComponent,
          AUTH_LEVELS.LOW_AUTH_ONLY,
        );

        const { getByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ hydrated: true }),
        );

        expect(getByTestId('test-component')).to.exist;
      });
    });
  });

  describe('hydration behavior', () => {
    it('should attempt to hydrate from sessionStorage when not hydrated and no valid token', async () => {
      setupNoToken();
      const savedData = {
        uuid: 'saved-uuid',
        lastname: 'SavedName',
        dob: '1990-01-01',
      };
      loadFormDataFromStorageStub.returns(savedData);

      // Use LOW_AUTH_ONLY to test hydration behavior without requiring a token
      const WrappedComponent = withAuthorization(
        TestComponent,
        AUTH_LEVELS.LOW_AUTH_ONLY,
      );

      const { getByTestId } = renderWithStoreAndRouterV6(
        <WrappedComponent />,
        getDefaultRenderOptions({ hydrated: false }),
      );

      await waitFor(() => {
        expect(loadFormDataFromStorageStub.calledOnce).to.be.true;
      });

      await waitFor(() => {
        expect(getByTestId('test-component')).to.exist;
      });
    });

    it('should not attempt to load from storage when already hydrated', async () => {
      setupValidToken();
      const WrappedComponent = withAuthorization(TestComponent);

      renderWithStoreAndRouterV6(
        <WrappedComponent />,
        getDefaultRenderOptions({ hydrated: true }),
      );

      await waitFor(() => {
        expect(loadFormDataFromStorageStub.called).to.be.false;
      });
    });

    describe('auth level is LOW_AUTH_ONLY', () => {
      it('should complete hydration even when no saved data exists', async () => {
        setupNoToken();
        loadFormDataFromStorageStub.returns(null);

        const WrappedComponent = withAuthorization(
          TestComponent,
          AUTH_LEVELS.LOW_AUTH_ONLY,
        );

        const { getByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ hydrated: false }),
        );

        // For LOW_AUTH_ONLY with no token, component should render after hydration completes
        await waitFor(() => {
          expect(getByTestId('test-component')).to.exist;
        });
      });
    });

    describe('auth level is TOKEN', () => {
      it('should not render anything while waiting for hydration on token route', () => {
        setupNoToken();
        const WrappedComponent = withAuthorization(
          TestComponent,
          AUTH_LEVELS.TOKEN,
        );

        const { queryByTestId } = renderWithStoreAndRouterV6(
          <WrappedComponent />,
          getDefaultRenderOptions({ hydrated: false }),
        );

        expect(queryByTestId('test-component')).to.not.exist;
      });
    });
  });

  describe('clearFormData behavior', () => {
    it('should dispatch clearFormData when redirecting unauthenticated user to Verify', async () => {
      setupNoToken();
      const WrappedComponent = withAuthorization(TestComponent);

      const defaultOptions = getHydratedFormRenderOptions();

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
          ...defaultOptions,
          initialEntries: ['/test'],
        },
      );

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.include(
          URLS.VERIFY,
        );
      });

      const state = defaultOptions.store.getState();
      expect(state.vassForm.selectedDate).to.be.null;
      expect(state.vassForm.selectedTopics).to.deep.equal([]);
    });

    it('should dispatch clearFormData when redirecting user with expired token to Verify', async () => {
      setupExpiredToken();
      const WrappedComponent = withAuthorization(TestComponent);

      const defaultOptions = getHydratedFormRenderOptions();

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
          ...defaultOptions,
          initialEntries: ['/test'],
        },
      );

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.include(
          URLS.VERIFY,
        );
      });

      // Verify clearFormData was called (state was reset)
      const state = defaultOptions.store.getState();
      expect(state.vassForm.selectedDate).to.be.null;
      expect(state.vassForm.selectedTopics).to.deep.equal([]);

      // Verify expired token was removed
      expect(removeVassTokenStub.calledOnce).to.be.true;
    });
  });
});
