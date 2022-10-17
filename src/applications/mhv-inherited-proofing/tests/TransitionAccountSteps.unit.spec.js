import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import TransitionAccountSteps from '../components/TransitionAccountSteps';
import { ACCOUNT_TRANSITION } from '../constants';

describe('TransitionAccountSteps', () => {
  let canTransition;

  beforeEach(() => {
    canTransition = false;
  });

  it('should render', () => {
    const wrapper = shallow(
      <TransitionAccountSteps canTransition={canTransition} />,
    );

    expect(wrapper.find('h2').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render differently when `canTransition` prop is false', () => {
    const wrapper = shallow(<TransitionAccountSteps canTransition={false} />);

    expect(wrapper.find('h2').text()).to.eql(
      ACCOUNT_TRANSITION.headline.ineligible,
    );
    expect(wrapper.find('[data-testid="subheader"]').text()).to.eql(
      ACCOUNT_TRANSITION.subheader.ineligible,
    );
    wrapper.unmount();
  });

  it('should render differently when `canTransition` prop is true', () => {
    canTransition = true;
    const wrapper = shallow(
      <TransitionAccountSteps canTransition={canTransition} />,
    );

    expect(wrapper.find('h2').text()).to.eql(
      ACCOUNT_TRANSITION.headline.eligible,
    );
    expect(wrapper.find('[data-testid="subheader"]').text()).to.eql(
      ACCOUNT_TRANSITION.subheader.eligible,
    );
    expect(wrapper.find('button').text()).to.eql(
      'Transfer my account to Login.gov',
    );
    wrapper.unmount();
  });
});
