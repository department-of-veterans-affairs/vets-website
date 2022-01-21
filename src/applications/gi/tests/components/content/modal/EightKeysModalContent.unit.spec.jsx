import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import EightKeysModalContent from '../../../../components/content/modals/EightKeysModalContent';

describe('EightKeysModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<EightKeysModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
