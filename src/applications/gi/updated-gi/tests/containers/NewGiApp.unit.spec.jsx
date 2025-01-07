import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import * as featureToggles from 'platform/utilities/feature-toggles';
import { mount } from 'enzyme';
import NewGiApp from '../../containers/NewGiApp';

describe('<HomePage />', () => {
  let useFeatureToggleStub;

  beforeEach(() => {
    useFeatureToggleStub = sinon.stub(featureToggles, 'useFeatureToggle');
  });

  it('should behave correctly when feature toggle is enabled', () => {
    useFeatureToggleStub.returns(true);

    const wrapper = mount(<NewGiApp />);
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
  });
});
