import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import IpedsCodeModalContent from '../../../../components/content/modals/IpedsCodeModalContent';

describe('IpedsCodeModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<IpedsCodeModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
