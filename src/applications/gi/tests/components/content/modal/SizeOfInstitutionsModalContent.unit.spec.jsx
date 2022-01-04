import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SizeOfInstitutionsModalContent from '../../../../components/content/modals/SizeOfInstitutionsModalContent';

describe('SizeOfInstitutionsModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<SizeOfInstitutionsModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
