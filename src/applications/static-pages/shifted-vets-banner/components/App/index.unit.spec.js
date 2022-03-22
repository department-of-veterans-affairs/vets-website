// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { App } from '.';

describe('Shifted Veteran Banner <App>', () => {
  it('does not render when feature toggle disabled', () => {
    // Set up.
    const wrapper = shallow(<App />);

    // Assertions.
    expect(wrapper.type()).to.equal(null);

    // Clean up.
    wrapper.unmount();
  });

  it('renders what we expect with feature toggle enabled', () => {
    // Set up.
    const wrapper = shallow(<App show />);

    // Assertions.
    expect(wrapper.find('#vets-banner-2')).to.have.length(1);

    // Clean up.
    wrapper.unmount();
  });
});
