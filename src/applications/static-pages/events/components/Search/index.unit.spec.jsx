import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Search } from '.';

describe('Events <Search>', () => {
  it('renders what we expect', () => {
    const wrapper = shallow(<Search />);

    expect(wrapper.find('FilterBy')).to.have.length(1);

    wrapper.unmount();
  });
});
