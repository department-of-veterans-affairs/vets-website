import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import FullwidthBannerAlert from '../components/FullwidthBannerAlert';
import { mockBannersFullWidth } from '../api/mocks/mockData';

// Unit tests for Banner component
describe('<FullwidthBannerAlert />', () => {
  // it should render a banner with mockBanners json data
  it('should render a banner with mockBanners json data', () => {
    const wrapper = shallow(
      <FullwidthBannerAlert banners={mockBannersFullWidth} />,
    );
    expect(wrapper.find('h3')).to.have.length(1);
    wrapper.unmount();
  });
});
