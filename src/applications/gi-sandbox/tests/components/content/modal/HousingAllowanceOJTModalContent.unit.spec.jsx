import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import HousingAllowanceOJTModalContent from '../../../../components/content/modals/HousingAllowanceOJTModalContent';

describe('HousingAllowanceOJTModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<HousingAllowanceOJTModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
