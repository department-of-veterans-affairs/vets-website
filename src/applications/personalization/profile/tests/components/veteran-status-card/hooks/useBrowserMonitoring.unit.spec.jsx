import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';
import ENVIRONMENT_CONFIGURATIONS from 'site/constants/environments-configs';
import { TOGGLE_NAMES } from '~/platform/utilities/feature-toggles';
import { useBrowserMonitoring } from '../../../../components/veteran-status-card/hooks/useBrowserMonitoring';

const mockStore = configureMockStore();

describe('useBrowserMonitoring hook', () => {
  const sandbox = sinon.createSandbox();
  let savedMocha;
  let envConfig;
  let originalBuildtype;

  const createStoreWithToggles = ({
    loading = false,
    toggleValue = false,
  } = {}) =>
    mockStore({
      featureToggles: {
        loading,
        [TOGGLE_NAMES.vetStatusPdfLogging]: toggleValue,
      },
    });

  const setEnvironment = buildtype => {
    envConfig.BUILDTYPE = buildtype;
  };

  // eslint-disable-next-line react/prop-types
  const wrapper = store => ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  beforeEach(() => {
    savedMocha = window.Mocha;
    delete window.Mocha;

    // The frozen environment export references a mutable config object via
    // closure. Mutating BUILDTYPE here controls environment.isStaging() and
    // environment.isProduction() without needing to stub the frozen export.
    envConfig = ENVIRONMENT_CONFIGURATIONS[global.__BUILDTYPE__];
    originalBuildtype = envConfig.BUILDTYPE;

    sandbox.stub(datadogRum, 'init');
    sandbox.stub(datadogRum, 'startSessionReplayRecording');
    sandbox.stub(datadogLogs, 'init');

    delete window.DD_RUM;
    delete window.DD_LOGS;
  });

  afterEach(() => {
    window.Mocha = savedMocha;
    envConfig.BUILDTYPE = originalBuildtype;
    sandbox.restore();
    delete window.DD_RUM;
    delete window.DD_LOGS;
  });

  it('does not initialize monitoring when feature flags are loading', () => {
    const store = createStoreWithToggles({ loading: true, toggleValue: true });
    setEnvironment('vagovstaging');

    renderHook(() => useBrowserMonitoring(), { wrapper: wrapper(store) });

    expect(datadogRum.init.called).to.be.false;
    expect(datadogLogs.init.called).to.be.false;
  });

  it('does not initialize monitoring when feature toggle is off', () => {
    const store = createStoreWithToggles({
      loading: false,
      toggleValue: false,
    });
    setEnvironment('vagovstaging');

    renderHook(() => useBrowserMonitoring(), { wrapper: wrapper(store) });

    expect(datadogRum.init.called).to.be.false;
    expect(datadogLogs.init.called).to.be.false;
  });

  it('does not initialize when environment is not staging or production', () => {
    const store = createStoreWithToggles({
      loading: false,
      toggleValue: true,
    });

    renderHook(() => useBrowserMonitoring(), { wrapper: wrapper(store) });

    expect(datadogRum.init.called).to.be.false;
    expect(datadogLogs.init.called).to.be.false;
  });

  it('does not initialize when window.Mocha exists', () => {
    window.Mocha = savedMocha;
    const store = createStoreWithToggles({
      loading: false,
      toggleValue: true,
    });
    setEnvironment('vagovstaging');

    renderHook(() => useBrowserMonitoring(), { wrapper: wrapper(store) });

    expect(datadogRum.init.called).to.be.false;
    expect(datadogLogs.init.called).to.be.false;
  });

  it('initializes Datadog monitoring in staging environment', () => {
    const store = createStoreWithToggles({
      loading: false,
      toggleValue: true,
    });
    setEnvironment('vagovstaging');

    renderHook(() => useBrowserMonitoring(), { wrapper: wrapper(store) });

    expect(datadogRum.init.calledOnce).to.be.true;
    expect(datadogLogs.init.calledOnce).to.be.true;
  });

  it('initializes Datadog monitoring in production environment', () => {
    const store = createStoreWithToggles({
      loading: false,
      toggleValue: true,
    });
    setEnvironment('vagovprod');

    renderHook(() => useBrowserMonitoring(), { wrapper: wrapper(store) });

    expect(datadogRum.init.calledOnce).to.be.true;
    expect(datadogLogs.init.calledOnce).to.be.true;
  });

  it('passes defaultPrivacyLevel mask to RUM init config', () => {
    const store = createStoreWithToggles({
      loading: false,
      toggleValue: true,
    });
    setEnvironment('vagovstaging');

    renderHook(() => useBrowserMonitoring(), { wrapper: wrapper(store) });

    const rumConfig = datadogRum.init.firstCall.args[0];
    expect(rumConfig.defaultPrivacyLevel).to.equal('mask');
  });

  it('passes forwardErrorsToLogs to browser logging init config', () => {
    const store = createStoreWithToggles({
      loading: false,
      toggleValue: true,
    });
    setEnvironment('vagovstaging');

    renderHook(() => useBrowserMonitoring(), { wrapper: wrapper(store) });

    const logsConfig = datadogLogs.init.firstCall.args[0];
    expect(logsConfig.forwardErrorsToLogs).to.be.true;
  });

  it('passes shared config properties to RUM and logs init', () => {
    const store = createStoreWithToggles({
      loading: false,
      toggleValue: true,
    });
    setEnvironment('vagovstaging');

    renderHook(() => useBrowserMonitoring(), { wrapper: wrapper(store) });

    const rumConfig = datadogRum.init.firstCall.args[0];
    const logsConfig = datadogLogs.init.firstCall.args[0];

    expect(rumConfig.applicationId).to.equal(
      '95b5b8e2-3897-4aad-84f0-fdf538722529',
    );
    expect(rumConfig.clientToken).to.equal(
      'pubf685942b0ca36a596c8d0bd1d76c2715',
    );
    expect(rumConfig.site).to.equal('ddog-gov.com');
    expect(rumConfig.service).to.equal('veteran-status-card');

    expect(logsConfig.applicationId).to.equal(
      '95b5b8e2-3897-4aad-84f0-fdf538722529',
    );
    expect(logsConfig.clientToken).to.equal(
      'pubf685942b0ca36a596c8d0bd1d76c2715',
    );
    expect(logsConfig.site).to.equal('ddog-gov.com');
    expect(logsConfig.service).to.equal('veteran-status-card');
  });

  it('calls startSessionReplayRecording after RUM init', () => {
    const store = createStoreWithToggles({
      loading: false,
      toggleValue: true,
    });
    setEnvironment('vagovstaging');

    renderHook(() => useBrowserMonitoring(), { wrapper: wrapper(store) });

    expect(datadogRum.startSessionReplayRecording.calledOnce).to.be.true;
    expect(datadogRum.init.calledBefore(datadogRum.startSessionReplayRecording))
      .to.be.true;
  });

  it('skips RUM init when DD_RUM is already configured', () => {
    window.DD_RUM = { getInitConfiguration: () => ({}) };
    const store = createStoreWithToggles({
      loading: false,
      toggleValue: true,
    });
    setEnvironment('vagovstaging');

    renderHook(() => useBrowserMonitoring(), { wrapper: wrapper(store) });

    expect(datadogRum.init.called).to.be.false;
    expect(datadogRum.startSessionReplayRecording.called).to.be.false;
  });

  it('skips browser logging init when DD_LOGS is already configured', () => {
    window.DD_LOGS = { getInitConfiguration: () => ({}) };
    const store = createStoreWithToggles({
      loading: false,
      toggleValue: true,
    });
    setEnvironment('vagovstaging');

    renderHook(() => useBrowserMonitoring(), { wrapper: wrapper(store) });

    expect(datadogLogs.init.called).to.be.false;
    expect(datadogRum.init.calledOnce).to.be.true;
  });

  it('deletes window.DD_RUM when monitoring is disabled', () => {
    window.DD_RUM = { getInitConfiguration: () => null };
    const store = createStoreWithToggles({
      loading: false,
      toggleValue: false,
    });

    renderHook(() => useBrowserMonitoring(), { wrapper: wrapper(store) });

    expect(window.DD_RUM).to.be.undefined;
  });

  it('initializes browser logging before RUM', () => {
    const store = createStoreWithToggles({
      loading: false,
      toggleValue: true,
    });
    setEnvironment('vagovprod');

    renderHook(() => useBrowserMonitoring(), { wrapper: wrapper(store) });

    expect(datadogLogs.init.calledBefore(datadogRum.init)).to.be.true;
  });
});
