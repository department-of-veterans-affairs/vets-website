import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import IntroductionProcessList from '../../../components/IntroductionProcessList';

const mockStore = configureStore([]);

describe('IntroductionProcessList (connected)', () => {
  let wrapper;
  const mountWithFlag = flag => {
    const store = mockStore({
      featureToggles: {
        [FEATURE_FLAG_NAMES.showMeb54901990eTextUpdate]: flag,
      },
    });
    wrapper = mount(
      <Provider store={store}>
        <IntroductionProcessList />
      </Provider>,
    );
    return wrapper;
  };

  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
  });

  it('renders original content when flag is off', () => {
    const w = mountWithFlag(false);
    expect(
      w
        .find('va-additional-info')
        .first()
        .prop('trigger'),
    ).to.equal('What are the Post-9/11 GI Bill eligibility requirements?');
  });

  it('renders updated content when flag is on', () => {
    const w = mountWithFlag(true);
    expect(
      w
        .find('va-additional-info')
        .first()
        .prop('trigger'),
    ).to.include('(Chapter 33)');
  });
});
