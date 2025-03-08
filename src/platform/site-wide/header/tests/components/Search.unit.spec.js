import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Search from '../../components/Search';

describe('Header <Search>', () => {
  it('renders correct content with no props', () => {
    const wrapper = shallow(<Search />);
    expect(wrapper.find('#search-header-dropdown')).to.have.length(1);
    wrapper.unmount();
  });
});
