import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { App } from '.';

describe('Events <App>', () => {
  it('renders what we expect', () => {
    const wrapper = shallow(<App />);

    expect(wrapper.find('Events')).to.have.length(1);

    wrapper.unmount();
  });
});
