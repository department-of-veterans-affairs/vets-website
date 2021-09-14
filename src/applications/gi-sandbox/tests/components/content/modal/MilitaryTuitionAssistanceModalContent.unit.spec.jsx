import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import MilitaryTuitionAssistanceModalContent from '../../../../components/content/modals/MilitaryTuitionAssistanceModalContent';

describe('MilitaryTuitionAssistanceModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<MilitaryTuitionAssistanceModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
