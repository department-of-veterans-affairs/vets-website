// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import MoreInfoAboutBenefits from '.';

describe('More Informatin About Benefits <MoreInfoAboutBenefits>', () => {
  it('renders what we expect', () => {
    const wrapper = shallow(<MoreInfoAboutBenefits />);

    const text = wrapper.text();
    expect(text).to.include('More information about your benefits');
    expect(text).to.include('Health care benefits eligibility');
    expect(text).to.include('How to apply for health care benefits');
    expect(text).to.include('Health needs and conditions');
    expect(text).to.include('Disability benefits');

    wrapper.unmount();
  });
});
