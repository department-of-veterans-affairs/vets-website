import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SchoolClassification from '../../components/SchoolClassification';

const defaultProps = {
  institution: {
    name: 'TEST INSTITUTION',
    type: 'FOR PROFIT',
    vetTecProvider: true,
    city: 'Test',
    state: 'TN',
    country: 'USA',
    ratingAverage: 2.5,
    cautionFlags: [],
    menonly: 0,
    relaffil: null,
    womenonly: 0,
  },
};
describe('<SchoolClassification/>', () => {
  it('should render', () => {
    const wrapper = shallow(<SchoolClassification {...defaultProps} />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
