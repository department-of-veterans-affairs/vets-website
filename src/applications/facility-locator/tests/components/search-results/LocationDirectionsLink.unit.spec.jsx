import React from 'react';
import { shallow } from 'enzyme';
import LocationDirectionsLink from '../../../components/search-results-items/common/LocationDirectionsLink';
import { expect } from 'chai';
import testDataFacilities from '../../../constants/mock-facility-v1.json';
import testDataProviders from '../../../constants/mock-facility-data-v1.json';

describe('LocationDirectionsLink', () => {
  it('should render LocationDirectionsLink for VA facilities', () => {
    const wrapper = shallow(
      <LocationDirectionsLink
        location={testDataFacilities.data}
        from={'SearchResult'}
      />,
    );
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
  });
  it('should render LocationDirectionsLink for CPP Providers', () => {
    const wrapper = shallow(
      <LocationDirectionsLink
        location={testDataProviders.data[0]}
        from={'SearchResult'}
      />,
    );
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
  });
});
