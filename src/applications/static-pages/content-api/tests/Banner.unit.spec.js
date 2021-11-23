import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Banner from '../components/Banner';
import { mockBanners } from '../api/mocks/mockData';

// Unit tests for Banner component
describe('<Banner />', () => {
  // it should render a banner with mockBanners json data
  it('should render a banner with mockBanners json data', () => {
    const wrapper = shallow(<Banner banners={mockBanners} />);
    expect(wrapper.find('h3')).to.have.length(1);
    wrapper.unmount();
  });
});
