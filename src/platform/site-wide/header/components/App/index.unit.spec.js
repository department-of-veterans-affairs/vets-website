// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { App } from '.';

describe('Header <App>', () => {
  it('renders legacy header when showHeaderV2 is falsey', () => {
    const wrapper = shallow(<App show />);
    expect(wrapper.find(`Header`)).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('renders legacy header when showHeaderV2 is truthy and our width is more than 768px', () => {
    window.innerWidth = 768;
    const wrapper = shallow(<App show showHeaderV2 />);
    expect(wrapper.find(`Header`)).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('renders header v2 when showHeaderV2 is truthy and our width is less than 768px', () => {
    window.innerWidth = 767;
    const wrapper = shallow(<App show showHeaderV2 />);
    expect(wrapper.find(`Header`)).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
