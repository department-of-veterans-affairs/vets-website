import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import CCProviderResult from '../../components/search-results-items/CCProviderResult';
import testData from '../../constants/mock-facility-data-v1.json';

describe('CCProviderSearch', () => {
  it('Should render UrgentCareResult non VA', () => {
    const query = {
      facilityType: 'provider',
      serviceType: '122300000X', // Dentist
    };
    const wrapper = shallow(
      <CCProviderResult provider={testData.data[10]} query={query} />,
    );
    expect(wrapper).to.matchSnapshot();
    wrapper.unmount();
  });
});
