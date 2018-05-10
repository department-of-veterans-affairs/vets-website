import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { set } from 'lodash/fp';
import sinon from 'sinon';

import { MhvTermsAndConditions } from '../../containers/MhvTermsAndConditions';

describe('<MhvTermsAndConditions>', () => {
  const props = {
    location: { pathname: '/health-care/medical-information-terms-conditions', query: {} },
    accepted: false,
    attributes: {
      title: 'T&C',
      headerContent: 'header',
      termsContent: 'terms and conditions',
      yesContent: 'agree'
    },
    isLoggedIn: true,
    loading: { tc: false, acceptance: false },
    acceptTerms: sinon.spy(),
    fetchLatestTerms: sinon.spy(),
    fetchTermsAcceptance: sinon.spy()
  };

  const setup = () => {
    global.window.location.replace = sinon.spy();
    props.acceptTerms.reset();
    props.fetchLatestTerms.reset();
    props.fetchTermsAcceptance.reset();
  };

  beforeEach(setup);

  it('should show a loading indicator when fetching terms and conditions', () => {
    const newProps = set('loading.tc', true, props);
    const wrapper = shallow(<MhvTermsAndConditions {...newProps}/>);
    expect(wrapper.find('LoadingIndicator').exists()).to.be.true;
  });

  it('should show a loading indicator when accepting or fetching acceptance', () => {
    const newProps = set('loading.acceptance', true, props);
    const wrapper = shallow(<MhvTermsAndConditions {...newProps}/>);
    expect(wrapper.find('LoadingIndicator').exists()).to.be.true;
  });

  it('should show a success message after acceptance', () => {
    const wrapper = shallow(<MhvTermsAndConditions {...props}/>);
    wrapper.setState({ isSubmitted: true });
    wrapper.setProps({ accepted: true });
    expect(wrapper.state('showAcceptedMessage')).to.be.true;
  });

  it('should redirect after acceptance if there is a redirect URL', () => {
    const newProps = set('location.query.tc_redirect', '/health-care/prescriptions', props);
    const wrapper = shallow(<MhvTermsAndConditions {...newProps}/>);
    wrapper.setState({ isSubmitted: true });
    wrapper.setProps({ accepted: true });
    expect(wrapper.state('showAcceptedMessage')).to.be.true;
    expect(global.window.location.replace.calledOnce).to.be.true;
  });
});

