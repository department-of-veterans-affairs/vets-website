import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import sinon from 'sinon';

import App from '../../containers/App';
import formConfig from '../../config/form';

const mockStore = configureMockStore();
const originalSubmitUrl = formConfig.submitUrl;

function getDefaultState({
  featureToggles = { loading: false },
  hasSession = true,
} = {}) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('hasSession', JSON.stringify(hasSession));
  }

  return {
    vaFileNumber: {},
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
        currentlyLoggedIn: true,
      },
      profile: {
        loading: false,
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
} = {}) {
  const state = getDefaultState({
    featureToggles,
    hasSession,
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

  afterEach(() => {
    global.window.location = oldLocation;
    localStorage.removeItem('hasSession');
  });

  it('should show loading indicator while waiting for toggles', () => {
    const { container, queryByTestId } = renderApp({
      featureToggles: { loading: true },
    });

    const loadingIndicator = container.querySelector('va-loading-indicator');
    expect(loadingIndicator).to.not.be.null;
    expect(queryByTestId('children-content')).to.be.null;
  });

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

  it('should not redirect when on intro page (with session)', () => {
    const mockReplace = sinon.stub();
    delete window.location;
    window.location = { replace: mockReplace };

    renderApp();

    expect(mockReplace.called).to.be.false;
  });

  it('should not redirect when on intro page (without session)', () => {
    const mockReplace = sinon.stub();
    delete window.location;
    window.location = { replace: mockReplace };

    renderApp({ hasSession: false });

    expect(mockReplace.called).to.be.false;
  });

  it('should use the module route with toggle on', () => {
    const featureToggles = { dependentsModuleEnabled: true };
    // eslint-disable-next-line dot-notation
    featureToggles['dependents_module_enabled'] = true;

    renderApp({ featureToggles });

    expect(formConfig.submitUrl).to.contain('/dependents_benefits/v0/claims');

    // Reset to original value for other tests
    formConfig.submitUrl = originalSubmitUrl;
  });

  it('should not use the module route with toggle off', () => {
    const featureToggles = { dependentsModuleEnabled: false };
    // eslint-disable-next-line dot-notation
    featureToggles['dependents_module_enabled'] = false;

    renderApp({ featureToggles });

    expect(formConfig.submitUrl).to.contain('/v0/dependents_applications');

    // Reset to original value for other tests
    formConfig.submitUrl = originalSubmitUrl;
  });
});
