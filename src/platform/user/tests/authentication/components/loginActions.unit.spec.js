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

  it('shows MHV and DSL buttons as links when feature flag is turned on', () => {
    const flipperOnMockStore = {
      getState: () => ({
        featureToggles: {
          // eslint-disable-next-line camelcase
          sign_in_page_and_modal_experiment_lga: true,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    const wrapper = mount(
      <Provider store={flipperOnMockStore}>
        <LoginActions />
      </Provider>,
    );

    expect(wrapper.find('Sign in with DS Logon')).to.exist;
    expect(wrapper.find('Sign in with My HealtheVet')).to.exist;
    expect(wrapper.find('button').length).to.eql(2);
    expect(wrapper.find('a').length).to.eql(4);
    wrapper.unmount();
  });

  it('does not show MHV and DSL buttons as links when feature flag is turned off', () => {
    const flipperOffMockStore = {
      getState: () => ({
        featureToggles: {
          // eslint-disable-next-line camelcase
          sign_in_page_and_modal_experiment_lga: false,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    const wrapper = mount(
      <Provider store={flipperOffMockStore}>
        <LoginActions />
      </Provider>,
    );

    expect(wrapper.find('Sign in with DS Logon')).to.not.false;
    expect(wrapper.find('Sign in with My HealtheVet')).to.not.false;
    expect(wrapper.find('button').length).to.eql(4);
    expect(wrapper.find('a').length).to.eql(2);
    wrapper.unmount();
  });

  it('does not show DSL/MHV button to link changes for any other USiP other than VA.Gov', () => {
    const externalApplications = [
      'vaoccmobile',
      'myvahealth',
      'ebenefits',
      'vamobile',
      'mhv',
    ];
    externalApplications.forEach(csp => {
      it('does not show modal', () => {
        const wrapper = mount(
          <Provider store={mockStore}>
            <LoginActions externalApplication={csp} />
          </Provider>,
        );
        expect(wrapper.find('Sign in with DS Logon')).to.not.false;
        expect(wrapper.find('Sign in with My HealtheVet')).to.not.false;
        expect(wrapper.find('button').length).to.eql(4);
        expect(wrapper.find('a').length).to.eql(2);
        wrapper.unmount();
      });
    });
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
