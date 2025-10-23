import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import HousingAllowanceSchoolModalContent from '../../../../components/content/modals/HousingAllowanceSchoolModalContent';

describe('HousingAllowanceSchoolModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<HousingAllowanceSchoolModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
