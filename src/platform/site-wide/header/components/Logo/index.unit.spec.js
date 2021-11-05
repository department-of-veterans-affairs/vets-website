// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { Logo } from '.';

describe('Header <Logo>', () => {
  it('renders content', () => {
    // Set up.
    const wrapper = shallow(<Logo />);

    // Assertions.
    expect(wrapper.find(`svg`)).to.have.lengthOf(1);

    // Clean up.
    wrapper.unmount();
  });
});
