import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import TuitionAndFeesModalContent from '../../../../components/content/modals/TuitionAndFeesModalContent';

describe('TuitionAndFeesModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<TuitionAndFeesModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
