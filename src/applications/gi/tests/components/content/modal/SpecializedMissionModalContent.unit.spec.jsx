import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SpecializedMissionModalContent from '../../../../components/content/modals/SpecializedMissionModalContent';

describe('SpecializedMissionModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<SpecializedMissionModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
  it('should render', () => {
    global.window.buildType = true;
    const wrapper = shallow(<SpecializedMissionModalContent />);
    expect(wrapper.find('h3').text()).to.equal('Specialized mission');
    wrapper.unmount();
  });
});
