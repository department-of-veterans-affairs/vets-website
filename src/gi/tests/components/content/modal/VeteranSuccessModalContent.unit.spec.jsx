import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import VeteranSuccessModalContent from '../../../../components/content/modals/VeteranSuccessModalContent';

describe('VeteranSuccessModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<VeteranSuccessModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
