import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Results from '../Results';
import Search from '../Search';
import { Events } from '.';

describe('Events <Events>', () => {
  it('renders content', () => {
    const wrapper = shallow(<Events />);

    expect(wrapper.find(Search)).to.have.length(1);
    expect(wrapper.find(Results)).to.have.length(1);

    wrapper.unmount();
  });
});
