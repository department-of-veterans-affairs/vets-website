import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';

import { createStore } from 'redux';

import { expect } from 'chai';
import sinon from 'sinon';

import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';

import * as datadogInit from '../index';

describe('Datadog RUM & monitoring initialization', () => {
  // Copied from
  // src/platform/utilities/tests/feature-toggles/useFeatureToggle.unit.spec.jsx
  const testToggleKey = 'profileUseExperimental';
  const testToggleKeySnakeCase = 'profile_use_experimental';

  const settings = {
    applicationId: 'test-app-id',
    clientToken: 'test-client-token',
    service: 'test-service',
    version: '1.0.0',
  };

  const canInit = value => () => value;

  describe('initializeRealUserMonitoring', () => {
    let initSpy;
    let startSessionReplayRecordingStub;

    beforeEach(() => {
      initSpy = sinon.stub(datadogRum, 'init');
      startSessionReplayRecordingStub = sinon.stub(
        datadogRum,
        'startSessionReplayRecording',
      );
    });

    afterEach(() => {
      initSpy.restore();
      startSessionReplayRecordingStub.restore();
    });

    it('should call RUM init and startSessionReplayRecording', () => {
      datadogInit.initializeRealUserMonitoring(settings, canInit(true));
      expect(initSpy.calledOnce).to.be.true;
      expect(startSessionReplayRecordingStub.calledOnce).to.be.true;
    });

    it('should not call RUM init and startSessionReplayRecording', () => {
      datadogInit.initializeRealUserMonitoring(settings, canInit(false));
      expect(initSpy.notCalled).to.be.true;
      expect(startSessionReplayRecordingStub.notCalled).to.be.true;
    });
  });

  describe('initializeBrowserLogging', () => {
    let initSpy;

    beforeEach(() => {
      initSpy = sinon.stub(datadogLogs, 'init');
    });

    afterEach(() => {
      initSpy.restore();
    });

    it('should call logging init ', () => {
      datadogInit.initializeBrowserLogging(settings, canInit(true));
      expect(initSpy.calledOnce).to.be.true;
    });

    it('should not call logging init', () => {
      datadogInit.initializeBrowserLogging(settings, canInit(false));
      expect(initSpy.notCalled).to.be.true;
    });
  });

  describe('useBrowserMonitoring', () => {
    // eslint-disable-next-line react/prop-types
    const TestComponent = ({ options }) => {
      datadogInit.useBrowserMonitoring({
        toggleName: testToggleKey,
        ...options,
      });
      return <div data-testid="test" />;
    };

    const getStore = (flag = true, loading = false) =>
      createStore(() => ({
        featureToggles: {
          loading,
          // eslint-disable-next-line camelcase
          [testToggleKeySnakeCase]: flag,
        },
      }));

    let stubRum;
    let stubLog;
    let stubConsole;

    beforeEach(() => {
      stubRum = sinon.stub(datadogInit, 'initializeRealUserMonitoring');
      stubLog = sinon.stub(datadogInit, 'initializeBrowserLogging');
      stubConsole = sinon.stub(console, 'error');
      window.DD_RUM = { getInitConfiguration: () => {} };
      window.DD_LOGS = { getInitConfiguration: () => {} };
    });

    afterEach(() => {
      stubRum.restore();
      stubLog.restore();
      stubConsole.restore();
    });

    it('it should return when toggles are loading', () => {
      render(
        <Provider store={getStore(true, true)}>
          <TestComponent />
        </Provider>,
      );

      expect(stubConsole.notCalled).to.be.true;
      expect(stubRum.notCalled).to.be.true;
      expect(stubLog.notCalled).to.be.true;
      expect(window.DD_RUM).to.exist;
      expect(window.DD_LOGS).to.exist;
    });

    it('it should show an error in console when missing settings', () => {
      render(
        <Provider store={getStore()}>
          <TestComponent />
        </Provider>,
      );

      expect(stubConsole.called).to.be.true;
      expect(stubConsole.args[0][0]).to.equal(
        'Datadog RUM & monitoring initialization requires applicationId, clientToken, service, and version.',
      );
      expect(stubRum.notCalled).to.be.true;
      expect(stubLog.notCalled).to.be.true;
      expect(window.DD_RUM).to.exist;
      expect(window.DD_LOGS).to.exist;
    });

    it('it should return & remove Datadog when toggles are disabled', () => {
      render(
        <Provider store={getStore(false)}>
          <TestComponent options={settings} />
        </Provider>,
      );

      expect(stubConsole.notCalled).to.be.true;
      expect(stubRum.notCalled).to.be.true;
      expect(stubLog.notCalled).to.be.true;
      expect(window.DD_RUM).to.not.exist;
      expect(window.DD_LOGS).to.not.exist;
    });

    it('it should call initialize RUM & LOGS', () => {
      render(
        <Provider store={getStore()}>
          <TestComponent options={settings} />
        </Provider>,
      );

      expect(stubConsole.notCalled).to.be.true;
      waitFor(() => {
        expect(stubRum.called).to.be.true;
        expect(stubLog.called).to.be.true;
        expect(window.DD_RUM).to.exist;
        expect(window.DD_LOGS).to.exist;
      });
    });
  });
});
