// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import Results from '../Results';
import Search from '../Search';
import { Events } from '.';

describe('Events <Events>', () => {
  it('renders content', () => {
    // Set up.
    const wrapper = shallow(<Events />);

    // Assertions.
    expect(wrapper.find(Search)).to.have.length(1);
    expect(wrapper.find(Results)).to.have.length(1);

    // Clean up.
    wrapper.unmount();
  });
});
