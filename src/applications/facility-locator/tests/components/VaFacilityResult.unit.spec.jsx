import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import VaFacilityResult from '../../components/search-results-items/VaFacilityResult';
import testData from '../../constants/mock-facility-data-v1.json';
import { LocationType, OperatingStatus } from '../../constants';
import LocationOperationStatus from '../../components/search-results-items/common/LocationOperationStatus';

describe('VaFacilityResult', () => {
  it('Should render VaFacilityResult, facility type health', () => {
    const query = {
      facilityType: LocationType.HEALTH,
    };
    const wrapper = shallow(
      <VaFacilityResult location={testData.data[0]} query={query} />,
    );
    expect(wrapper.find('LocationDistance').length).to.equal(1);
    expect(wrapper.find('LocationAddress').length).to.equal(1);
    expect(wrapper.find('LocationDirectionsLink').length).to.equal(1);
    expect(wrapper.find('LocationPhoneLink').length).to.equal(1);
    expect(wrapper.find('.facility-result Link').html()).to.equal(
      '<a>Austin VA Clinic</a>',
    );
    expect(wrapper.find('LocationOperationStatus').length).to.equal(0);
    wrapper.unmount();
  });

  it('Should render VaFacilityResult, facility type benefits', () => {
    const query = {
      facilityType: LocationType.BENEFITS,
    };
    const wrapper = shallow(
      <VaFacilityResult location={testData.data[6]} query={query} />,
    );
    expect(wrapper.find('LocationDistance').length).to.equal(1);
    expect(wrapper.find('LocationAddress').length).to.equal(1);
    expect(wrapper.find('LocationDirectionsLink').length).to.equal(1);
    expect(wrapper.find('LocationPhoneLink').length).to.equal(1);
    expect(wrapper.find('.facility-result h3 Link').html()).to.equal(
      '<a>VetSuccess on Campus at Los Angeles City College</a>',
    );
    expect(wrapper.find('LocationOperationStatus').length).to.equal(0);
    wrapper.unmount();
  });

  it('Should render VaFacility VA, facility type cemetery', () => {
    const query = {
      facilityType: LocationType.CEMETARY,
    };
    const wrapper = shallow(
      <VaFacilityResult location={testData.data[7]} query={query} />,
    );
    expect(wrapper.find('LocationDistance').length).to.equal(1);
    expect(wrapper.find('LocationAddress').length).to.equal(1);
    expect(wrapper.find('LocationDirectionsLink').length).to.equal(1);
    expect(wrapper.find('LocationPhoneLink').length).to.equal(1);
    expect(wrapper.find('.facility-result h3 Link').html()).to.equal(
      '<a>Washington State Veterans Cemetery Medical Lake</a>',
    );
    expect(wrapper.find('LocationOperationStatus').length).to.equal(1);
    wrapper.unmount();
  });

  it('Should render VaFacility VA, facility type Vet Center', () => {
    const query = {
      facilityType: LocationType.VET_CENTER,
    };
    const wrapper = shallow(
      <VaFacilityResult location={testData.data[8]} query={query} />,
    );
    expect(wrapper.find('LocationDistance').length).to.equal(1);
    expect(wrapper.find('LocationAddress').length).to.equal(1);
    expect(wrapper.find('LocationDirectionsLink').length).to.equal(1);
    expect(wrapper.find('LocationPhoneLink').length).to.equal(1);
    expect(wrapper.find('.facility-result a').props().href).to.equal(
      'https://va.gov/alexandria',
    );
    expect(wrapper.find('LocationOperationStatus').length).to.equal(0);
    wrapper.unmount();
  });

  it('Should render LocationOperationStatus with LIMITED status', () => {
    const wrapper = shallow(
      <LocationOperationStatus operatingStatus={OperatingStatus.LIMITED} />,
    );
    expect(wrapper.find('span').hasClass('sr-only')).to.equal(true);
    expect(wrapper.find('i').prop('aria-hidden')).to.equal('true');
    expect(wrapper.find('i').prop('role')).to.equal('img');
    wrapper.unmount();
  });
});
