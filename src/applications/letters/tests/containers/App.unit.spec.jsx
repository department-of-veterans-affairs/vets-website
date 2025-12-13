import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';

import * as datadog from 'platform/monitoring/Datadog';
import { assert } from 'chai';
import { App } from '../../containers/App';
import {
  DATA_DOG_LOGGING_ID,
  DATA_DOG_LOGGING_SERVICE,
  DATA_DOG_LOGGING_TOKEN,
  DATA_DOG_LOGGING_VERSION,
  DATA_DOG_RUM_ID,
  DATA_DOG_RUM_SERVICE,
  DATA_DOG_RUM_TOKEN,
  DATA_DOG_RUM_VERSION,
} from '../../utils/constants';

const mockStore = configureStore([]);

describe('<App />', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Component renders without crashing.', () => {
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

  it('Logging is intialized when feature flag is loaded and on.', () => {
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
    assert.deepEqual(loggingStub.firstCall.args[0], {
      applicationId: DATA_DOG_LOGGING_ID,
      clientToken: DATA_DOG_LOGGING_TOKEN,
      service: DATA_DOG_LOGGING_SERVICE,
      version: DATA_DOG_LOGGING_VERSION,
    });
  });

  it('Logging is not initialized if feature flags are loading.', () => {
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

  it('Logging is not initialized if feature flag is loaded and off.', () => {
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

  it('RUM is initialized if its feature flag is loaded and on.', () => {
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
    assert.deepEqual(monitoringStub.firstCall.args[0], {
      applicationId: DATA_DOG_RUM_ID,
      clientToken: DATA_DOG_RUM_TOKEN,
      service: DATA_DOG_RUM_SERVICE,
      version: DATA_DOG_RUM_VERSION,
    });
  });

  it('RUM is not initialized if feature flags are loading.', () => {
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

  it('RUM is not initialized if its feature flag is loaded and off.', () => {
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
