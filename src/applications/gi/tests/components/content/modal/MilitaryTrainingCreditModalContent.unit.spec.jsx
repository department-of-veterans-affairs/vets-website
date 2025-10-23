import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import MilitaryTrainingCreditModalContent from '../../../../components/content/modals/MilitaryTrainingCreditModalContent';

describe('MilitaryTrainingCreditModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<MilitaryTrainingCreditModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
