import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import IntroductionPage from '../../../containers/IntroductionPage';

import { createFakeIntroductionPageStore } from './utils';

describe('health care questionnaire - introduction page  -', () => {
  it('does not have a saved form', () => {
    const fakeStore = createFakeIntroductionPageStore({
      formId: 'my-test-form',
      savedForms: [],
      appointmentInThePast: false,
    });
    const wrapper = mount(<IntroductionPage store={fakeStore} />);

    expect(wrapper.find('[data-testid="sign-in-header"]').text()).to.equal(
      'Please sign in to start your questions',
    );
    wrapper.unmount();
  });
});
