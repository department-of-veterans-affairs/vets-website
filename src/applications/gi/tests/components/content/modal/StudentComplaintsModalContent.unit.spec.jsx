import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import StudentComplaintsModalContent from '../../../../components/content/modals/StudentComplaintsModalContent';

describe('StudentComplaintsModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<StudentComplaintsModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
