import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';

import * as authUtilities from '../../../authentication/utilities';
import LoginActions from '../../../authentication/components/LoginActions';
import { CSP_IDS } from '../../../authentication/constants';

describe('login DOM ', () => {
  const sandbox = sinon.createSandbox();
  const generateStore = ({ featureToggles = {} } = {}) => ({
    dispatch: sinon.spy(),
    subscribe: sinon.spy(),
    getState: () => ({ featureToggles }),
  });
  const mockStore = generateStore();

  beforeEach(() => {
    sandbox.spy(authUtilities, 'login');
  });

  afterEach(() => {
    sandbox.restore();
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
        mhv: { policy: CSP_IDS.MHV },
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

  it(`should render 3 buttons when flipper is enabled`, () => {
    global.window.location = new URL(
      'https://dev.va.gov/sign-in/?application=vaoccmobile',
    );
    const store = generateStore({
      featureToggles: { mhvCredentialButtonDisabled: true },
    });
    const loginButtons = mount(
      <Provider store={store}>
        <LoginActions externalApplication="vaoccmobile" isUnifiedSignIn />
      </Provider>,
    );
    expect(loginButtons.find('button').length).to.eql(3);
    loginButtons.unmount();
  });

  it(`should render 4 buttons when flipper is false`, () => {
    global.window.location = new URL(
      'https://dev.va.gov/sign-in/?application=mhv',
    );
    const store = generateStore({
      featureToggles: { mhvCredentialButtonDisabled: false },
    });
    const loginButtons = mount(
      <Provider store={store}>
        <LoginActions externalApplication="mhv" />
      </Provider>,
    );
    expect(loginButtons.find('button').length).to.eql(4);
    loginButtons.unmount();
  });

  it(`should use fallback when featureToggles not found`, () => {
    global.window.location = new URL(
      'https://dev.va.gov/sign-in/?application=mhv',
    );
    const store = generateStore({ featureToggles: {} });
    const loginButtons = mount(
      <Provider store={store}>
        <LoginActions externalApplication="mhv" />
      </Provider>,
    );
    expect(loginButtons.find('button').length).to.eql(4);
    loginButtons.unmount();
  });
});
