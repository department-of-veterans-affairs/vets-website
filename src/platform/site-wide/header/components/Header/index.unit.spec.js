// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { Header } from '.';

describe('Header <Header>', () => {
  it('renders content', () => {
    const wrapper = shallow(<Header />);
    expect(wrapper.find(`Header`)).be.have.lengthOf(1);
    wrapper.unmount();
  });
});
