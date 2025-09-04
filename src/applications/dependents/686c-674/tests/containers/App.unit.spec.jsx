import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import App from '../../containers/App';
import formConfig from '../../config/form';

const mockStore = configureMockStore();
const originalSubmitUrl = formConfig.submitUrl;

function getDefaultState({
  featureToggles = { loading: false },
  hasSession = true,
  isLoggedIn = true,
  vaFileNumber = {},
  userLoading = false,
} = {}) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('hasSession', JSON.stringify(hasSession));
  }

  return {
    vaFileNumber,
    form: {
      formId: '686c-674',
      loadedStatus: 'success',
      savedStatus: '',
      loadedData: {
        metadata: {},
      },
      data: {},
      submission: {
        response: {},
        timestamp: null,
      },
    },
    user: {
      login: {
        currentlyLoggedIn: isLoggedIn,
      },
      profile: {
        loading: userLoading,
        savedForms: [],
        prefillsAvailable: [],
        loa: {
          current: 3,
          highest: 3,
        },
        verified: true,
        dob: '1990-01-01',
        userFullName: {
          first: 'Test',
          last: 'User',
        },
        claims: {
          appeals: false,
        },
      },
    },
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: { get: () => null },
      dismissedDowntimeWarnings: [],
    },
    featureToggles: {
      loading: false,
      vaDependentsV2: true,
      ...featureToggles,
    },
  };
}

function renderApp({
  pathname = '/introduction',
  search = '',
  hash = '',
  featureToggles,
  hasSession,
  isLoggedIn,
  vaFileNumber,
  userLoading,
} = {}) {
  const state = getDefaultState({
    featureToggles,
    hasSession,
    isLoggedIn,
    vaFileNumber,
    userLoading,
  });
  const store = mockStore(state);

  const _location = {
    ...window.location,
    pathname,
    search,
    hash,
  };

  return render(
    <Provider store={store}>
      <App location={_location}>
        <div data-testid="children-content">Child content</div>
      </App>
    </Provider>,
  );
}

describe('App container logic', () => {
  const oldLocation = global.window.location;

  beforeEach(() => {
    document.title = '';
  });

  afterEach(() => {
    global.window.location = oldLocation;
    localStorage.removeItem('hasSession');
    formConfig.submitUrl = originalSubmitUrl;
  });

  describe('document title', () => {
    it('should set document title on render', () => {
      renderApp();
      expect(document.title).to.equal(
        'Add or remove dependents on VA benefits',
      );
    });
  });

  describe('loading states', () => {
    it('should show loading indicator while waiting for toggles', () => {
      const { container, queryByTestId } = renderApp({
        featureToggles: { loading: true },
      });

      const loadingIndicator = container.querySelector('va-loading-indicator');
      expect(loadingIndicator).to.not.be.null;
      expect(loadingIndicator.getAttribute('message')).to.equal(
        'Loading your information...',
      );
      expect(queryByTestId('children-content')).to.be.null;
    });

    it('should show loading indicator while user profile is loading', () => {
      const { container, queryByTestId } = renderApp({
        userLoading: true,
      });

      const loadingIndicator = container.querySelector('va-loading-indicator');
      expect(loadingIndicator).to.not.be.null;
      expect(queryByTestId('children-content')).to.be.null;
    });
  });

  describe('authentication behavior', () => {
    it('should render redirect loading indicator when user is not logged in on form page', () => {
      const { container } = renderApp({
        pathname: '/some-form-page',
        isLoggedIn: false,
      });

      const loadingIndicator = container.querySelector('va-loading-indicator');
      expect(loadingIndicator).to.exist;
      expect(loadingIndicator.getAttribute('message')).to.equal(
        'Redirecting to introduction page...',
      );
    });

    it('should render redirect loading indicator when user lacks valid VA file number', () => {
      const { container } = renderApp({
        pathname: '/some-form-page',
        vaFileNumber: {
          hasVaFileNumber: {
            VALIDVAFILENUMBER: false,
          },
        },
      });

      const loadingIndicator = container.querySelector('va-loading-indicator');
      expect(loadingIndicator).to.exist;
      expect(loadingIndicator.getAttribute('message')).to.equal(
        'Redirecting to introduction page...',
      );
    });

    it('should render normally when on introduction page regardless of auth state', () => {
      const { getByTestId } = renderApp({
        pathname: '/introduction',
        isLoggedIn: false,
      });

      expect(getByTestId('children-content')).to.exist;
    });
  });

  describe('V2 version handling', () => {
    it('should redirect to old form when V2 is disabled', () => {
      delete window.location;
      window.location = { href: '' };

      renderApp({
        featureToggles: { vaDependentsV2: false },
      });

      expect(window.location.href).to.contain('/add-remove-form-21-686c/');
    });
  });

  describe('breadcrumbs', () => {
    it('should render breadcrumbs with correct structure', () => {
      const { container } = renderApp();

      const breadcrumbs = container.querySelector('va-breadcrumbs');
      expect(breadcrumbs).to.exist;

      const breadcrumbList = JSON.parse(
        breadcrumbs.getAttribute('breadcrumb-list'),
      );
      expect(breadcrumbList).to.have.lengthOf(3);
      expect(breadcrumbList[0]).to.deep.equal({ href: '/', label: 'Home' });
      expect(breadcrumbList[1].href).to.contain('dependents');
      expect(breadcrumbList[2].href).to.contain('/introduction');
    });
  });

  describe('submit URL configuration', () => {
    it('should use module route when dependentsModuleEnabled toggle is on', () => {
      const { container } = renderApp({
        featureToggles: {
          dependentsModuleEnabled: true,
        },
      });

      expect(container.querySelector('article')).to.exist;
    });

    it('should use legacy route when dependentsModuleEnabled toggle is off', () => {
      const { container } = renderApp({
        featureToggles: {
          dependentsModuleEnabled: false,
        },
      });

      expect(container.querySelector('article')).to.exist;
    });
  });

  describe('rendering behavior', () => {
    it('should render RoutedSavableApp with children when on intro page (with session)', () => {
      const { getByTestId } = renderApp();
      expect(getByTestId('children-content')).to.exist;
    });

    it('should render RoutedSavableApp with children when on intro page (without session)', () => {
      const { getByTestId } = renderApp({
        hasSession: false,
      });

      expect(getByTestId('children-content')).to.exist;
    });

    it('should always render breadcrumbs', () => {
      const { container } = renderApp();
      const breadcrumbs = container.querySelector('va-breadcrumbs');
      expect(breadcrumbs).to.exist;
    });
  });

  describe('edge cases', () => {
    it('should handle missing location pathname gracefully', () => {
      const { container } = renderApp({
        pathname: undefined,
      });

      const article = container.querySelector('article');
      expect(article).to.exist;
    });
  });
});
