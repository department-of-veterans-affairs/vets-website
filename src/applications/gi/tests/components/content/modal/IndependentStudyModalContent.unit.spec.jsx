import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import IndependentStudyModalContent from '../../../../components/content/modals/IndependentStudyModalContent';

describe('IndependentStudyModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<IndependentStudyModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
