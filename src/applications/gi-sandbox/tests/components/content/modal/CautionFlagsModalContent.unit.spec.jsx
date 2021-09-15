import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CautionFlagsModalContent from '../../../../components/content/modals/CautionFlagsModalContent';

describe('CautionFlagsModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<CautionFlagsModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
