// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { App } from '.';

describe('Medical Copays CTA <App>', () => {
  it('does not render when feature toggle is falsey', () => {
    const wrapper = shallow(<App show={false} />);
    expect(wrapper.type()).to.equal(null);
    wrapper.unmount();
  });

  it('renders what we expect when unauthenticated', () => {
    const wrapper = shallow(<App loggedIn={false} show />);
    expect(wrapper.type()).to.not.equal(null);
    expect(wrapper.text()).includes(
      'Please sign in to view your VA copay balances',
    );
    expect(wrapper.text()).includes(
      'If you don’t have any of those accounts, you can create one now. When you sign in or create an account, you’ll be able to:',
    );
    expect(wrapper.text()).includes(
      'View your balances for each of your medical facilities',
    );
    expect(wrapper.text()).includes('Download your copay statements');
    expect(wrapper.text()).includes('Find the right repayment option for you');
    expect(wrapper.find('a.vads-c-action-link--blue')).to.have.lengthOf(0);
    expect(wrapper.find('button.usa-button')).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('renders what we expect when authenticated', () => {
    const wrapper = shallow(<App loggedIn show />);
    expect(wrapper.type()).to.not.equal(null);
    expect(wrapper.text()).includes(
      'Please sign in to view your VA copay balances',
    );
    expect(wrapper.text()).includes(
      'If you don’t have any of those accounts, you can create one now. When you sign in or create an account, you’ll be able to:',
    );
    expect(wrapper.text()).includes(
      'View your balances for each of your medical facilities',
    );
    expect(wrapper.text()).includes('Download your copay statements');
    expect(wrapper.text()).includes('Find the right repayment option for you');
    expect(wrapper.find('a.vads-c-action-link--blue')).to.have.lengthOf(1);
    expect(wrapper.find('button.usa-button')).to.have.lengthOf(0);
    wrapper.unmount();
  });
});
