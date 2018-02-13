import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { merge, set } from 'lodash/fp';
import sinon from 'sinon';

import { MHVApp } from '../../../src/js/common/components/MHVApp.jsx';

describe('<MHVApp>', () => {
  const props = {
    account: {
      errors: null,
      loading: false,
      polling: false,
      polledTimes: 0,
      state: 'unknown'
    },
    terms: {
      accepted: false,
      errors: null,
      loading: false
    },
    acceptTerms: sinon.spy(),
    createMHVAccount: sinon.spy(),
    fetchLatestTerms: sinon.spy(),
    fetchMHVAccount: sinon.spy()
  };

  const setup = () => {
    props.acceptTerms.reset();
    props.createMHVAccount.reset();
    props.fetchLatestTerms.reset();
    props.fetchMHVAccount.reset();
  };

  beforeEach(setup);

  it('should show a loading indicator when fetching terms', () => {
    const newProps = set('terms.loading', true, props);
    const wrapper = shallow(<MHVApp {...newProps}/>);
    expect(wrapper.find('LoadingIndicator').exists()).to.be.true;
  });

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


  it('should fetch terms if the user needs to accept terms', () => {
    const newProps = set('account.state', 'needs_terms_acceptance', props);
    const wrapper = shallow(<MHVApp {...newProps}/>);
    expect(props.fetchLatestTerms.calledOnce).to.be.true;
    expect(wrapper.find('AcceptTermsPrompt').exists()).to.be.true;
  });

  it('should create an account if the app is not accessible', () => {
    shallow(<MHVApp {...props}/>);
    expect(props.createMHVAccount.calledOnce).to.be.true;
  });

  it('should create an account after the user accepts terms', () => {
    const newProps = set('account.state', 'needs_terms_acceptance', props);
    const wrapper = shallow(<MHVApp {...newProps}/>);
    const account = { ...props.account, state: 'unknown' };
    wrapper.setProps({ account });
    expect(props.createMHVAccount.calledOnce).to.be.true;
  });

  it('should not attempt another account creation if the user remains unable to access', () => {
    const wrapper = shallow(<MHVApp {...props}/>);
    const account = { ...props.account, state: 'unknown' };
    wrapper.setProps({ account });
    expect(props.createMHVAccount.calledOnce).to.be.true;
  });

  it('should poll for account state while account is being created', () => {
    const clock = sinon.useFakeTimers();
    const wrapper = shallow(<MHVApp {...props}/>);
    const pollingAccount = set('polling', true, props.account);
    wrapper.setProps({ account: pollingAccount });
    expect(wrapper.find('LoadingIndicator').exists()).to.be.true;

    wrapper.setProps({ account: set('polledTimes', 1, pollingAccount) });
    clock.tick(1000);
    wrapper.setProps({ account: set('polledTimes', 2, pollingAccount) });
    clock.tick(2000);
    expect(props.fetchMHVAccount.calledThrice).to.be.true;

    const account = {
      ...props.account,
      polling: false,
      polledTimes: 0,
      state: 'upgraded'
    };

    wrapper.setProps({ account });
    expect(props.fetchMHVAccount.calledOnce).to.be.false;
  });
});
