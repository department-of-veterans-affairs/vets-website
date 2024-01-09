import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SpecializedMissionModalContent from '../../../../components/content/modals/SpecializedMissionModalContent';

describe('SpecializedMissionModalContent modal', () => {
  beforeEach(() => {
    global.window.buildType = true;
  });
  afterEach(() => {
    global.window.buildType = false;
  });
  it('should render', () => {
    const wrapper = shallow(<SpecializedMissionModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
  it('should render Specialized mission', () => {
    const wrapper = shallow(<SpecializedMissionModalContent />);
    expect(wrapper.find('h3').text()).to.equal('Specialized mission');
    wrapper.unmount();
  });
});
