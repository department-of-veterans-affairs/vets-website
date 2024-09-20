import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import UrgentCareResult from '../../components/search-results-items/UrgentCareResult';
import testData from '../../constants/mock-urgent-care-mashup-data.json';

describe('UrgentCareResult', () => {
  it('Should render UrgentCareResult non VA', () => {
    const query = {
      facilityType: 'urgent_care',
      serviceType: 'NonVAUrgentCare',
    };

    const wrapper = shallow(
      <UrgentCareResult provider={testData.data[4]} query={query} />,
    );

    expect(wrapper.find('LocationDistance').length).to.equal(1);
    expect(wrapper.find('LocationMarker').length).to.equal(1);
    expect(wrapper.find('LocationAddress').length).to.equal(1);
    expect(wrapper.find('LocationDirectionsLink').length).to.equal(1);
    expect(wrapper.find('LocationPhoneLink').length).to.equal(1);
    expect(wrapper.find('.facility-result h3').text()).to.equal(
      'FastMed Urgent Care',
    );
    expect(wrapper.find('.facility-result h3 a').length).to.equal(0);
    expect(wrapper.find('LocationOperationStatus').length).to.equal(0);

    wrapper.unmount();
  });

  it('Should render UrgentCareResult VA', () => {
    const query = {
      facilityType: 'urgent_care',
      serviceType: 'UrgentCare',
    };

    const wrapper = shallow(
      <UrgentCareResult provider={testData.data[1]} query={query} />,
    );

    expect(wrapper.find('LocationDistance').length).to.equal(1);
    expect(wrapper.find('LocationMarker').length).to.equal(1);
    expect(wrapper.find('LocationAddress').length).to.equal(1);
    expect(wrapper.find('LocationDirectionsLink').length).to.equal(1);
    expect(wrapper.find('LocationPhoneLink').length).to.equal(1);
    expect(wrapper.find('.facility-result h3').text()).to.equal(
      "Overton Brooks Veterans' Administration Medical Center",
    );
    expect(wrapper.find('.facility-result h3 a').length).to.equal(0);
    expect(wrapper.find('LocationOperationStatus').length).to.equal(0);

    wrapper.unmount();
  });
});
