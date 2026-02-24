import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { datadogRum } from '@datadog/browser-rum';
import ENVIRONMENT_CONFIGURATIONS from 'site/constants/environments-configs';
import { TOGGLE_NAMES } from '~/platform/utilities/feature-toggles';
import {
  useBrowserMonitoring,
  initializeBrowserMonitoring,
} from '../../hooks/useBrowserMonitoring';

const mockStore = configureMockStore();
const wrapper = store => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return Wrapper;
};

describe('dashboard useBrowserMonitoring hook', () => {
  const sandbox = sinon.createSandbox();
  let envConfig;
  let originalBuildtype;

  const createStoreWithToggles = ({
    loading = false,
    toggleValue = false,
  } = {}) =>
    mockStore({
      featureToggles: {
        loading,
        [TOGGLE_NAMES.myVaBrowserMonitoring]: toggleValue,
      },
    });

  const setEnvironment = buildtype => {
    envConfig.BUILDTYPE = buildtype;
  };

  beforeEach(() => {
    envConfig = ENVIRONMENT_CONFIGURATIONS[global.__BUILDTYPE__];
    originalBuildtype = envConfig.BUILDTYPE;

    sandbox.stub(datadogRum, 'init');
    sandbox.stub(datadogRum, 'startSessionReplayRecording');
    sandbox.stub(datadogRum, 'stopSession');

    delete window.DD_RUM;
  });

  afterEach(() => {
    envConfig.BUILDTYPE = originalBuildtype;
    sandbox.restore();
    delete window.DD_RUM;
  });

  describe('initializeBrowserMonitoring', () => {
    it('returns false on localhost', () => {
      setEnvironment('localhost');

      const result = initializeBrowserMonitoring();
      expect(result).to.be.false;
      expect(datadogRum.init.called).to.be.false;
    });

    it('initializes RUM in a non-localhost environment', () => {
      setEnvironment('vagovstaging');

      const result = initializeBrowserMonitoring();

      expect(result).to.be.true;
      expect(datadogRum.init.calledOnce).to.be.true;
    });

    it('stops and deletes existing DD_RUM before re-initializing', () => {
      setEnvironment('vagovstaging');
      window.DD_RUM = { getInitConfiguration: () => ({}) };

      initializeBrowserMonitoring();

      expect(datadogRum.stopSession.calledOnce).to.be.true;
      expect(datadogRum.init.calledOnce).to.be.true;
    });

    it('does not stop session when DD_RUM has no prior config', () => {
      setEnvironment('vagovstaging');

      initializeBrowserMonitoring();

      expect(datadogRum.stopSession.called).to.be.false;
      expect(datadogRum.init.calledOnce).to.be.true;
    });

    it('calls startSessionReplayRecording after init', () => {
      setEnvironment('vagovstaging');

      initializeBrowserMonitoring();

      expect(datadogRum.startSessionReplayRecording.calledOnce).to.be.true;
      expect(
        datadogRum.init.calledBefore(datadogRum.startSessionReplayRecording),
      ).to.be.true;
    });

    it('passes expected config properties to RUM init', () => {
      setEnvironment('vagovstaging');

      initializeBrowserMonitoring();

      const rumConfig = datadogRum.init.firstCall.args[0];
      expect(rumConfig.applicationId).to.equal(
        '7909bc8f-3e73-43b4-b01c-e0de92ccbe85',
      );
      expect(rumConfig.clientToken).to.equal(
        'pub1e95c062768737937070fea457e175e2',
      );
      expect(rumConfig.site).to.equal('ddog-gov.com');
      expect(rumConfig.service).to.equal('my-va');
      expect(rumConfig.defaultPrivacyLevel).to.equal('mask-user-input');
      expect(rumConfig.trackBfcacheViews).to.be.true;
      expect(rumConfig.trackUserInteractions).to.be.true;
    });
  });

  describe('useBrowserMonitoring', () => {
    it('does not initialize when feature toggle is off', () => {
      const store = createStoreWithToggles({
        loading: false,
        toggleValue: false,
      });
      setEnvironment('vagovstaging');

      renderHook(() => useBrowserMonitoring(), { wrapper: wrapper(store) });

      expect(datadogRum.init.called).to.be.false;
    });

    it('initializes monitoring when feature toggle is on', () => {
      const store = createStoreWithToggles({
        loading: false,
        toggleValue: true,
      });
      setEnvironment('vagovstaging');

      renderHook(() => useBrowserMonitoring(), { wrapper: wrapper(store) });

      expect(datadogRum.init.calledOnce).to.be.true;
    });

    it('does not initialize on localhost even when toggle is on', () => {
      const store = createStoreWithToggles({
        loading: false,
        toggleValue: true,
      });
      setEnvironment('localhost');

      renderHook(() => useBrowserMonitoring(), { wrapper: wrapper(store) });

      expect(datadogRum.init.called).to.be.false;
    });

    it('cleans up DD_RUM on unmount when initialized by this hook', () => {
      const store = createStoreWithToggles({
        loading: false,
        toggleValue: true,
      });
      setEnvironment('vagovstaging');

      const { unmount } = renderHook(() => useBrowserMonitoring(), {
        wrapper: wrapper(store),
      });

      // Simulate DD_RUM being available after init (the real SDK sets this
      // on window but our stub does not, so set it before unmount).
      window.DD_RUM = { getInitConfiguration: () => ({}) };

      unmount();

      expect(datadogRum.stopSession.called).to.be.true;
      expect(window.DD_RUM).to.be.undefined;
    });

    it('does not clean up DD_RUM on unmount when not initialized by this hook', () => {
      const store = createStoreWithToggles({
        loading: false,
        toggleValue: false,
      });
      setEnvironment('vagovstaging');
      window.DD_RUM = { getInitConfiguration: () => ({}) };

      const { unmount } = renderHook(() => useBrowserMonitoring(), {
        wrapper: wrapper(store),
      });

      unmount();

      // DD_RUM should still exist because this hook did not initialize it
      expect(window.DD_RUM).to.not.be.undefined;
    });
  });
});
