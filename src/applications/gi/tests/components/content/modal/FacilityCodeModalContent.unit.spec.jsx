import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import FacilityCodeModalContent from '../../../../components/content/modals/FacilityCodeModalContent';

describe('FacilityCodeModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<FacilityCodeModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
