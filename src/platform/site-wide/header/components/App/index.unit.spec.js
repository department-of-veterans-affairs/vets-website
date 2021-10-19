// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { App } from '.';

describe('Header <App>', () => {
  it('renders legacy header when showHeaderV2 is falsey', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(`LegacyHeader`)).be.have.lengthOf(1);
    expect(wrapper.find(`Header`)).be.have.lengthOf(0);
    wrapper.unmount();
  });

  it('renders header v2 when showHeaderV2 is truthy', () => {
    const wrapper = shallow(<App showHeaderV2 />);
    expect(wrapper.find(`LegacyHeader`)).be.have.lengthOf(0);
    expect(wrapper.find(`Header`)).be.have.lengthOf(1);
    wrapper.unmount();
  });
});
