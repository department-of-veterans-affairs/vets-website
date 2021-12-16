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
    expect(wrapper.find('form')).to.have.length(1);
    expect(wrapper.find('label')).to.have.length(1);
    expect(wrapper.find('input[type="text"]')).to.have.length(1);
    expect(wrapper.find('button[type="submit"]')).to.have.length(1);

    // Clean up.
    wrapper.unmount();
  });
});
