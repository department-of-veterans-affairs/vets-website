import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { mockFacilityLocatorApiResponse } from './mockFacilitiesData';
import { FacilityMapWidget } from '../FacilityMapWidget';

describe('facilities <FacilityMapWidget>', () => {
  it('should render loading', () => {
    const tree = shallow(<FacilityMapWidget loading />);

    expect(tree.find('va-loading-indicator').exists()).to.be.true;
    tree.unmount();
  });

  it('should render facility map data', () => {
    const tree = shallow(
      <FacilityMapWidget
        loading={false}
        facility={mockFacilityLocatorApiResponse.data[0]}
      />,
    );

    const map = tree.find('#generated-mapbox-image-link');
    expect(map.exists()).to.be.true;

    tree.unmount();
  });
});
