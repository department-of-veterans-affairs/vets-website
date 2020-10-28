import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import IntroductionPage from '../../../containers/IntroductionPage';

import { createFakeIntroductionPageStore } from '../utils/createFakeStores';

describe('healthcare-questionnaire - introduction page  -', () => {
  it('does not have a saved form', () => {
    const fakeStore = createFakeIntroductionPageStore('my-test-form', []);
    const wrapper = mount(<IntroductionPage store={fakeStore} />);

    expect(wrapper.find('[data-testid="sign-in-header"]').text()).to.equal(
      'Please sign in to start your questionnaire',
    );
    wrapper.unmount();
  });
});
