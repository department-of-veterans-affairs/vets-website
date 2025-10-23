import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import GiBillStudentsModalContent from '../../../../components/content/modals/GiBillStudentsModalContent';

describe('GiBillStudentsModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<GiBillStudentsModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
