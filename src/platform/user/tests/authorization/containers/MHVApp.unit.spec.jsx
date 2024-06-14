import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { render } from '@testing-library/react';

import { merge } from 'lodash';
import sinon from 'sinon';
import set from '../../../../utilities/data/set';

import backendServices from '../../../profile/constants/backendServices';
import { MHVApp } from '../../../authorization/containers/MHVApp';

describe('<MHVApp>', () => {
  let oldLocation;

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
    fetchMHVAccount: sinon.spy(),
  };

  const setup = () => {
    oldLocation = global.window.location;
    delete global.window.location;
    global.window.location = {
      replace: sinon.spy(),
    };
    props.fetchMHVAccount.reset();
  };

  const context = { router: {} };

  const expectAlert = (wrapper, expectedStatus, expectedHeadline) => {
    const vaAlert = wrapper.container.querySelector('va-alert');
    const [headline] = vaAlert.children;
    expect(vaAlert.getAttribute('status')).to.eq(expectedStatus);
    expect(headline.innerHTML).to.contain(expectedHeadline);
  };

  beforeEach(setup);

  afterEach(() => {
    global.window.location = oldLocation;
  });

  it('should show a loading indicator when fetching an account', () => {
    const newProps = set('mhvAccount.loading', true, props);
    const wrapper = shallow(<MHVApp {...newProps} />, { context });
    expect(wrapper.find('va-loading-indicator').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should redirect if the user needs to accepts T&C', () => {
    const wrapper = shallow(<MHVApp {...props} />, { context });
    const mhvAccount = set(
      'accountState',
      'needs_terms_acceptance',
      props.mhvAccount,
    );
    wrapper.setProps({ mhvAccount });
    expect(global.window.location.replace.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('should show a success message after the user accepts T&C and gets upgraded', () => {
    const newProps = merge({}, props, {
      mhvAccount: { ...props.mhvAccount, accountState: 'upgraded' },
      location: { ...props.location, query: { tc_accepted: true } }, // eslint-disable-line camelcase
      availableServices: ['rx'],
    });
    const wrapper = render(<MHVApp {...newProps} />, { context });
    expectAlert(
      wrapper,
      'success',
      'Thank you for accepting the Terms and Conditions for using VA.gov health tools',
    );
    wrapper.unmount();
  });

  it('should show MHV access error if nothing is loading or processing', () => {
    const wrapper = shallow(<MHVApp {...props} />, { context });
    expect(wrapper.find('#mhv-access-error').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should show MHV access error if user has an account but not the required service', () => {
    const newProps = set('mhvAccount.accountState', 'existing', props);
    const wrapper = shallow(<MHVApp {...newProps} />, { context });
    expect(wrapper.find('#mhv-access-error').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render children if user has the required service as an existing user', () => {
    const newProps = merge({}, props, {
      mhvAccount: { accountState: 'existing' },
      availableServices: ['rx'],
    });
    const wrapper = shallow(
      <MHVApp {...newProps}>
        <div id="test" />
      </MHVApp>,
      { context },
    );
    expect(wrapper.find('#test').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render children if user has the required service as a registered user', () => {
    const newProps = merge({}, props, {
      mhvAccount: { accountState: 'registered' },
      availableServices: ['rx'],
    });
    const wrapper = shallow(
      <MHVApp {...newProps}>
        <div id="test" />
      </MHVApp>,
      { context },
    );
    expect(wrapper.find('#test').exists()).to.be.true;
    wrapper.unmount();
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
    const wrapper = render(<MHVApp {...newProps} />, { context });
    expectAlert(
      wrapper,
      'error',
      'We’re not able to process your My HealtheVet account',
    );
    wrapper.unmount();
  });

  it('should show error if unable to determine MHV account level', () => {
    const newProps = set('mhvAccount.accountLevel', 'Unknown', props);
    const wrapper = render(<MHVApp {...newProps} />, { context });
    expectAlert(
      wrapper,
      'error',
      'We can’t confirm your My HealtheVet account level',
    );
    wrapper.unmount();
  });

  it('should show error if failed to register MHV account', () => {
    const newProps = set('mhvAccount.accountState', 'register_failed', props);
    const wrapper = render(<MHVApp {...newProps} />, { context });
    expectAlert(
      wrapper,
      'error',
      'We can’t give you access to VA.gov health tools right now',
    );
    wrapper.unmount();
  });

  it('should show error if failed to upgrade MHV account', () => {
    const newProps = set('mhvAccount.accountState', 'upgrade_failed', props);
    const wrapper = render(<MHVApp {...newProps} />, { context });
    expectAlert(
      wrapper,
      'error',
      'We can’t give you access to VA.gov health tools right now',
    );
    wrapper.unmount();
  });

  it('should show error if the user has mismatched SSNs', () => {
    const newProps = set(
      'mhvAccount.accountState',
      'needs_ssn_resolution',
      props,
    );
    const wrapper = render(<MHVApp {...newProps} />, { context });
    expectAlert(
      wrapper,
      'error',
      'We can’t give you access to the VA.gov health tools',
    );
    wrapper.unmount();
  });

  it('should show error if the user is not a VA patient', () => {
    const newProps = set('mhvAccount.accountState', 'needs_va_patient', props);
    const wrapper = render(<MHVApp {...newProps} />, { context });
    expectAlert(
      wrapper,
      'error',
      'We can’t give you access to the VA.gov health tools',
    );
    wrapper.unmount();
  });

  it('should show error if the user has a disabled MHV account', () => {
    const newProps = set(
      'mhvAccount.accountState',
      'has_deactivated_mhv_ids',
      props,
    );
    const wrapper = render(<MHVApp {...newProps} />, { context });
    expectAlert(
      wrapper,
      'error',
      'It looks like you’ve disabled your My HealtheVet account',
    );
    wrapper.unmount();
  });

  it('should show error if the user has multiple active MHV accounts', () => {
    const newProps = set(
      'mhvAccount.accountState',
      'has_multiple_active_mhv_ids',
      props,
    );
    const wrapper = render(<MHVApp {...newProps} />, { context });
    expectAlert(
      wrapper,
      'error',
      'It looks like you have more than one My HealtheVet account',
    );
    wrapper.unmount();
  });
});
