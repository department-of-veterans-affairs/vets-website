import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import * as featureToggles from 'platform/utilities/feature-toggles';
import { shallow } from 'enzyme';
import LinkWithDescription from '../../components/LinkWithDescription';

describe('<HomePage />', () => {
  let useFeatureToggleStub;

  beforeEach(() => {
    useFeatureToggleStub = sinon.stub(featureToggles, 'useFeatureToggle');
  });

  it('Link should display when feature toggle is enabled', () => {
    useFeatureToggleStub.returns(true);

    const wrapper = shallow(<LinkWithDescription />);
    expect(wrapper.find('.comparison-tool-link').exists()).to.be.true;
    wrapper.unmount();
  });
});
