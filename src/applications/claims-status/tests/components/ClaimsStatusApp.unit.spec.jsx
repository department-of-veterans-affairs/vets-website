import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { MemoryRouter, Routes, Route } from 'react-router-dom-v5-compat';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import * as platformMonitoring from 'platform/monitoring/Datadog';
import { AppContent, ClaimsStatusApp } from '../../containers/ClaimsStatusApp';

describe('<AppContent>', () => {
  let useBrowserMonitoringStub;

  beforeEach(() => {
    useBrowserMonitoringStub = sinon.stub(
      platformMonitoring,
      'useBrowserMonitoring',
    );
  });

  afterEach(() => {
    useBrowserMonitoringStub.restore();
  });
  it('should render downtime loader while downtime check is pending', () => {
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

    expect(getByTestId('downtime-notification-loader')).to.have.attribute(
      'message',
      'Loading your claims and appeals...',
    );
    expect(getByTestId('downtime-notification-loader')).to.have.attribute(
      'set-focus',
    );
    expect(queryByTestId('children')).to.not.exist;
  });

  it('should render only downtime loader while downtime check is pending even when feature flags are also loading', () => {
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

    expect(getByTestId('downtime-notification-loader')).to.exist;
    expect(queryByTestId('feature-flags-loader')).to.not.exist;
    expect(queryByTestId('children')).to.not.exist;
  });

  it('should render loading indicator if feature toggles are not available', () => {
    const { getByTestId, queryByTestId } = render(
      <AppContent featureFlagsLoading>
        <div data-testid="children" />
      </AppContent>,
    );

    const loadingIndicator = getByTestId('feature-flags-loader');
    expect(loadingIndicator).to.exist;
    expect(loadingIndicator.tagName.toLowerCase()).to.equal(
      'va-loading-indicator',
    );
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

    expect(queryByTestId('feature-flags-loader')).to.not.exist;
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

    expect(queryByTestId('feature-flags-loader')).to.not.exist;
    expect(getByTestId('children')).to.exist;

    unmount();

    expect(props.dispatchSetLastPage.called).to.be.true;
  });
});

describe('<ClaimsStatusApp> - Platform DataDog RUM Integration', () => {
  let useBrowserMonitoringStub;
  let store;

  beforeEach(() => {
    useBrowserMonitoringStub = sinon.stub(
      platformMonitoring,
      'useBrowserMonitoring',
    );

    store = createStore(() => ({
      scheduledDowntime: {
        globalDowntime: null,
        isReady: true,
        isPending: false,
        serviceMap: new Map(),
        dismissedDowntimeWarnings: [],
      },
      featureToggles: {
        loading: false,
        cstUseDataDogRUM: true,
      },
    }));
  });

  afterEach(() => {
    useBrowserMonitoringStub.restore();
  });

  it('should call platform useBrowserMonitoring with correct parameters when logged in', () => {
    const props = {
      dispatchSetLastPage: sinon.spy(),
      featureFlagsLoading: false,
      loggedIn: true,
      user: {
        login: { currentlyLoggedIn: true, hasCheckedKeepAlive: false },
        profile: {
          services: [
            backendServices.APPEALS_STATUS,
            backendServices.LIGHTHOUSE,
          ],
          verified: true,
        },
      },
    };

    render(
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

    expect(useBrowserMonitoringStub.calledOnce).to.be.true;

    const callArgs = useBrowserMonitoringStub.firstCall.args[0];
    const { beforeSend, ...staticArgs } = callArgs;

    expect(staticArgs).to.deep.equal({
      toggleName: 'cstUseDataDogRUM',
      loggedIn: true,
      applicationId: '75bb17aa-34f0-4366-b196-eb11eda75425',
      clientToken: 'pub21bfd23fdfb656231f24906ea91ccb01',
      service: 'benefits-claim-status-tool',
      version: '1.0.0',
      sessionReplaySampleRate: 50,
    });

    expect(beforeSend).to.be.a('function');

    // Test that beforeSend scrubs click event metadata
    const clickEvent = {
      action: {
        type: 'click',
        target: { name: 'Sensitive_File_Name.pdf' },
      },
    };
    expect(beforeSend(clickEvent)).to.be.true;
    expect(clickEvent.action.target.name).to.equal('Clicked sensitive item');
  });

  it('should call platform useBrowserMonitoring with loggedIn false when user not logged in', () => {
    const props = {
      dispatchSetLastPage: sinon.spy(),
      featureFlagsLoading: false,
      loggedIn: false,
      user: {
        login: { currentlyLoggedIn: false, hasCheckedKeepAlive: false },
        profile: {
          services: [],
          verified: false,
        },
      },
    };

    render(
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

    expect(useBrowserMonitoringStub.calledOnce).to.be.true;
    expect(useBrowserMonitoringStub.firstCall.args[0].loggedIn).to.equal(false);
  });

  it('should pass toggleName for feature flag control', () => {
    const props = {
      dispatchSetLastPage: sinon.spy(),
      featureFlagsLoading: false,
      loggedIn: true,
      user: {
        login: { currentlyLoggedIn: true, hasCheckedKeepAlive: false },
        profile: {
          services: [
            backendServices.APPEALS_STATUS,
            backendServices.LIGHTHOUSE,
          ],
          verified: true,
        },
      },
    };

    render(
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

    const callArgs = useBrowserMonitoringStub.firstCall.args[0];
    expect(callArgs).to.have.property('toggleName');
    expect(callArgs.toggleName).to.equal('cstUseDataDogRUM');
  });

  it('should include all required settings for platform RUM initialization', () => {
    const props = {
      dispatchSetLastPage: sinon.spy(),
      featureFlagsLoading: false,
      loggedIn: true,
      user: {
        login: { currentlyLoggedIn: true, hasCheckedKeepAlive: false },
        profile: {
          services: [
            backendServices.APPEALS_STATUS,
            backendServices.LIGHTHOUSE,
          ],
          verified: true,
        },
      },
    };

    render(
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

    const callArgs = useBrowserMonitoringStub.firstCall.args[0];

    // Verify all required parameters are present
    expect(callArgs).to.have.property('applicationId');
    expect(callArgs).to.have.property('clientToken');
    expect(callArgs).to.have.property('service');
    expect(callArgs).to.have.property('version');

    // Verify correct values
    expect(callArgs.applicationId).to.equal(
      '75bb17aa-34f0-4366-b196-eb11eda75425',
    );
    expect(callArgs.clientToken).to.equal(
      'pub21bfd23fdfb656231f24906ea91ccb01',
    );
    expect(callArgs.service).to.equal('benefits-claim-status-tool');
    expect(callArgs.version).to.equal('1.0.0');
  });
});
