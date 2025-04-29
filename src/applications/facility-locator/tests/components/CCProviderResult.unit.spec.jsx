import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import CCProviderResult from '../../components/search-results-items/CCProviderResult';
import testData from '../../constants/mock-facility-data-v1.json';

describe('CCProviderResult', () => {
  it('Should render CCProviderResult, serviceType Dentist', () => {
    const query = {
      facilityType: 'provider',
      serviceType: '122300000X', // Dentist
    };

    const wrapper = shallow(
      <CCProviderResult provider={testData.data[10]} query={query} />,
    );

    expect(wrapper.find('LocationDistance').length).to.equal(1);
    expect(wrapper.find('LocationMarker').length).to.equal(1);
    expect(wrapper.find('LocationAddress').length).to.equal(1);
    expect(wrapper.find('LocationDirectionsLink').length).to.equal(1);
    expect(wrapper.find('LocationPhoneLink').length).to.equal(1);
    expect(wrapper.find('.facility-result h3').text()).to.equal('BADEA, LUANA');
    expect(wrapper.find('.facility-result va-link').length).to.equal(0);
    expect(wrapper.find('LocationOperationStatus').length).to.equal(0);

    wrapper.unmount();
  });
});
