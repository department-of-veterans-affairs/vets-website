import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import * as featureToggles from 'platform/utilities/feature-toggles';
import { shallow } from 'enzyme';
import HomePage from '../../components/Homepage';

describe('<HomePage />', () => {
  let useFeatureToggleStub;

  beforeEach(() => {
    useFeatureToggleStub = sinon.stub(featureToggles, 'useFeatureToggle');
  });

  it('should behave correctly when feature toggle is enabled', () => {
    useFeatureToggleStub.returns(true);

    const wrapper = shallow(<HomePage />);
    expect(wrapper.find('[data-testid="comparison-tool-description"]').exists())
      .to.be.true;
    wrapper.unmount();
  });
});
