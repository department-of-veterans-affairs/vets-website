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
    expect(wrapper).to.matchSnapshot();
    wrapper.unmount();
  });
});
