import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { App } from '../../components/App';

describe('Header <App>', () => {
  it('renders legacy header when our width is more than 768px', () => {
    window.innerWidth = 768;
    const wrapper = shallow(<App show />);

    expect(wrapper.find(`Header`)).to.have.lengthOf(0);

    wrapper.unmount();
  });

  it('renders header v2 when our width is less than 768px', () => {
    window.innerWidth = 767;
    const wrapper = shallow(<App show />);

    expect(wrapper.find(`Header`)).to.have.lengthOf(1);

    wrapper.unmount();
  });
});
