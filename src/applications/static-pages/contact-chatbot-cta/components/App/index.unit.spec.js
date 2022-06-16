// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { App } from '.';

describe('Contact Chatbot CTA <App>', () => {
  /**
   * NOTE:
   *
   * These tests need some work. The `show` property is not doing anything.
   * This first test will fail inconsistently based on the random number
   * generation. For now, skipping the tests while we have the gate
   * logic commented out in index.js. Should revisit this when we decide
   * to permanently remove gate logic.
   */
  it.skip('does not render when feature toggle is falsey', () => {
    const wrapper = shallow(<App show={false} />);
    expect(wrapper.type()).to.equal(null);
    wrapper.unmount();
  });

  it.skip('renders what we expect', () => {
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
