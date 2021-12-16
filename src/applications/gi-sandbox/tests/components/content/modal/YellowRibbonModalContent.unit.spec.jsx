import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import YellowRibbonModalContent from '../../../../components/content/modals/YellowRibbonModalContent';

describe('YellowRibbonModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<YellowRibbonModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
