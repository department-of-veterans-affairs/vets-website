import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import sinon from 'sinon';

import App from '../../../containers/App';

const mockStore = configureMockStore();

function getDefaultState({
  featureToggle = true,
  loading = false,
  hasSession = true,
  dependentsLoading = false,
} = {}) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('hasSession', JSON.stringify(hasSession));
  }

  return {
    form: {
      formId: '21-0538',
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
      vaDependentsVerification: featureToggle,
    },
    externalServiceStatus: {
      loading,
    },
    dependents: {
      loading: dependentsLoading,
    },
  };
}

function renderApp({
  pathname = '/introduction',
  featureToggle,
  loading,
  hasSession,
  dependentsLoading,
  replace = () => {},
} = {}) {
  const state = getDefaultState({
    featureToggle,
    loading,
    hasSession,
    dependentsLoading,
  });
  const store = mockStore(state);

  return render(
    <Provider store={store}>
      <App location={{ pathname, replace, search: '' }}>
        <div data-testid="children-content">Child content</div>
      </App>
    </Provider>,
  );
}

describe('App container logic', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    if (sandbox) {
      sandbox.restore();
    }
    localStorage.removeItem('hasSession');
  });

  it('should show loading indicator when externalServiceStatus is loading', () => {
    const { container, queryByTestId } = renderApp({ loading: true });

    const loadingIndicator = container.querySelector('va-loading-indicator');
    expect(loadingIndicator).to.not.be.null;
    expect(queryByTestId('children-content')).to.be.null;
  });

  it('should render NoFormPage if feature toggle is off', () => {
    const { container } = renderApp({ featureToggle: false });
    const noFormHeading = container.querySelector('h1');
    expect(noFormHeading?.textContent).to.match(
      /21-0538 Dependents Verification Form/i,
    );
  });

  it('should render RoutedSavableApp with children when on intro page (with session)', () => {
    const { getByTestId } = renderApp({
      pathname: '/introduction',
      hasSession: true,
    });
    expect(getByTestId('children-content')).to.exist;
  });

  it('should render RoutedSavableApp with children when on intro page (without session)', () => {
    const { getByTestId } = renderApp({
      pathname: '/introduction',
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
    const mockReplace = sandbox.stub();

    renderApp({
      pathname: '/introduction',
      hasSession: true,
      dependentsLoading: true,
      replace: mockReplace,
    });

    expect(mockReplace.called).to.be.false;
  });

  it('should not redirect when on intro page (without session)', () => {
    const mockReplace = sandbox.stub();

    renderApp({
      pathname: '/introduction',
      hasSession: false,
      dependentsLoading: true,
      replace: mockReplace,
    });

    expect(mockReplace.called).to.be.false;
  });
});
