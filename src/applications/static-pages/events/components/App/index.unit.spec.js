// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { App } from '.';

describe('Events <App>', () => {
  it('renders what we expect', () => {
    // Set up.
    const wrapper = shallow(<App />);

    // Assertions.
    expect(wrapper.find('Events')).to.have.length(1);

    // Clean up.
    wrapper.unmount();
  });
});
