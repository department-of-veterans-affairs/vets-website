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
  const generateStore = () => ({
    dispatch: sinon.spy(),
    subscribe: sinon.spy(),
    getState: () => ({}),
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
      const store = {
        dispatch: sinon.spy(),
        subscribe: sinon.spy(),
        getState: () => ({}),
      };

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
    testActionLocation(undefined, 'modal'); // also test default
  });
});
