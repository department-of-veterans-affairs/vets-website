import { expect } from 'chai';
import sinon from 'sinon';

import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { datadogRum } from '@datadog/browser-rum';
import { render } from '@testing-library/react';
import * as constants from '../../constants';
import * as useDatadogRum from '../../utils/useDatadogRum';

// eslint-disable-next-line react/prop-types
const TestComponent = ({ loggedIn = false }) => {
  useDatadogRum.useBrowserMonitoring({ loggedIn });
  return <div data-testid="test" />;
};

describe('initializeRealUserMonitoring', () => {
  let envStub;
  let initSpy;
  let startSessionReplayRecordingSpy;

  beforeEach(() => {
    envStub = sinon.stub(constants, 'isProductionEnv');
    initSpy = sinon.spy(datadogRum, 'init');
    startSessionReplayRecordingSpy = sinon.spy(
      datadogRum,
      'startSessionReplayRecording',
    );
  });

  afterEach(() => {
    envStub.restore();
    initSpy.restore();
    startSessionReplayRecordingSpy.restore();
  });

  context('when isProductionEnv is true', () => {
    it.skip('should call init and startSessionReplayRecording ', () => {
      envStub.returns(true);
      useDatadogRum.initializeRealUserMonitoring();
      expect(initSpy.called).to.be.true;

      expect(initSpy.calledOnce).to.be.true;
      expect(startSessionReplayRecordingSpy.calledOnce).to.be.true;
    });
  });
  context('when isProductionEnv is false', () => {
    it('should not call init and startSessionReplayRecording ', () => {
      envStub.returns(false);
      useDatadogRum.initializeRealUserMonitoring();
      expect(initSpy.notCalled).to.be.true;
      expect(startSessionReplayRecordingSpy.notCalled).to.be.true;
    });
  });
});

describe('useBrowserMonitoring', () => {
  const getStore = (cstUseDataDogRUM = true, loading = false) =>
    createStore(() => ({
      featureToggles: {
        loading,
        // eslint-disable-next-line camelcase
        cst_use_dd_rum: cstUseDataDogRUM,
      },
    }));

  let spy;

  beforeEach(() => {
    spy = sinon.spy(useDatadogRum, 'initializeRealUserMonitoring');
    window.DD_RUM = { getInitConfiguration: () => {} };
    window.DD_LOGS = { getInitConfiguration: () => {} };
  });

  afterEach(() => {
    spy.restore();
  });
  context('when loggedIn false', () => {
    it('it should return', () => {
      render(
        <Provider store={getStore()}>
          <TestComponent />
        </Provider>,
      );

      expect(spy.notCalled).to.be.true;
      expect(window.DD_RUM).to.exist;
      expect(window.DD_LOGS).to.exist;
    });
  });
  context('when isLoadingFeatureFlags false', () => {
    it('it should return', () => {
      render(
        <Provider store={getStore()}>
          <TestComponent />
        </Provider>,
      );

      expect(spy.notCalled).to.be.true;
      expect(window.DD_RUM).to.exist;
      expect(window.DD_LOGS).to.exist;
    });
  });
  context(
    'when user is logged in and ff are not loading and the toggle is enabled',
    () => {
      it.skip('it should call initializeRealUserMonitoring', () => {
        render(
          <Provider store={getStore()}>
            <TestComponent loggedIn />
          </Provider>,
        );
        expect(spy.called).to.be.true;
        expect(window.DD_RUM).to.exist;
        expect(window.DD_LOGS).to.exist;
      });
    },
  );
  context(
    'when user is logged in and ff are not loading and the toggle is disabled',
    () => {
      it('it should delete window.DD_RUM and window.DD_LOGS', () => {
        render(
          <Provider store={getStore(false)}>
            <TestComponent loggedIn />
          </Provider>,
        );

        expect(spy.notCalled).to.be.true;
        expect(window.DD_RUM).to.not.exist;
        expect(window.DD_LOGS).to.not.exist;
      });
    },
  );
});
