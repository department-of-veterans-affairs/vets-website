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
    expect(wrapper).to.matchSnapshot();
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
    expect(wrapper).to.matchSnapshot();
    wrapper.unmount();
  });
});
