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
    const loginButtons = mount(
      <Provider store={mockStore}>
        <LoginActions />
      </Provider>,
    );

    const testButton = button => {
      const loginCSP = button.prop('data-csp');

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
    };

    loginButtons.find('button').forEach(testButton);
    loginButtons.unmount();
  });

  it('sets actionLocation to "usip" when isUnifiedSignIn is true and "modal" otherwise', () => {
    const testActionLocation = (isUnifiedSignIn, expectedLocation) => {
      const store = generateStore();

      global.window.location = new URL(
        'https://dev.va.gov/sign-in/?application=vaoccmobile&OAuth=true',
      );

      const wrapper = mount(
        <Provider store={store}>
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

  // TODO: Fix this test — feature flag not being re-evaluated in time
  // Causes DS Logon button to render even when flag is disabled
  // Consider moving flag logic to useEffect with state
  /*
  it('renders DS Logon button only if feature flag is enabled and dslogon config is true', () => {
    ...
  });
  */

  it('renders My HealtheVet content only when DS Logon is available (feature flag ON & dslogon true)', () => {
    const configWithDslogon = {
      OAuthEnabled: false,
      allowedSignInProviders: ['dslogon'],
      legacySignInProviders: { dslogon: true },
    };

    const originalConfig =
      require.cache[require.resolve('../../../authentication/usip-config')];
    require.cache[require.resolve('../../../authentication/usip-config')] = {
      exports: {
        externalApplicationsConfig: {
          mhvTestApp: configWithDslogon,
          default: configWithDslogon,
        },
      },
    };

    setDslogonFeatureFlag(true);

    const wrapper = mount(
      <Provider store={mockStore}>
        <LoginActions externalApplication="mhvTestApp" />
      </Provider>,
    );

    expect(wrapper.text()).to.contain('My HealtheVet sign-in option');
    wrapper.unmount();

    if (originalConfig) {
      require.cache[
        require.resolve('../../../authentication/usip-config')
      ] = originalConfig;
    }
  });

  it('does not render My HealtheVet content when DS Logon is disabled (feature flag OFF)', () => {
    const configWithDslogon = {
      OAuthEnabled: false,
      allowedSignInProviders: ['dslogon'],
      legacySignInProviders: { dslogon: true },
    };

    const originalConfig =
      require.cache[require.resolve('../../../authentication/usip-config')];
    require.cache[require.resolve('../../../authentication/usip-config')] = {
      exports: {
        externalApplicationsConfig: {
          mhvTestApp: configWithDslogon,
          default: configWithDslogon,
        },
      },
    };

    setDslogonFeatureFlag(false);

    const wrapper = mount(
      <Provider store={mockStore}>
        <LoginActions externalApplication="mhvTestApp" />
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
});
