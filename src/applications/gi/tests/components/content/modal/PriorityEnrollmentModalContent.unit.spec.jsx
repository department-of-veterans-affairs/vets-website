import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import PriorityEnrollmentModalContent from '../../../../components/content/modals/PriorityEnrollmentModalContent';

describe('PriorityEnrollmentModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<PriorityEnrollmentModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
