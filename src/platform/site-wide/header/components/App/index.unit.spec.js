// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { App } from '.';

describe('Header <App>', () => {
  it('renders legacy header when our width is more than 768px', () => {
    // Set up.
    window.innerWidth = 768;
    const wrapper = shallow(<App show />);

    // Assertions.
    expect(wrapper.find(`Header`)).to.have.lengthOf(0);

    // Clean up.
    wrapper.unmount();
  });

  it('renders header v2 when our width is less than 768px', () => {
    // Set up.
    window.innerWidth = 767;
    const wrapper = shallow(<App show />);

    // Assertions.
    expect(wrapper.find(`Header`)).to.have.lengthOf(1);

    // Clean up.
    wrapper.unmount();
  });
});
