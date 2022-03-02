// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { App } from '.';

describe('Contact Chatbot CTA <App>', () => {
  it('does not render when feature toggle is falsey', () => {
    const wrapper = shallow(<App show={false} />);
    expect(wrapper.type()).to.equal(null);
    wrapper.unmount();
  });

  it('renders what we expect', () => {
    const wrapper = shallow(<App show />);
    expect(wrapper.type()).to.not.equal(null);
    expect(wrapper.text()).includes('VA virtual agent');
    expect(wrapper.text()).includes(
      'You can also use our virtual agent (chatbot) to get information about VA benefits and services.',
    );
    expect(
      wrapper.find(`a[href="/contact-us/virtual-agent/"]`),
    ).be.have.lengthOf(1);
    expect(
      wrapper.find(`a[href="/contact-us/virtual-agent/"]`).text(),
    ).to.equal('Go to the virtual agent');
    wrapper.unmount();
  });
});
