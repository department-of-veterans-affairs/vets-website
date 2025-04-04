import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Covid19Result from '../../../components/search-results-items/Covid19Result';
import testData from '../../../constants/mock-facility-v1-covid19.json';

describe('Covid19Result', () => {
  it('Should render with facility type health', () => {
    const wrapper = shallow(<Covid19Result location={testData.data[0]} />);

    expect(wrapper.find('LocationDistance').length).to.equal(1);
    expect(wrapper.find('LocationMarker').length).to.equal(1);
    expect(wrapper.find('LocationAddress').length).to.equal(1);
    expect(wrapper.find('LocationDirectionsLink').length).to.equal(1);
    expect(wrapper.find('Covid19PhoneLink').length).to.equal(1);
    expect(wrapper.find('.facility-result Link').html()).to.equal(
      '<a>Brier Creek VA Clinic</a>',
    );
    expect(wrapper.find('LocationOperationStatus').length).to.equal(0);
    wrapper.unmount();
  });
});
