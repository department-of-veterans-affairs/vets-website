import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import IntroductionPage from '../../../containers/IntroductionPage';

import { createFakeIntroductionPageStore } from './utils';

describe('health care questionnaire - introduction page  -', () => {
  it('appointment is in the past', () => {
    const fakeStore = createFakeIntroductionPageStore({
      formId: 'my-test-form',
      savedForms: [],
      appointmentInThePast: true,
    });
    const wrapper = mount(<IntroductionPage store={fakeStore} />);

    expect(wrapper.find('.schemaform-sip-alert-title').text()).to.contain(
      'Your questionnaire has expired',
    );
    wrapper.unmount();
  });
  it('appointment is in the future', () => {
    const fakeStore = createFakeIntroductionPageStore({
      formId: 'my-test-form',
      savedForms: [],
      appointmentInThePast: false,
      isLoggedIn: true,
    });
    const wrapper = mount(<IntroductionPage store={fakeStore} />);

    expect(wrapper.find('.schemaform-sip-alert').text()).to.contain(
      'Note: Since you’re signed in to your account, we can prefill part of your question',
    );
    wrapper.unmount();
  });
});
