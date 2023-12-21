import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Search } from '.';

describe('Events <Search>', () => {
  it('renders what we expect', () => {
    const wrapper = shallow(<Search />);

    expect(wrapper.text()).includes('Filter by');
    expect(wrapper.text()).includes('Apply filter');

    wrapper.unmount();
  });
});
