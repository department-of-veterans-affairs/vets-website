// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { App } from '.';

describe('Shifted Veteran Banner <App>', () => {
  it('renders the new banner', () => {
    // Set up.
    const wrapper = shallow(<App show />);

    // Assertions.
    expect(wrapper.find('#vets-banner-2')).to.have.length(1);

    // Clean up.
    wrapper.unmount();
  });
});
