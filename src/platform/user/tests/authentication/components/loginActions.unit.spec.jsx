import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';

import * as authUtilities from '../../../authentication/utilities';
import LoginActions from '../../../authentication/components/LoginActions';
import { CSP_IDS } from '../../../authentication/constants';

function setDslogonFeatureFlag(value) {
  if (!window.VetsGov) window.VetsGov = {};
  if (!window.VetsGov.featureToggles) window.VetsGov.featureToggles = {};
  window.VetsGov.featureToggles.dslogonEnabled = value;
}

describe('login DOM', () => {
  const sandbox = sinon.createSandbox();
  const generateStore = () => ({
    dispatch: sinon.spy(),
    subscribe: sinon.spy(),
    getState: () => ({}),
  });
  const mockStore = generateStore();

  beforeEach(() => {
    sandbox.spy(authUtilities, 'login');
    setDslogonFeatureFlag(true);
  });

  afterEach(() => {
    sandbox.restore();
    setDslogonFeatureFlag(undefined);
  });

  it('login buttons should properly call login method', () => {
    const wrapper = mount(
      <Provider store={mockStore}>
        <LoginActions />
      </Provider>,
    );

    wrapper.find('button').forEach(button => {
      const loginCSP = button.prop('data-csp');
      if (!loginCSP) return;

      const expectedArgs = {
        idme: { policy: CSP_IDS.ID_ME },
        logingov: { policy: CSP_IDS.LOGIN_GOV },
        dslogon: { policy: CSP_IDS.DS_LOGON },
      };

      button.simulate('click');

      expect(authUtilities.login.calledOnce).to.be.true;
      expect(authUtilities.login.getCall(0).args[0]).to.deep.equal(
        expectedArgs[loginCSP],
      );

      sandbox.reset();
    });

    wrapper.unmount();
  });

  it('sets actionLocation to "usip" when isUnifiedSignIn is true and "modal" otherwise', () => {
    const testActionLocation = (isUnifiedSignIn, expectedLocation) => {
      global.window.location = new URL(
        'https://dev.va.gov/sign-in/?application=vaoccmobile&OAuth=true',
      );

      const wrapper = mount(
        <Provider store={mockStore}>
          <LoginActions
            externalApplication="vaoccmobile"
            isUnifiedSignIn={isUnifiedSignIn}
          />
        </Provider>,
      );

      wrapper.find('LoginButton').forEach(button => {
        expect(button.prop('actionLocation')).to.equal(expectedLocation);
      });

      wrapper.unmount();
    };

    testActionLocation(true, 'usip');
    testActionLocation(false, 'modal');
    testActionLocation(undefined, 'modal');
  });

  // TODO: Fix this test — feature flag not re-evaluating in time
  /*
  it('renders DS Logon button only if feature flag is enabled and dslogon config is true', () => {
    ...
  });
  */

  it('renders My HealtheVet retired notice only when DS Logon is enabled', () => {
    const config = {
      OAuthEnabled: false,
      allowedSignInProviders: [],
      legacySignInProviders: { dslogon: true },
    };

    const originalConfig =
      require.cache[require.resolve('../../../authentication/usip-config')];
    require.cache[require.resolve('../../../authentication/usip-config')] = {
      exports: {
        externalApplicationsConfig: {
          mhvApp: config,
          default: config,
        },
      },
    };

    // With feature flag ON, My HealtheVet retired notice should appear
    setDslogonFeatureFlag(true);
    let wrapper = mount(
      <Provider store={mockStore}>
        <LoginActions externalApplication="mhvApp" />
      </Provider>,
    );
    expect(wrapper.text()).to.contain('My HealtheVet sign-in option');
    wrapper.unmount();

    // With feature flag OFF, My HealtheVet retired notice should NOT appear
    setDslogonFeatureFlag(false);
    wrapper = mount(
      <Provider store={mockStore}>
        <LoginActions externalApplication="mhvApp" />
      </Provider>,
    );
    expect(wrapper.text()).to.not.contain('My HealtheVet sign-in option');
    wrapper.unmount();

    if (originalConfig) {
      require.cache[
        require.resolve('../../../authentication/usip-config')
      ] = originalConfig;
    }
  });

  it('renders DS Logon retired notice only when DS Logon is present and flag is OFF', () => {
    const config = {
      OAuthEnabled: false,
      allowedSignInProviders: [],
      legacySignInProviders: { dslogon: true },
    };

    const originalConfig =
      require.cache[require.resolve('../../../authentication/usip-config')];
    require.cache[require.resolve('../../../authentication/usip-config')] = {
      exports: {
        externalApplicationsConfig: {
          dslogonApp: config,
          default: config,
        },
      },
    };

    setDslogonFeatureFlag(false);

    const wrapper = mount(
      <Provider store={mockStore}>
        <LoginActions externalApplication="dslogonApp" />
      </Provider>,
    );

    expect(wrapper.text()).to.contain('DS Logon sign-in option');
    expect(wrapper.text()).to.contain('This option is no longer available');

    wrapper.unmount();

    if (originalConfig) {
      require.cache[
        require.resolve('../../../authentication/usip-config')
      ] = originalConfig;
    }
  });
});
