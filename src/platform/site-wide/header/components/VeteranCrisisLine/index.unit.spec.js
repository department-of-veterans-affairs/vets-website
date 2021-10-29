// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { VeteranCrisisLine } from '.';

describe('Header <VeteranCrisisLine>', () => {
  it('renders content', () => {
    const wrapper = shallow(<VeteranCrisisLine />);
    expect(wrapper.text()).includes('Talk to the Veterans Crisis Line now');
    wrapper.unmount();
  });
});
