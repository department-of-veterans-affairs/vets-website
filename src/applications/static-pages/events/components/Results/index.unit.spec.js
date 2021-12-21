// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { Results } from '.';

describe('Events <Results>', () => {
  it('renders what we expect', () => {
    // Set up.
    const wrapper = shallow(<Results />);

    // Assertions.
    expect(wrapper.text()).includes('No results found');

    // Clean up.
    wrapper.unmount();
  });
});
