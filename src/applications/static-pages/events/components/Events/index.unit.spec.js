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
    expect(wrapper.text()).includes('Outreach events');
    expect(wrapper.text()).includes(
      'VA benefits can help Veterans and their families buy homes, earn degrees, start careers, stay healthy, and more. Join an event for conversation and information.',
    );
    expect(wrapper.find(Search)).to.have.length(1);
    expect(wrapper.find(Results)).to.have.length(1);

    // Clean up.
    wrapper.unmount();
  });
});
