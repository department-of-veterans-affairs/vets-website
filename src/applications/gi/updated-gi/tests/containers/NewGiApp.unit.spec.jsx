import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import * as featureToggles from 'platform/utilities/feature-toggles';
import { shallow } from 'enzyme';
import NewGiApp from '../../containers/NewGiApp';

describe('<HomePage />', () => {
  let useFeatureToggleStub;

  beforeEach(() => {
    useFeatureToggleStub = sinon.stub(featureToggles, 'useFeatureToggle');
  });

  it('New Gi App should load when feature toggle is enabled', () => {
    useFeatureToggleStub.returns(true);

    const wrapper = shallow(<NewGiApp />);
    expect(wrapper.find('.gi-bill-container').exists()).to.be.true;
    wrapper.unmount();
  });
});
