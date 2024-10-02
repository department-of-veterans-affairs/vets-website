import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import PharmacyResult from '../../components/search-results-items/PharmacyResult';
import testData from '../../constants/mock-facility-data-v1.json';

describe('PharmacyResult', () => {
  it('Should render PharmacyResult', () => {
    const query = {
      facilityType: 'pharmacy',
    };

    const wrapper = shallow(
      <PharmacyResult provider={testData.data[9]} query={query} />,
    );

    expect(wrapper.find('LocationDistance').length).to.equal(1);
    expect(wrapper.find('LocationMarker').length).to.equal(1);
    expect(wrapper.find('LocationAddress').length).to.equal(1);
    expect(wrapper.find('LocationDirectionsLink').length).to.equal(1);
    expect(wrapper.find('LocationPhoneLink').length).to.equal(1);
    expect(wrapper.find('.facility-result h3').text()).to.equal('CVS');
    expect(wrapper.find('.facility-result va-link').length).to.equal(0);
    expect(wrapper.find('LocationOperationStatus').length).to.equal(0);
    wrapper.unmount();
  });
});
