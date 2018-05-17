import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { merge, set } from 'lodash/fp';
import sinon from 'sinon';

import { MHVApp } from '../../../authorization/containers/MHVApp';

describe('<MHVApp>', () => {
  const props = {
    location: { pathname: '/health-care/prescriptions', query: {} },
    account: {
      errors: null,
      loading: false,
      polling: false,
      polledTimes: 0,
      state: null
    },
    availableServices: ['facilities', 'hca', 'user-profile'],
    serviceRequired: 'rx',
    createMHVAccount: sinon.spy(),
    fetchMHVAccount: sinon.spy()
  };

  const setup = () => {
    global.window.location.replace = sinon.spy();
    props.createMHVAccount.reset();
    props.fetchMHVAccount.reset();
  };

  const expectAlert = (wrapper, expectedStatus, expectedHeadline) => {
    const alertBox = wrapper.find('AlertBox');
    const headlineProp = alertBox.prop('headline');
    const headlineText = typeof headlineProp === 'string' ? headlineProp : shallow(headlineProp).text();
    expect(alertBox.prop('status')).to.eq(expectedStatus);
    expect(headlineText).to.eq(expectedHeadline);
  };

  beforeEach(setup);

  it('should show a loading indicator when fetching an account', () => {
    const newProps = set('account.loading', true, props);
    const wrapper = shallow(<MHVApp {...newProps}/>);
    expect(wrapper.find('LoadingIndicator').exists()).to.be.true;
  });

  it('should show a loading indicator when polling and override generic loading', () => {
    const newProps = merge(props, {
      account: { loading: true, polling: true }
    });
    const wrapper = shallow(<MHVApp {...newProps}/>);
    const loadingIndicator = wrapper.find('LoadingIndicator').dive();
    expect(loadingIndicator.text()).to.equal('Creating your MHV account...');
  });


  it('should create an account if the user does not have an account but is eligible', () => {
    const wrapper = shallow(<MHVApp {...props}/>);
    const account = set('state', 'no_account', props.account);
    wrapper.setProps({ account });
    expect(props.createMHVAccount.calledOnce).to.be.true;
  });

  it('should redirect if the user needs to accepts T&C', () => {
    const wrapper = shallow(<MHVApp {...props}/>);
    const account = set('state', 'needs_terms_acceptance', props.account);
    wrapper.setProps({ account });
    expect(global.window.location.replace.calledOnce).to.be.true;
  });

  it('should show a success message after the user accepts T&C and gets upgraded', () => {
    const newProps = merge(props, {
      account: { ...props.account, state: 'upgraded' },
      location: { ...props.location, query: { tc_accepted: true } }, // eslint-disable-line camelcase
      availableServices: ['rx']
    });
    const wrapper = shallow(<MHVApp {...newProps}/>);
    expectAlert(wrapper, 'success', 'Thank you for accepting the Terms and Conditions for using Vets.gov health tools');
  });

  it('should poll for account state while account is being created', () => {
    const clock = sinon.useFakeTimers();
    const wrapper = shallow(<MHVApp {...props}/>);
    props.fetchMHVAccount.reset();

    const initialAccount = set('state', 'no_account', props.account);
    wrapper.setProps({ account: initialAccount });

    const pollingAccount = set('polling', true, initialAccount);
    wrapper.setProps({ account: pollingAccount });
    expect(wrapper.find('LoadingIndicator').exists()).to.be.true;

    wrapper.setProps({ account: set('polledTimes', 1, pollingAccount) });
    clock.tick(1000);
    wrapper.setProps({ account: set('polledTimes', 2, pollingAccount) });
    clock.tick(2000);
    expect(props.fetchMHVAccount.calledThrice).to.be.true;

    const upgradedAccount = {
      ...props.account,
      polling: false,
      polledTimes: 0,
      state: 'upgraded'
    };

    wrapper.setProps({ account: upgradedAccount });
    expect(props.fetchMHVAccount.calledOnce).to.be.false;
    clock.restore();
  });

  it('should show MHV access error if nothing is loading or processing', () => {
    const wrapper = shallow(<MHVApp {...props}/>);
    expect(wrapper.find('#mhv-access-error').exists()).to.be.true;
  });

  it('should show MHV access error if user has an account but not the required service', () => {
    const newProps = set('account.state', 'existing', props);
    const wrapper = shallow(<MHVApp {...newProps}/>);
    expect(wrapper.find('#mhv-access-error').exists()).to.be.true;
  });

  it('should render children if user has the required service', () => {
    const newProps = merge(props, {
      account: { state: 'existing' },
      availableServices: ['rx']
    });
    const wrapper = shallow(<MHVApp {...newProps}><div id="test"/></MHVApp>);
    expect(wrapper.find('#test').exists()).to.be.true;
  });

  it('should show placeholder account error', () => {
    const errors = [
      {
        title: 'Account error',
        detail: 'There was a problem with your account',
        code: '500',
        status: '500'
      }
    ];

    const newProps = set('account.errors', errors, props);
    const wrapper = shallow(<MHVApp {...newProps}/>);
    expectAlert(wrapper, 'error', 'We’re not able to process your My HealtheVet account');
  });

  it('should fetch account again if encountered an error', () => {
    const newProps = set('account.state', 'no_account', props);
    const wrapper = shallow(<MHVApp {...newProps}/>);
    props.fetchMHVAccount.reset();

    const errors = [
      {
        title: 'Account error',
        detail: 'There was a problem with your account',
        code: '500',
        status: '500'
      }
    ];

    const account = set('errors', errors, props.account);
    wrapper.setProps({ account });
    expect(props.fetchMHVAccount.calledOnce).to.be.true;
  });

  it('should show error if unable to determine MHV account level', () => {
    const newProps = set('account.level', 'Unknown', props);
    const wrapper = shallow(<MHVApp {...newProps}/>);
    expectAlert(wrapper, 'error', 'We can’t confirm your My HealtheVet account level');
  });

  it('should show error if failed to register MHV account', () => {
    const newProps = set('account.state', 'register_failed', props);
    const wrapper = shallow(<MHVApp {...newProps}/>);
    expectAlert(wrapper, 'error', 'We can’t create your premium My HealtheVet account right now');
  });

  it('should show error if failed to upgrade MHV account', () => {
    const newProps = set('account.state', 'upgrade_failed', props);
    const wrapper = shallow(<MHVApp {...newProps}/>);
    expectAlert(wrapper, 'error', 'We can’t upgrade your My HealtheVet account to premium');
  });

  it('should show error if the user has mismatched SSNs', () => {
    const newProps = set('account.state', 'needs_ssn_resolution', props);
    const wrapper = shallow(<MHVApp {...newProps}/>);
    expectAlert(wrapper, 'error', 'We can’t give you access to the Vets.gov health tools');
  });

  it('should show error if the user is not a VA patient', () => {
    const newProps = set('account.state', 'needs_va_patient', props);
    const wrapper = shallow(<MHVApp {...newProps}/>);
    expectAlert(wrapper, 'error', 'We can’t give you access to the Vets.gov health tools');
  });

  it('should show error if the user has a disabled MHV account', () => {
    const newProps = set('account.state', 'has_deactivated_mhv_ids', props);
    const wrapper = shallow(<MHVApp {...newProps}/>);
    expectAlert(wrapper, 'error', 'It looks like you’ve disabled your My HealtheVet account');
  });

  it('should show error if the user has multiple active MHV accounts', () => {
    const newProps = set('account.state', 'has_multiple_active_mhv_ids', props);
    const wrapper = shallow(<MHVApp {...newProps}/>);
    expectAlert(wrapper, 'error', 'It looks like you have more than one My HealtheVet account');
  });
});
