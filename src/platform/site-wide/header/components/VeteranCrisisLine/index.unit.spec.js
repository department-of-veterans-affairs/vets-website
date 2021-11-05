// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { VeteranCrisisLine } from '.';

describe('Header <VeteranCrisisLine>', () => {
  it('renders content', () => {
    // Set up.
    const wrapper = shallow(<VeteranCrisisLine />);

    // Assertions.
    expect(wrapper.find('.va-button-link')).to.have.length(1);
    expect(wrapper.text()).includes('Talk to the Veterans Crisis Line now');

    // Clean up.
    wrapper.unmount();
  });
});
