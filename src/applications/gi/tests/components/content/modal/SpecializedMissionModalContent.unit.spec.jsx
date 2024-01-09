import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// import environment from 'platform/utilities/environment';

import SpecializedMissionModalContent from '../../../../components/content/modals/SpecializedMissionModalContent';

describe('SpecializedMissionModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<SpecializedMissionModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
