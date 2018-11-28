import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { merge, set } from 'lodash/fp';
import sinon from 'sinon';

import backendServices from '../../../../user/profile/constants/backendServices';
import { MHVApp } from '../../../authorization/containers/MHVApp';

describe('<MHVApp>', () => {
  const props = {
    location: { pathname: '/health-care/prescriptions', query: {} },
    mhvAccount: {
      accountLevel: null,
      accountState: null,
      errors: null,
      loading: false,
    },
    availableServices: [
      backendServices.FACILITIES,
      backendServices.HCA,
      backendServices.USER_PROFILE,
    ],
    serviceRequired: backendServices.RX,
    createMHVAccount: sinon.spy(),
    fetchMHVAccount: sinon.spy(),
    refreshProfile: sinon.spy(),
    upgradeMHVAccount: sinon.spy(),
  };

  const setup = () => {
    global.window.location.replace = sinon.spy();
    props.createMHVAccount.reset();
    props.fetchMHVAccount.reset();
    props.refreshProfile.reset();
    props.upgradeMHVAccount.reset();
  };

  const expectAlert = (wrapper, expectedStatus, expectedHeadline) => {
    const alertBox = wrapper.find('AlertBox');
    const headlineProp = alertBox.prop('headline');
    const headlineText =
      typeof headlineProp === 'string'
        ? headlineProp
        : shallow(headlineProp).text();
    expect(alertBox.prop('status')).to.eq(expectedStatus);
    expect(headlineText).to.eq(expectedHeadline);
  };

  beforeEach(setup);

  it('should show a loading indicator when fetching an account', () => {
    const newProps = set('mhvAccount.loading', true, props);
    const wrapper = shallow(<MHVApp {...newProps} />);
    expect(wrapper.find('LoadingIndicator').exists()).to.be.true;
  });

  it('should create an account if the user does not have an account but is eligible', () => {
    const wrapper = shallow(<MHVApp {...props} />);
    const mhvAccount = set('accountState', 'no_account', props.mhvAccount);
    wrapper.setProps({ mhvAccount });
    expect(props.createMHVAccount.calledOnce).to.be.true;
  });

  it('should redirect if the user needs to accepts T&C', () => {
    const wrapper = shallow(<MHVApp {...props} />);
    const mhvAccount = set(
      'accountState',
      'needs_terms_acceptance',
      props.mhvAccount,
    );
    wrapper.setProps({ mhvAccount });
    expect(global.window.location.replace.calledOnce).to.be.true;
  });

  it('should invoke upgrade if the user is only registered', () => {
    const wrapper = shallow(<MHVApp {...props} />);
    const mhvAccount = set('accountState', 'registered', props.mhvAccount);
    wrapper.setProps({ mhvAccount });
    expect(props.upgradeMHVAccount.calledOnce).to.be.true;
  });

  it('should invoke upgrade if the user is existing without access to the service', () => {
    const wrapper = shallow(<MHVApp {...props} />);
    const mhvAccount = set('accountState', 'existing', props.mhvAccount);
    wrapper.setProps({ mhvAccount });
    expect(props.upgradeMHVAccount.calledOnce).to.be.true;
  });

  it('should show a success message after the user accepts T&C and gets upgraded', () => {
    const newProps = merge(props, {
      mhvAccount: { ...props.mhvAccount, accountState: 'upgraded' },
      location: { ...props.location, query: { tc_accepted: true } }, // eslint-disable-line camelcase
      availableServices: ['rx'],
    });
    const wrapper = shallow(<MHVApp {...newProps} />);
    expectAlert(
      wrapper,
      'success',
      'Thank you for accepting the Terms and Conditions for using Vets.gov health tools',
    );
  });

  it('should show MHV access error if nothing is loading or processing', () => {
    const wrapper = shallow(<MHVApp {...props} />);
    expect(wrapper.find('#mhv-access-error').exists()).to.be.true;
  });

  it('should show MHV access error if user has an account but not the required service', () => {
    const newProps = set('mhvAccount.accountState', 'existing', props);
    const wrapper = shallow(<MHVApp {...newProps} />);
    expect(wrapper.find('#mhv-access-error').exists()).to.be.true;
  });

  it('should render children if user has the required service as an existing user', () => {
    const newProps = merge(props, {
      mhvAccount: { accountState: 'existing' },
      availableServices: ['rx'],
    });
    const wrapper = shallow(
      <MHVApp {...newProps}>
        <div id="test" />
      </MHVApp>,
    );
    expect(wrapper.find('#test').exists()).to.be.true;
  });

  it('should render children if user has the required service as a registered user', () => {
    const newProps = merge(props, {
      mhvAccount: { accountState: 'registered' },
      availableServices: ['rx'],
    });
    const wrapper = shallow(
      <MHVApp {...newProps}>
        <div id="test" />
      </MHVApp>,
    );
    expect(wrapper.find('#test').exists()).to.be.true;
  });

  it('should show placeholder account error', () => {
    const errors = [
      {
        title: 'Account error',
        detail: 'There was a problem with your account',
        code: '500',
        status: '500',
      },
    ];

    const newProps = set('mhvAccount.errors', errors, props);
    const wrapper = shallow(<MHVApp {...newProps} />);
    expectAlert(
      wrapper,
      'error',
      'We’re not able to process your My HealtheVet account',
    );
  });

  it('should show error if unable to determine MHV account level', () => {
    const newProps = set('mhvAccount.accountLevel', 'Unknown', props);
    const wrapper = shallow(<MHVApp {...newProps} />);
    expectAlert(
      wrapper,
      'error',
      'We can’t confirm your My HealtheVet account level',
    );
  });

  it('should show error if failed to register MHV account', () => {
    const newProps = set('mhvAccount.accountState', 'register_failed', props);
    const wrapper = shallow(<MHVApp {...newProps} />);
    expectAlert(
      wrapper,
      'error',
      'We can’t give you access to Vets.gov health tools right now',
    );
  });

  it('should show error if failed to upgrade MHV account', () => {
    const newProps = set('mhvAccount.accountState', 'upgrade_failed', props);
    const wrapper = shallow(<MHVApp {...newProps} />);
    expectAlert(
      wrapper,
      'error',
      'We can’t give you access to Vets.gov health tools right now',
    );
  });

  it('should show error if the user has mismatched SSNs', () => {
    const newProps = set(
      'mhvAccount.accountState',
      'needs_ssn_resolution',
      props,
    );
    const wrapper = shallow(<MHVApp {...newProps} />);
    expectAlert(
      wrapper,
      'error',
      'We can’t give you access to the Vets.gov health tools',
    );
  });

  it('should show error if the user is not a VA patient', () => {
    const newProps = set('mhvAccount.accountState', 'needs_va_patient', props);
    const wrapper = shallow(<MHVApp {...newProps} />);
    expectAlert(
      wrapper,
      'error',
      'We can’t give you access to the Vets.gov health tools',
    );
  });

  it('should show error if the user has a disabled MHV account', () => {
    const newProps = set(
      'mhvAccount.accountState',
      'has_deactivated_mhv_ids',
      props,
    );
    const wrapper = shallow(<MHVApp {...newProps} />);
    expectAlert(
      wrapper,
      'error',
      'It looks like you’ve disabled your My HealtheVet account',
    );
  });

  it('should show error if the user has multiple active MHV accounts', () => {
    const newProps = set(
      'mhvAccount.accountState',
      'has_multiple_active_mhv_ids',
      props,
    );
    const wrapper = shallow(<MHVApp {...newProps} />);
    expectAlert(
      wrapper,
      'error',
      'It looks like you have more than one My HealtheVet account',
    );
  });
});
