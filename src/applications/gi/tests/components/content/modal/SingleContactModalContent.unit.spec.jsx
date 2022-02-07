import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SingleContactModalContent from '../../../../components/content/modals/SingleContactModalContent';

describe('SingleContactModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<SingleContactModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
