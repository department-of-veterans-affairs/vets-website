import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import * as DatadogModule from 'platform/monitoring/Datadog';
import AppConfig from '../containers/AppConfig';

describe('AppConfig', () => {
  let useBrowserMonitoringStub;
  const mockProfile = {
    accountUuid: '123-456-789',
    facilities: [
      { name: 'FACILITY 1', isCerner: true },
      { name: 'FACILITY 2', isCerner: false },
    ],
    signIn: { service: 'idme' },
    loa: { current: 3 },
    isVAPatient: true,
  };

  beforeEach(() => {
    useBrowserMonitoringStub = sinon.stub(
      DatadogModule,
      'useBrowserMonitoring',
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it('initializes Datadog RUM when rendered', () => {
    renderInReduxProvider(
      <AppConfig>
        <div>Test Content</div>
      </AppConfig>,
      {
        initialState: {
          user: {
            profile: {},
          },
        },
      },
    );

    expect(useBrowserMonitoringStub.calledOnce).to.be.true;
    const config = useBrowserMonitoringStub.firstCall.args[0];
    expect(config).to.have.property(
      'toggleName',
      'termsOfUseBrowserMonitoringEnabled',
    );
    expect(config).to.have.property('service', 'terms-of-use-on-va.gov');
    expect(config).to.have.property('trackUserInteractions', true);
    expect(config).to.have.property('version', '1.0.0');
  });

  it('passes a callback to set user attributes in onRumInit', () => {
    renderInReduxProvider(
      <AppConfig>
        <div>Test Content</div>
      </AppConfig>,
      {
        initialState: {
          user: {
            profile: mockProfile,
          },
        },
      },
    );

    expect(useBrowserMonitoringStub.calledOnce).to.be.true;
    const config = useBrowserMonitoringStub.firstCall.args[0];
    expect(config)
      .to.have.property('onRumInit')
      .that.is.a('function');

    // Call the onRumInit function with a mock datadogRum
    const mockDatadogRum = {
      setUser: sinon.spy(),
    };
    config.onRumInit(mockDatadogRum);

    // Verify user attributes are set correctly
    expect(mockDatadogRum.setUser.calledOnce).to.be.true;
    const userAttrs = mockDatadogRum.setUser.firstCall.args[0];
    expect(userAttrs).to.have.property('id', '123-456-789');
    expect(userAttrs).to.have.property('hasEHRM', true);
    expect(userAttrs).to.have.property('hasVista', true);
    expect(userAttrs).to.have.property('CSP', 'idme');
    expect(userAttrs).to.have.property('LOA', 3);
    expect(userAttrs).to.have.property('isVAPatient', true);
  });

  it('renders its children', () => {
    const { getByText } = renderInReduxProvider(
      <AppConfig>
        <div>Test Child Content</div>
      </AppConfig>,
    );

    expect(getByText('Test Child Content')).to.exist;
  });
});
