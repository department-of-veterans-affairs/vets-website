// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { Search } from '.';

describe('Header <Search>', () => {
  it('renders correct content with no props', () => {
    // Set up.
    const wrapper = shallow(<Search />);

    // Assertions.
    expect(wrapper.find('SearchDropdownComponent')).to.have.length(1);

    // Clean up.
    wrapper.unmount();
  });
});
