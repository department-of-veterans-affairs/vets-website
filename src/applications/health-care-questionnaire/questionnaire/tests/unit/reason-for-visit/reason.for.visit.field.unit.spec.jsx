import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import ReasonForVisitField from '../../../components/reason-for-visit/ReasonForVisitField';

import { createFakeReasonForVisitStore } from '../utils/createFakeStores';

describe('health care questionnaire - reason for visit - visit page -', () => {
  it('reason for visit exists', () => {
    const fakeStore = createFakeReasonForVisitStore({
      reason: 'Follow-up/Routine:yes i have a reason',
    });
    const wrapper = mount(<ReasonForVisitField store={fakeStore} />);
    expect(wrapper.find('[data-testid="reason-for-visit"]').exists()).to.be
      .true;
    wrapper.unmount();
  });
  it('reason for visit does not exist', () => {
    const fakeStore = createFakeReasonForVisitStore({
      reason: '',
    });
    const wrapper = mount(<ReasonForVisitField store={fakeStore} />);
    expect(wrapper.find('[data-testid="reason-for-visit"]').exists()).to.be
      .false;
    wrapper.unmount();
  });
});
