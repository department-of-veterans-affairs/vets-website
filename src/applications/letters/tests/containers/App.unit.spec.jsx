import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';

import * as datadog from 'platform/monitoring/Datadog';
import { assert } from 'chai';
import { App } from '../../containers/App';

const mockStore = configureStore([]);

describe('<App />', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Check component renders without crashing.', () => {
    const store = mockStore({
      user: {},
      letters: {},
    });
    const props = {
      featureFlagsLoading: true,
      user: {
        login: {},
        profile: {
          services: [],
          verified: true,
        },
      },
    };
    render(
      <Provider store={store}>
        <App {...props} />
      </Provider>,
    );
  });

  it('Checks feature flags are enabled if loaded and on.', () => {
    const store = mockStore({
      user: {},
      letters: {},
      featureToggles: {
        loading: false,
        /* eslint-disable camelcase */
        letters_client_side_monitoring: true,
      },
    });
    const loggingStub = sandbox.stub(datadog, 'initializeBrowserLogging');
    const props = {
      featureFlagsLoading: false,
      user: {
        login: {},
        profile: {
          services: [],
          verified: true,
        },
      },
    };
    render(
      <Provider store={store}>
        <App {...props} />
      </Provider>,
    );
    sinon.assert.calledOnce(loggingStub);
  });

  it('Checks logging was not enabled if feature flags are loading.', () => {
    const store = mockStore({
      user: {},
      letters: {},
      featureToggles: {
        loading: true,
        /* eslint-disable camelcase */
        letters_client_side_monitoring: undefined,
      },
    });
    const loggingStub = sandbox.stub(datadog, 'initializeBrowserLogging');
    const props = {
      featureFlagsLoading: false,
      user: {
        login: {},
        profile: {
          services: [],
          verified: true,
        },
      },
    };
    render(
      <Provider store={store}>
        <App {...props} />
      </Provider>,
    );
    sinon.assert.notCalled(loggingStub);
  });

  it('Check logging not enabled if feature flag loaded and off.', () => {
    const store = mockStore({
      user: {},
      letters: {},
      featureToggles: {
        loading: false,
        /* eslint-disable camelcase */
        letters_client_side_monitoring: false,
      },
    });
    const loggingStub = sandbox.stub(datadog, 'initializeBrowserLogging');
    const props = {
      featureFlagsLoading: false,
      user: {
        login: {},
        profile: {
          services: [],
          verified: true,
        },
      },
    };
    render(
      <Provider store={store}>
        <App {...props} />
      </Provider>,
    );
    sinon.assert.notCalled(loggingStub);
  });

  it('Checks RUM is enabled if its feature flag is loaded and on.', () => {
    const store = mockStore({
      user: {},
      letters: {},
      featureToggles: {
        loading: false,
        /* eslint-disable camelcase */
        letters_rum_dashboard: true,
      },
    });
    const monitoringStub = sandbox.stub(
      datadog,
      'initializeRealUserMonitoring',
    );
    const props = {
      featureFlagsLoading: false,
      user: {
        login: {},
        profile: {
          services: [],
          verified: true,
        },
      },
    };
    render(
      <Provider store={store}>
        <App {...props} />
      </Provider>,
    );
    sinon.assert.calledOnce(monitoringStub);
  });

  it('Checks RUM was not enabled if feature flags are loading.', () => {
    const store = mockStore({
      user: {},
      letters: {},
      featureToggles: {
        loading: true,
        /* eslint-disable camelcase */
        letters_rum_dashboard: undefined,
      },
    });
    const monitoringStub = sandbox.stub(
      datadog,
      'initializeRealUserMonitoring',
    );
    const props = {
      featureFlagsLoading: false,
      user: {
        login: {},
        profile: {
          services: [],
          verified: true,
        },
      },
    };
    render(
      <Provider store={store}>
        <App {...props} />
      </Provider>,
    );
    sinon.assert.notCalled(monitoringStub);
  });

  it('Check RUM was not enabled if its feature flag is loaded and off.', () => {
    const store = mockStore({
      user: {},
      letters: {},
      featureToggles: {
        loading: false,
        /* eslint-disable camelcase */
        letters_rum_dashboard: false,
      },
    });
    const monitoringStub = sandbox.stub(
      datadog,
      'initializeRealUserMonitoring',
    );
    window.DD_RUM = true;
    const props = {
      featureFlagsLoading: false,
      user: {
        login: {},
        profile: {
          services: [],
          verified: true,
        },
      },
    };
    render(
      <Provider store={store}>
        <App {...props} />
      </Provider>,
    );
    sinon.assert.notCalled(monitoringStub);
    assert.isUndefined(window.DD_RUM);
  });
});
