import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Logo } from '.';

describe('Header <Logo>', () => {
  it('renders content', () => {
    const wrapper = shallow(<Logo />);

    expect(wrapper.find(`svg`)).to.have.lengthOf(1);

    wrapper.unmount();
  });
});
