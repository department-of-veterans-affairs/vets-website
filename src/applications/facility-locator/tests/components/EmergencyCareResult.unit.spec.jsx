import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import EmergencyCareResult from '../../components/search-results-items/EmergencyCareResult';
import VaFacilityResult from '../../components/search-results-items/VaFacilityResult';
import testData from '../../constants/mock-emergency-care-mashup-data.json';

describe('EmergencyCareResult', () => {
  it('Should render EmergencyCareResult non VA', () => {
    const query = {
      facilityType: 'emergency_care',
      serviceType: 'NonVAEmergencyCare',
    };

    const wrapper = shallow(
      <EmergencyCareResult provider={testData.data[3]} query={query} />,
    );

    expect(wrapper.find('LocationDistance').length).to.equal(1);
    expect(wrapper.find('LocationMarker').length).to.equal(1);
    expect(wrapper.find('LocationAddress').length).to.equal(1);
    expect(wrapper.find('LocationDirectionsLink').length).to.equal(1);
    expect(wrapper.find('LocationPhoneLink').length).to.equal(1);
    expect(wrapper.find('.facility-result h3').text()).to.equal(
      'DALLAS MEDICAL CENTER LLC',
    );
    expect(wrapper.find('.facility-result h3 Link').length).to.equal(0);
    expect(wrapper.find('a.emergency-care-link').length).to.equal(1);
    wrapper.unmount();
  });

  it('Should render EmergencyCareResult VA', () => {
    const query = {
      facilityType: 'emergency_care',
      serviceType: 'EmergencyCare',
    };

    const wrapper = shallow(
      <VaFacilityResult location={testData.data[0]} query={query} />,
    );

    expect(wrapper.find('LocationDistance').length).to.equal(1);
    expect(wrapper.find('LocationMarker').length).to.equal(1);
    expect(wrapper.find('LocationAddress').length).to.equal(1);
    expect(wrapper.find('LocationDirectionsLink').length).to.equal(1);
    expect(wrapper.find('LocationPhoneLink').length).to.equal(1);
    expect(wrapper.find('.facility-result h3 Link').props().children).to.equal(
      'Manhattan VA Medical Center',
    );
    expect(wrapper.find('.facility-result h3 Link').length).to.equal(1);
    expect(wrapper.find('a.emergency-care-link').length).to.equal(0);
    wrapper.unmount();
  });
});
