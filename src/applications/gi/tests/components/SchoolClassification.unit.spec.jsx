import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SchoolClassification from '../../components/SchoolClassification';

const defaultProps = {
  name: 'TEST INSTITUTION',
  displayTraits: true,
  type: 'FOR PROFIT',
  vetTecProvider: true,
  city: 'Test',
  state: 'TN',
  country: 'USA',
  ratingAverage: 2.5,
  cautionFlags: [],
  relaffil: null,
  menonly: 1,
  womenonly: 1,
  hbcu: 1,
  hsi: 1,
  nanti: 1,
  annhi: 1,
  aanapii: 1,
  pbi: 1,
  tribal: 1,
  locationResultCard: false,
  institution: {
    schoolProvider: 1,
    employerProvider: 1,
    vetTecProvider: 1,
    facilityCode: 1,
  },
};
describe('<SchoolClassification/>', () => {
  it('should render', () => {
    const wrapper = shallow(<SchoolClassification {...defaultProps} />);
    expect(wrapper.html()).to.not.be.undefined;
    const institutionTraits = wrapper.instance()?.institutionTraits;
    expect(institutionTraits).to.deep.equal(undefined);
    wrapper.unmount();
  });
});
