import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';

// Set test environment
process.env.NODE_ENV = 'test';

// Import components and utilities
import * as environment from '~/platform/utilities/environment';
import AuthenticatedRoute from '../../../containers/AuthenticatedRoute';
import * as routeGuardHelpers from '../../../utils/helpers/route-guard';
import { INTRO_URL } from '../../../utils/helpers/route-guard';

describe('ezr AuthenticatedRoute', () => {
  // Create a simple test component
  const TestComponent = () => (
    <div data-testid="test-component">Test Component</div>
  );

  // Store original implementations
  const originalIsLocalhost = environment.isLocalhost;
  const originalGetCurrentPath = routeGuardHelpers.getCurrentPath;
  const originalRedirectToIntro = routeGuardHelpers.redirectToIntro;
  const originalRenderComponent = routeGuardHelpers.renderComponent;
  const originalIsValidComponent = routeGuardHelpers.isValidComponent;

  beforeEach(() => {
    // Set up stub implementations
    environment.isLocalhost = () => false;
    routeGuardHelpers.getCurrentPath = () => '/test-path';
    routeGuardHelpers.redirectToIntro = () => (
      <div data-testid="redirect">Redirected</div>
    );
    routeGuardHelpers.renderComponent = (Component, props) => (
      <Component {...props} />
    );
    routeGuardHelpers.isValidComponent = () => true;
  });

  afterEach(() => {
    // Restore original implementations
    environment.isLocalhost = originalIsLocalhost;
    routeGuardHelpers.getCurrentPath = originalGetCurrentPath;
    routeGuardHelpers.redirectToIntro = originalRedirectToIntro;
    routeGuardHelpers.renderComponent = originalRenderComponent;
    routeGuardHelpers.isValidComponent = originalIsValidComponent;
  });

  const createMockStore = ({
    isAuthenticated = true,
    isLOA3 = true,
    featureToggleEnabled = true,
  }) => ({
    getState: () => ({
      featureToggles: {
        ezrRouteGuardEnabled: featureToggleEnabled,
      },
      user: {
        profile: {
          verified: isAuthenticated,
          loa: { current: isLOA3 ? 3 : 1 },
        },
        login: {
          currentlyLoggedIn: isAuthenticated,
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  });

  context('when in non-localhost environments', () => {
    it('should render component for authenticated users', () => {
      // Setup
      environment.isLocalhost = () => false;
      routeGuardHelpers.getCurrentPath = () => '/protected-route';

      // Spy on the renderComponent function
      const renderComponentSpy = sinon.spy(
        routeGuardHelpers,
        'renderComponent',
      );
      const redirectToIntroSpy = sinon.spy(
        routeGuardHelpers,
        'redirectToIntro',
      );

      const mockStore = createMockStore({
        isAuthenticated: true,
        isLOA3: true,
      });

      // Act
      render(
        <Provider store={mockStore}>
          <AuthenticatedRoute
            component={TestComponent}
            user={mockStore.getState().user}
          />
        </Provider>,
      );

      // Assert
      expect(renderComponentSpy.called).to.be.true;
      expect(redirectToIntroSpy.called).to.be.false;

      // Cleanup
      renderComponentSpy.restore();
      redirectToIntroSpy.restore();
    });

    it('should redirect unauthenticated users', () => {
      // Setup
      environment.isLocalhost = () => false;
      routeGuardHelpers.getCurrentPath = () => '/protected-route';

      // Spy on the redirectToIntro function
      const renderComponentSpy = sinon.spy(
        routeGuardHelpers,
        'renderComponent',
      );
      const redirectToIntroSpy = sinon.spy(
        routeGuardHelpers,
        'redirectToIntro',
      );

      const mockStore = createMockStore({
        isAuthenticated: false,
        isLOA3: false,
      });

      // Act
      render(
        <Provider store={mockStore}>
          <AuthenticatedRoute
            component={TestComponent}
            user={mockStore.getState().user}
          />
        </Provider>,
      );

      // Assert
      expect(redirectToIntroSpy.called).to.be.true;
      expect(renderComponentSpy.called).to.be.false;

      // Cleanup
      renderComponentSpy.restore();
      redirectToIntroSpy.restore();
    });
  });

  context('when on the introduction page', () => {
    it('should bypass authentication checks', () => {
      // Setup
      environment.isLocalhost = () => false;
      routeGuardHelpers.getCurrentPath = () => INTRO_URL;

      // Spy on the redirectToIntro function
      const redirectToIntroSpy = sinon.spy(
        routeGuardHelpers,
        'redirectToIntro',
      );

      const mockStore = createMockStore({
        isAuthenticated: false,
        isLOA3: false,
      });

      // Act - this should render the component directly
      render(
        <Provider store={mockStore}>
          <AuthenticatedRoute
            component={TestComponent}
            user={mockStore.getState().user}
          />
        </Provider>,
      );

      // Assert - should not redirect
      expect(redirectToIntroSpy.called).to.be.false;

      // Cleanup
      redirectToIntroSpy.restore();
    });
  });

  // Feature toggle tests are in a separate file: AuthenticatedRouteFeatureToggle.unit.spec.js
});
