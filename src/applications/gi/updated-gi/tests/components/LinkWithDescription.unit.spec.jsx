import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import * as featureToggles from 'platform/utilities/feature-toggles';
import { mount } from 'enzyme';
import LinkWithDescription from '../../components/LinkWithDescription';

describe('<HomePage />', () => {
  let useFeatureToggleStub;

  beforeEach(() => {
    useFeatureToggleStub = sinon.stub(featureToggles, 'useFeatureToggle');
  });

  it('should behave correctly when feature toggle is enabled', () => {
    useFeatureToggleStub.returns(true);

    const wrapper = mount(<LinkWithDescription />);
    expect(wrapper.find('VaLink').exists()).to.be.true;
    wrapper.unmount();
  });
});
