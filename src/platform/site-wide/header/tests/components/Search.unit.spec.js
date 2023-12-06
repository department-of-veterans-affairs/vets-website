import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Search } from '../../components/Search';

describe('Header <Search>', () => {
  it('renders correct content with no props', () => {
    const wrapper = shallow(<Search />);

    expect(wrapper.find('form')).to.have.length(1);
    expect(wrapper.find('label')).to.have.length(1);
    expect(wrapper.find('input[type="text"]')).to.have.length(1);
    expect(wrapper.find('button[type="submit"]')).to.have.length(1);

    wrapper.unmount();
  });
});
