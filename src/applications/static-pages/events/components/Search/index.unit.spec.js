// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { Search } from '.';

describe('Events <Search>', () => {
  it('renders what we expect', () => {
    // Set up.
    const wrapper = shallow(<Search />);

    // Assertions.
    expect(wrapper.text()).includes('Filter by');
    expect(wrapper.text()).includes('Apply filter');

    // Clean up.
    wrapper.unmount();
  });
});
