import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import VaFacilityResult from '../../components/search-results-items/VaFacilityResult';
import testData from '../../constants/mock-facility-data-v1.json';
import { LocationType } from '../../constants';

describe('VaFacilitySearch', () => {
  it('Should render VaFacility, facility type health', () => {
    const query = {
      facilityType: LocationType.HEALTH,
    };
    const wrapper = shallow(
      <VaFacilityResult location={testData.data[0]} query={query} />,
    );
    expect(wrapper).to.matchSnapshot();
    wrapper.unmount();
  });

  it('Should render VaFacility VA, facility type benefits', () => {
    const query = {
      facilityType: LocationType.BENEFITS,
    };
    const wrapper = shallow(
      <VaFacilityResult location={testData.data[6]} query={query} />,
    );
    expect(wrapper).to.matchSnapshot();
    wrapper.unmount();
  });

  it('Should render VaFacility VA, facility type cemetery', () => {
    const query = {
      facilityType: LocationType.CEMETARY,
    };
    const wrapper = shallow(
      <VaFacilityResult location={testData.data[7]} query={query} />,
    );
    expect(wrapper).to.matchSnapshot();
    wrapper.unmount();
  });

  it('Should render VaFacility VA, facility type Vet Center', () => {
    const query = {
      facilityType: LocationType.VET_CENTER,
    };
    const wrapper = shallow(
      <VaFacilityResult location={testData.data[8]} query={query} />,
    );
    expect(wrapper).to.matchSnapshot();
    wrapper.unmount();
  });
});
