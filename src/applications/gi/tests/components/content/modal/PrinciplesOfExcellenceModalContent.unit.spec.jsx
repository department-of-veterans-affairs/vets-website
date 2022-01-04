import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import PrinciplesOfExcellenceModalContent from '../../../../components/content/modals/PrinciplesOfExcellenceModalContent';

describe('PrinciplesOfExcellenceModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<PrinciplesOfExcellenceModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
