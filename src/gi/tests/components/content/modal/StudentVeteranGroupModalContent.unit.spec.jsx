import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import StudentVeteranGroupModalContent from '../../../../components/content/modals/StudentVeteranGroupModalContent';

describe('StudentVeteranGroupModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<StudentVeteranGroupModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
