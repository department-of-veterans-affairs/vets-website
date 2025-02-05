import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import * as featureToggles from 'platform/utilities/feature-toggles';
import { shallow } from 'enzyme';
import InfoDisclaimer from '../../components/InfoDisclaimer';

describe('<HomePage />', () => {
  let useFeatureToggleStub;

  beforeEach(() => {
    useFeatureToggleStub = sinon.stub(featureToggles, 'useFeatureToggle');
  });

  it('should behave correctly when feature toggle is enabled', () => {
    useFeatureToggleStub.returns(true);

    const wrapper = shallow(<InfoDisclaimer />);
    expect(wrapper.find('[data-testid="info-disclaimer"]').exists()).to.be.true;
    wrapper.unmount();
  });
});
