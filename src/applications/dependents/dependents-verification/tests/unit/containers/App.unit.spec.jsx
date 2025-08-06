import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import sinon from 'sinon';

import App from '../../../containers/App';

const mockStore = configureMockStore();

function getDefaultState({
  featureToggle = true,
  loading = false,
  hasSession = true,
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
  };
}

function renderApp({
  pathname = '/introduction',
  search = '',
  hash = '',
  featureToggle,
  loading,
  hasSession,
} = {}) {
  const state = getDefaultState({ featureToggle, loading, hasSession });
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

  it('should redirect', async () => {
    const { container } = renderApp({
      pathname: '/add',
      hasSession: false,
    });

    await waitFor(() => {
      const loadingIndicator = container.querySelector('va-loading-indicator');
      expect(loadingIndicator).to.not.be.null;
    });
  });

  it.skip('should render RoutedSavableApp with children if all conditions pass', () => {
    const { getByTestId } = renderApp();
    expect(getByTestId('children-content')).to.exist;
  });

  it('should always render breadcrumbs', () => {
    const { container } = renderApp();
    const breadcrumbs = container.querySelector('va-breadcrumbs');
    expect(breadcrumbs).to.exist;
  });
});

it('should redirect to introduction page when not on intro page', () => {
  const mockReplace = sinon.stub();
  delete window.location;
  window.location = { replace: mockReplace };

  renderApp({
    pathname: '/add',
    hasSession: false,
  });

  expect(mockReplace.called).to.be.true;
});
