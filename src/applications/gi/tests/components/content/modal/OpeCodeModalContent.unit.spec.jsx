import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import OpeCodeModalContent from '../../../../components/content/modals/OpeCodeModalContent';

describe('OpeCodeModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<OpeCodeModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
