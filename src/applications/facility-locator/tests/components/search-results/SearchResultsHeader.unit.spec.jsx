import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { SearchResultsHeader } from '../../../components/SearchResultsHeader';
import {
  FacilitiesServicesConstants,
  createRegexString,
  STD_RADIUS,
} from '../../../constants';
import {
  urgentCareServices,
  benefitsServices,
  emergencyCareServices,
  healthServices,
} from '../../../config';

const defaultLocation = 'new york';

describe('SearchResultsHeader', () => {
  it('should not render header if context is not provided', () => {
    const wrapper = shallow(<SearchResultsHeader results={[]} />);

    expect(wrapper.find('h2').length).to.equal(0);
    wrapper.unmount();
  });

  it('should render header if results are empty and context exists', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[]}
        context="11111"
        radius={STD_RADIUS}
        pagination={{ totalEntries: 0 }}
      />,
    );

    expect(
      wrapper
        .find('h2')
        .text()
        .replace(/[^A-Za-z0-9" ]/g, ' '),
    ).to.match(/No results found for.*within \d+ miles of.*11111.*/i);

    wrapper.unmount();
  });

  it('should not render header if inProgress is true', () => {
    const wrapper = shallow(<SearchResultsHeader results={[{}]} inProgress />);

    expect(wrapper.find('h2').length).to.equal(0);
    wrapper.unmount();
  });

  it('should render header if results exist', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.HEALTH.id}
        context={defaultLocation}
        pagination={{ totalEntries: 5 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        serviceType: 'All VA health',
        facilityType: FacilitiesServicesConstants.HEALTH.id,
        totalEntries: 5,
        location: defaultLocation,
      }),
    );
    wrapper.unmount();
  });

  it('should render header with FacilitiesServicesConstants.HEALTH.id for VA health service autosuggest, totalEntries = 1', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.HEALTH.id}
        inProgress={false}
        pagination={{ totalEntries: 1 }}
        results={[{}]}
        serviceType={null}
        context={defaultLocation}
        vamcServiceDisplay="All VA health"
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        serviceType: 'All VA health',
        facilityType: FacilitiesServicesConstants.HEALTH.id,
        totalEntries: 1,
        location: defaultLocation,
      }),
    );

    wrapper.unmount();
  });

  it('should render header with FacilitiesServicesConstants.HEALTH.id, totalEntries = 1', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.HEALTH.id}
        serviceType="PrimaryCare"
        context={defaultLocation}
        pagination={{ totalEntries: 1 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        serviceType: healthServices.PrimaryCare,
        facilityType: FacilitiesServicesConstants.HEALTH.string,
        totalEntries: 1,
        location: defaultLocation,
      }),
    );
    wrapper.unmount();
  });

  it('should render header with FacilitiesServicesConstants.HEALTH.id, totalEntries = 5', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.HEALTH.id}
        serviceType="PrimaryCare"
        context={defaultLocation}
        pagination={{ totalEntries: 5 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        serviceType: healthServices.PrimaryCare,
        facilityType: FacilitiesServicesConstants.HEALTH.id,
        totalEntries: 5,
        location: defaultLocation,
      }),
    );
    wrapper.unmount();
  });

  it('should render header with FacilitiesServicesConstants.HEALTH.id, totalEntries = 15, currentPage = 2, totalPages = 2', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.HEALTH.id}
        serviceType="PrimaryCare"
        context={defaultLocation}
        pagination={{ totalEntries: 15, currentPage: 2, totalPages: 2 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        serviceType: healthServices.PrimaryCare,
        facilityType: FacilitiesServicesConstants.HEALTH.id,
        totalEntries: 15,
        location: defaultLocation,
      }),
    );
    wrapper.unmount();
  });

  it('with FacilitiesServicesConstants.HEALTH.id, null serviceType', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.HEALTH.id}
        context={defaultLocation}
        pagination={{ totalEntries: 5 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        facilityType: FacilitiesServicesConstants.HEALTH.id,
        totalEntries: 5,
        location: defaultLocation,
        serviceType: 'All VA health',
      }),
    );
    wrapper.unmount();
  });

  it('should render header with FacilitiesServicesConstants.URGENT_CARE.id', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.URGENT_CARE.id}
        serviceType="NonVAUrgentCare"
        context={defaultLocation}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        totalEntries: 5,
        location: defaultLocation,
        serviceType: urgentCareServices.NonVAUrgentCare,
        facilityType: FacilitiesServicesConstants.URGENT_CARE.string,
      }),
    );
    wrapper.unmount();
  });

  it('FacilitiesServicesConstants.URGENT_CARE.id, null serviceType', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.URGENT_CARE.id}
        context={defaultLocation}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        totalEntries: 5,
        location: defaultLocation,
        serviceType: 'All in-network urgent care',
        facilityType: FacilitiesServicesConstants.URGENT_CARE.string,
      }),
    );
    wrapper.unmount();
  });

  it('should render header with FacilitiesServicesConstants.EMERGENCY_CARE.id', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.EMERGENCY_CARE.id}
        serviceType="NonVAEmergencyCare"
        context={defaultLocation}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        totalEntries: 0,
        location: defaultLocation,
        serviceType: emergencyCareServices.NonVAEmergencyCare,
        facilityType: FacilitiesServicesConstants.EMERGENCY_CARE.string,
      }),
    );
    wrapper.unmount();
  });

  it('FacilitiesServicesConstants.EMERGENCY_CARE.id, null serviceType', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.EMERGENCY_CARE.id}
        context={defaultLocation}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        serviceType: emergencyCareServices.AllEmergencyCare,
        facilityType: FacilitiesServicesConstants.EMERGENCY_CARE.string,
        totalEntries: 0,
        location: defaultLocation,
      }),
    );
    wrapper.unmount();
  });

  it('should render header with FacilitiesServicesConstants.PHARMACIES_IN_NETWORK.id, totalEntries = 1', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.PHARMACIES_IN_NETWORK.id}
        context={defaultLocation}
        pagination={{ totalEntries: 1 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        facilityType: FacilitiesServicesConstants.PHARMACIES_IN_NETWORK.string,
        serviceType: null,
        totalEntries: 1,
        location: defaultLocation,
      }),
    );
    wrapper.unmount();
  });

  it('should render header with FacilitiesServicesConstants.PHARMACIES_IN_NETWORK.id, totalEntries = 5', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.PHARMACIES_IN_NETWORK.id}
        context={defaultLocation}
        pagination={{ totalEntries: 5 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        serviceType: null,
        facilityType: FacilitiesServicesConstants.PHARMACIES_IN_NETWORK.string,
        totalEntries: 5,
        location: defaultLocation,
      }),
    );
    wrapper.unmount();
  });

  it('should render header with FacilitiesServicesConstants.PHARMACIES_IN_NETWORK.id, totalEntries = 15, currentPage = 2, totalPages = 2', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.PHARMACIES_IN_NETWORK.id}
        context={defaultLocation}
        pagination={{ totalEntries: 15, currentPage: 2, totalPages: 2 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        facilityType: FacilitiesServicesConstants.PHARMACIES_IN_NETWORK.string,
        serviceType: null,
        totalEntries: 15,
        location: defaultLocation,
      }),
    );
    wrapper.unmount();
  });

  it('should render header with FacilitiesServicesConstants.CC_PROVIDER.id, totalEntries = 1', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.CC_PROVIDER.id}
        serviceType="foo"
        context={defaultLocation}
        specialtyMap={{ foo: 'test' }}
        pagination={{ totalEntries: 1 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        serviceType: 'test',
        facilityType: FacilitiesServicesConstants.CC_PROVIDER.string,
        totalEntries: 1,
        location: defaultLocation,
      }),
    );
    wrapper.unmount();
  });

  it('should render header with FacilitiesServicesConstants.CC_PROVIDER.id, totalEntries = 5', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.CC_PROVIDER.id}
        serviceType="foo"
        context={defaultLocation}
        specialtyMap={{ foo: 'test' }}
        pagination={{ totalEntries: 5 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        serviceType: 'test',
        facilityType: FacilitiesServicesConstants.CC_PROVIDER.string,
        totalEntries: 5,
        location: defaultLocation,
      }),
    );
    wrapper.unmount();
  });

  it('should render header with FacilitiesServicesConstants.CC_PROVIDER.id, totalEntries = 15, currentPage = 2, totalPages = 2', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.CC_PROVIDER.id}
        serviceType="foo"
        context={defaultLocation}
        specialtyMap={{ foo: 'test' }}
        pagination={{ totalEntries: 15, currentPage: 2, totalPages: 2 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        serviceType: 'test',
        facilityType: FacilitiesServicesConstants.CC_PROVIDER.string,
        totalEntries: 15,
        location: defaultLocation,
      }),
    );
    wrapper.unmount();
  });

  it('should render header with FacilitiesServicesConstants.BENEFITS.id, totalEntries = 1', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.BENEFITS.id}
        serviceType="ApplyingForBenefits"
        context={defaultLocation}
        pagination={{ totalEntries: 1 }}
      />,
    );

    // Benefits is in hasNoServices, so service type section is not rendered
    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        facilityType: FacilitiesServicesConstants.BENEFITS.string,
        serviceType: 'test',
        totalEntries: 1,
        location: defaultLocation,
      }),
    );
    wrapper.unmount();
  });

  it('should render header with FacilitiesServicesConstants.BENEFITS.id, totalEntries = 5', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.BENEFITS.id}
        serviceType="ApplyingForBenefits"
        context={defaultLocation}
        pagination={{ totalEntries: 5 }}
      />,
    );

    // Benefits is in hasNoServices, so service type section is not rendered
    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        facilityType: FacilitiesServicesConstants.BENEFITS.string,
        serviceType: 'test',
        totalEntries: 5,
        location: defaultLocation,
      }),
    );
    wrapper.unmount();
  });

  it('should render header with FacilitiesServicesConstants.BENEFITS.id, totalEntries = 15, currentPage = 2, totalPages = 2', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.BENEFITS.id}
        serviceType="ApplyingForBenefits"
        context={defaultLocation}
        pagination={{ totalEntries: 15, currentPage: 2, totalPages: 2 }}
      />,
    );

    // Benefits is in hasNoServices, so service type section is not rendered
    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        facilityType: FacilitiesServicesConstants.BENEFITS.string,
        serviceType: benefitsServices.ApplyingForBenefits,
        totalEntries: 15,
        location: defaultLocation,
      }),
    );
    wrapper.unmount();
  });

  it('FacilitiesServicesConstants.BENEFITS.id, serviceType null', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.BENEFITS.id}
        context={defaultLocation}
        pagination={{ totalEntries: 5 }}
      />,
    );

    // Benefits is in hasNoServices, so service type section is not rendered
    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        facilityType: FacilitiesServicesConstants.BENEFITS.string,
        serviceType: null,
        totalEntries: 5,
        location: defaultLocation,
      }),
    );
    wrapper.unmount();
  });

  it('FacilitiesServicesConstants.CEMETERY.id, totalEntries = 1', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.CEMETERY.id}
        context={defaultLocation}
        pagination={{ totalEntries: 1 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        facilityType: FacilitiesServicesConstants.CEMETERY.string,
        serviceType: null,
        totalEntries: 1,
        location: defaultLocation,
      }),
    );
    wrapper.unmount();
  });

  it('FacilitiesServicesConstants.CEMETERY.id, totalEntries = 5', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.CEMETERY.id}
        context={defaultLocation}
        pagination={{ totalEntries: 5 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        serviceType: null,
        facilityType: FacilitiesServicesConstants.CEMETERY.string,
        totalEntries: 5,
        location: defaultLocation,
      }),
    );
    wrapper.unmount();
  });

  it('FacilitiesServicesConstants.CEMETERY.id, totalEntries = 15, currentPage = 2, totalPages = 2', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.CEMETERY.id}
        context={defaultLocation}
        pagination={{ totalEntries: 15, currentPage: 2, totalPages: 2 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        serviceType: null,
        facilityType: FacilitiesServicesConstants.CEMETERY.string,
        totalEntries: 15,
        location: defaultLocation,
      }),
    );
    wrapper.unmount();
  });
  it('should refresh header with new results', () => {
    let wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.HEALTH.id}
        context={defaultLocation}
        pagination={{ totalEntries: 5 }}
      />,
    );
    wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        radius={STD_RADIUS}
        facilityType={FacilitiesServicesConstants.HEALTH.id}
        context={defaultLocation}
        pagination={{ totalEntries: 5 }}
      />,
    );

    expect(wrapper.find('h2').text()).to.match(
      createRegexString({
        radius: STD_RADIUS,
        serviceType: 'All VA health',
        facilityType: FacilitiesServicesConstants.HEALTH.string,
        totalEntries: 5,
        location: defaultLocation,
      }),
    );
    wrapper.unmount();
  });

  // TODO: find a way to unit test the React.memo behavior
});
