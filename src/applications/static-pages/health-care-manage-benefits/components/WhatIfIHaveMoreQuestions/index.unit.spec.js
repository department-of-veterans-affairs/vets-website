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
    expect(text).to.include('If you have questions about');
    expect(text).to.include('Or contact the My HealtheVet help desk at');
    expect(text).to.not.include(
      'If you have questions about appointment scheduling on My VA Health',
    );

    wrapper.unmount();
  });

  it('renders what we expect when passed props', () => {
    const wrapper = shallow(<MoreInfoAboutBenefits isCernerPatient />);

    const text = wrapper.text();
    expect(text).to.include(
      'If you have questions about appointment scheduling on My VA Health',
    );

    wrapper.unmount();
  });
});
