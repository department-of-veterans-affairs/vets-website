import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import AllCampusesModalContent from '../../../../components/content/modals/AllCampusesModalContent';

describe('AllCampusesModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<AllCampusesModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
