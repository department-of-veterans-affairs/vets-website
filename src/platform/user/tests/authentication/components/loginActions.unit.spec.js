import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import * as authUtilities from '../../../authentication/utilities';
import LoginActions from '../../../authentication/components/LoginActions';
import { CSP_IDS } from '../../../authentication/constants';

describe('login DOM ', () => {
  const sandbox = sinon.createSandbox();
  const mockStore = {
    getState: () => ({
      featureToggles: {
        // eslint-disable-next-line camelcase
        sign_in_page_and_modal_experiment_lga: false,
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  beforeEach(function() {
    sandbox.spy(authUtilities, 'login');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('does not show modal text when feature flag is turned off', () => {
    const flipperOffMockStore = ({ signInPageModalEnabled = false } = {}) => ({
      featureToggles: {
        // eslint-disable-next-line camelcase
        sign_in_page_and_modal_experiment_lga: signInPageModalEnabled,
      },
    });

    const wrapper = renderInReduxProvider(<LoginActions />, {
      initialState: flipperOffMockStore(),
    });
    expect(wrapper.queryByText(/Sign in with your Login.gov or ID.me account/i))
      .to.be.null;
  });

  it('shows modal text when feature flag is turned on', () => {
    const flipperOnMockStore = ({ signInPageModalEnabled = true } = {}) => ({
      featureToggles: {
        // eslint-disable-next-line camelcase
        sign_in_page_and_modal_experiment_lga: signInPageModalEnabled,
      },
    });

    const wrapper = renderInReduxProvider(<LoginActions />, {
      initialState: flipperOnMockStore(),
    });
    expect(wrapper.getByText(/Sign in with your Login.gov or ID.me account/)).to
      .not.be.null;
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

  ['vaoccmobile'].forEach(csp => {
    it(`should render only DS Logon button when 'externalApplication=${csp}' and 'redirect_uri' is 'AHBurnPitRegistry'`, () => {
      global.window.location = new URL(
        'https://dev.va.gov/sign-in/?application=vaoccmobile&redirect_uri=AHBurnPitRegistry&oauth=false',
      );
      const loginButtons = mount(
        <Provider store={mockStore}>
          <LoginActions externalApplication={csp} />
        </Provider>,
      );
      expect(loginButtons.find('[data-csp="dslogon"]').exists()).to.be.true;
      expect(loginButtons.find('#create-account').exists()).to.be.false;
      loginButtons.unmount();
    });
    it(`should render all buttons when 'externalApplication=${csp}' and 'redirect_uri' is NOT present`, () => {
      global.window.location = new URL(
        'https://dev.va.gov/sign-in/?application=vaoccmobile',
      );
      const loginButtons = mount(
        <Provider store={mockStore}>
          <LoginActions externalApplication={csp} />
        </Provider>,
      );
      expect(loginButtons.find('button').length).to.eql(4);
      expect(loginButtons.find('#create-account').exists()).to.be.true;
      expect(loginButtons.find('a').length).to.eql(2);
      loginButtons.unmount();
    });
  });
});
