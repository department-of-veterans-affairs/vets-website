import { expect } from 'chai';
import sinon from 'sinon';

import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { datadogRum } from '@datadog/browser-rum';
import { render } from '@testing-library/react';
import * as constants from '../../constants';
import * as useBrowserMonitoring from '../../utils/datadog-rum/useBrowserMonitoring';
import * as initializeRealUserMonitoring from '../../utils/datadog-rum/initializeRealUserMonitoring';

// eslint-disable-next-line react/prop-types
const TestComponent = ({ loggedIn = false }) => {
  useBrowserMonitoring.useBrowserMonitoring({ loggedIn });
  return <div data-testid="test" />;
};

describe('initializeRealUserMonitoring', () => {
  let envStub;
  let initSpy;
  let startSessionReplayRecordingStub;

  beforeEach(() => {
    envStub = sinon.stub(constants, 'isProductionEnv');
    initSpy = sinon.spy(datadogRum, 'init');
    startSessionReplayRecordingStub = sinon.stub(
      datadogRum,
      'startSessionReplayRecording',
    );
  });

  afterEach(() => {
    envStub.restore();
    initSpy.restore();
    startSessionReplayRecordingStub.restore();
  });

  context('when isProductionEnv is true', () => {
    it('should call init and startSessionReplayRecording ', () => {
      envStub.returns(true);
      initializeRealUserMonitoring.initializeRealUserMonitoring();
      expect(initSpy.called).to.be.true;

      expect(initSpy.calledOnce).to.be.true;
      expect(startSessionReplayRecordingStub.calledOnce).to.be.true;
    });
  });
  context('when isProductionEnv is false', () => {
    it('should not call init and startSessionReplayRecording ', () => {
      envStub.returns(false);
      initializeRealUserMonitoring.initializeRealUserMonitoring();
      expect(initSpy.notCalled).to.be.true;
      expect(startSessionReplayRecordingStub.notCalled).to.be.true;
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

  let stub;

  beforeEach(() => {
    stub = sinon.stub(
      initializeRealUserMonitoring,
      'initializeRealUserMonitoring',
    );
    window.DD_RUM = { getInitConfiguration: () => {} };
    window.DD_LOGS = { getInitConfiguration: () => {} };
  });

  afterEach(() => {
    stub.restore();
  });
  context('when loggedIn false', () => {
    it('it should return', () => {
      render(
        <Provider store={getStore()}>
          <TestComponent />
        </Provider>,
      );

      expect(stub.notCalled).to.be.true;
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

      expect(stub.notCalled).to.be.true;
      expect(window.DD_RUM).to.exist;
      expect(window.DD_LOGS).to.exist;
    });
  });
  context(
    'when user is logged in and ff are not loading and the toggle is enabled',
    () => {
      it('it should call initializeRealUserMonitoring', () => {
        render(
          <Provider store={getStore()}>
            <TestComponent loggedIn />
          </Provider>,
        );
        expect(stub.called).to.be.true;
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

        expect(stub.notCalled).to.be.true;
        expect(window.DD_RUM).to.not.exist;
        expect(window.DD_LOGS).to.not.exist;
      });
    },
  );
});
