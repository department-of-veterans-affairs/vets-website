import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import sinon from 'sinon';

import * as authUtilities from '../../../authentication/utilities';
import LoginActions from '../../../authentication/components/LoginActions';
import { CSP_IDS } from '../../../authentication/constants';

describe('LoginActions component', () => {
  const mockStore = configureStore([]);
  let store;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.spy(authUtilities, 'login');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('login buttons should properly call login method', () => {
    store = mockStore({});
    const wrapper = mount(
      <Provider store={store}>
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

  it('sets actionLocation correctly based on isUnifiedSignIn prop', () => {
    const testLocation = (isUnifiedSignIn, expected) => {
      store = mockStore({});
      const wrapper = mount(
        <Provider store={store}>
          <LoginActions
            externalApplication="vaoccmobile"
            isUnifiedSignIn={isUnifiedSignIn}
          />
        </Provider>,
      );
      wrapper.find('LoginButton').forEach(button => {
        expect(button.prop('actionLocation')).to.equal(expected);
      });
      wrapper.unmount();
    };

    testLocation(true, 'usip');
    testLocation(false, 'modal');
    testLocation(undefined, 'modal');
  });
});
