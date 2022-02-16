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
    const expectedHref = '/virtual-agent-study/';
    const wrapper = shallow(<App show />);
    expect(wrapper.type()).to.not.equal(null);
    expect(wrapper.text()).includes('VA Virtual Agent');
    expect(wrapper.text()).includes(
      'Use our virtual agent (chatbot) to get answers to your questions about VA benefits and services, and helpful links to find more information on our site.',
    );
    expect(wrapper.find(`a[href="${expectedHref}"]`)).be.have.lengthOf(1);
    expect(wrapper.find(`a[href="${expectedHref}"]`).text()).to.equal(
      'Chat with our Virtual Agent',
    );
    wrapper.unmount();
  });
});
