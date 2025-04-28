import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { MemoryRouter, Routes, Route } from 'react-router-dom-v5-compat';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { AppContent, ClaimsStatusApp } from '../../containers/ClaimsStatusApp';

describe('<AppContent>', () => {
  it('should render downtime loading indicator while downtime check is pending', () => {
    const store = createStore(() => ({
      scheduledDowntime: {
        globalDowntime: null,
        isReady: false,
        isPending: true,
        serviceMap: new Map(),
        dismissedDowntimeWarnings: [],
      },
    }));
    const props = {
      dispatchSetLastPage: sinon.spy(),
      featureFlagsLoading: false,
      user: {
        login: { currentlyLoggedIn: true, hasCheckedKeepAlive: false },
        profile: {
          services: [
            backendServices.EVSS_CLAIMS,
            backendServices.APPEALS_STATUS,
            backendServices.LIGHTHOUSE,
          ],
          verified: true,
        },
      },
    };

    const { getByTestId, queryByTestId } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Routes>
            <Route element={<ClaimsStatusApp {...props} />}>
              <Route index element={<div data-testid="children" />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(getByTestId('downtime-notification-loading')).to.have.attribute(
      'message',
      'Loading your information...',
    );
    expect(getByTestId('downtime-notification-loading')).to.have.attribute(
      'set-focus',
    );
    expect(queryByTestId('children')).to.not.exist;
  });

  it('should render feature flags loading indicator when feature flags are loading', () => {
    const { getByTestId, queryByTestId } = render(
      <AppContent featureFlagsLoading>
        <div data-testid="children" />
      </AppContent>,
    );

    expect(getByTestId('feature-flags-loading')).to.have.attribute(
      'message',
      'Loading your information...',
    );
    expect(getByTestId('feature-flags-loading')).to.have.attribute('set-focus');
    expect(queryByTestId('children')).to.not.exist;
  });

  it('should render only downtime loading indicator while downtime check is pending even when feature flags are also loading', () => {
    const store = createStore(() => ({
      scheduledDowntime: {
        globalDowntime: null,
        isReady: false,
        isPending: true,
        serviceMap: new Map(),
        dismissedDowntimeWarnings: [],
      },
    }));
    const props = {
      dispatchSetLastPage: sinon.spy(),
      featureFlagsLoading: true,
      user: {
        login: { currentlyLoggedIn: true, hasCheckedKeepAlive: false },
        profile: {
          services: [
            backendServices.EVSS_CLAIMS,
            backendServices.APPEALS_STATUS,
            backendServices.LIGHTHOUSE,
          ],
          verified: true,
        },
      },
    };

    const { getByTestId, queryByTestId } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Routes>
            <Route element={<ClaimsStatusApp {...props} />}>
              <Route index element={<div data-testid="children" />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(getByTestId('downtime-notification-loading')).to.exist;
    expect(queryByTestId('feature-flags-loading')).to.not.exist;
    expect(queryByTestId('children')).to.not.exist;
  });

  it('should render nested route if feature toggles are available', () => {
    const { getByTestId, queryByTestId } = render(
      <MemoryRouter>
        <Routes>
          <Route element={<AppContent featureFlagsLoading={false} />}>
            <Route index element={<div data-testid="children" />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(queryByTestId('feature-flags-loading')).to.not.exist;
    expect(getByTestId('children')).to.exist;
  });

  it('should render ClaimsStatusApp', () => {
    const store = createStore(() => ({
      scheduledDowntime: {
        globalDowntime: null,
        isReady: true,
        isPending: false,
        serviceMap: new Map(),
        dismissedDowntimeWarnings: [],
      },
    }));
    const props = {
      dispatchSetLastPage: sinon.spy(),
      featureFlagsLoading: false,
      user: {
        login: { currentlyLoggedIn: true, hasCheckedKeepAlive: false },
        profile: {
          services: [
            backendServices.EVSS_CLAIMS,
            backendServices.APPEALS_STATUS,
            backendServices.LIGHTHOUSE,
          ],
          verified: true,
        },
      },
    };

    const element = (
      <Provider store={store}>
        <ClaimsStatusApp {...props} />
      </Provider>
    );

    const { getByTestId, queryByTestId, unmount } = render(
      <MemoryRouter>
        <Routes>
          <Route element={element}>
            <Route index element={<div data-testid="children" />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(queryByTestId('downtime-notification-loading')).to.not.exist;
    expect(queryByTestId('feature-flags-loading')).to.not.exist;
    expect(getByTestId('children')).to.exist;

    unmount();

    expect(props.dispatchSetLastPage.called).to.be.true;
  });
});
