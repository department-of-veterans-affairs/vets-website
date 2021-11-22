import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import ReasonForVisitField from '../ReasonForVisitField';

import { createFakeReasonForVisitStore } from './utils';

describe('health care questionnaire - reason for visit - visit page -', () => {
  it('reason for visit exists', () => {
    const onChange = sinon.spy();

    const fakeStore = createFakeReasonForVisitStore({
      reason: 'Follow-up/Routine:yes i have a reason',
    });
    const wrapper = mount(
      <ReasonForVisitField store={fakeStore} onChange={onChange} />,
    );
    expect(wrapper.find('[data-testid="reason-for-visit"]').exists()).to.be
      .true;
    expect(onChange.called).to.be.true;
    expect(onChange.calledWith('Routine or follow-up visit')).to.be.true;
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
