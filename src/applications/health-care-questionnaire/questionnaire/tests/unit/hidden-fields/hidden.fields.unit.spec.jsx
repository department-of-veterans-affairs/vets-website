import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import HiddenFields from '../../../components/hidden-fields/HiddenFields';

import { createFakeHiddenFieldStore } from '../utils/createFakeStores';

describe('health care questionnaire - reason for visit - visit page -', () => {
  it('both ids are present', () => {
    const onChange = sinon.spy();
    const delay = sinon.spy();
    const fakeStore = createFakeHiddenFieldStore({
      appointmentId: 'appointment-123',
      questionnaireId: 'questionnaire-123',
    });
    const wrapper = mount(
      <HiddenFields store={fakeStore} onChange={onChange} delay={delay} />,
    );
    expect(delay.called).to.be.true;
    const lastCalled = delay.lastCall;

    // call the onChange function to test the onChange
    // is being called with the correct values
    const setFunction = lastCalled.args[0];
    setFunction();
    expect(onChange.called).to.be.true;
    const onChangeArgs = onChange.firstCall.args[0];
    expect(onChangeArgs.appointmentId).to.equal('appointment-123');
    expect(onChangeArgs.questionnaireId).to.equal('questionnaire-123');
    wrapper.unmount();
  });
  it('questionnaire id is missing', () => {
    const onChange = sinon.spy();
    const delay = sinon.spy();
    const fakeStore = createFakeHiddenFieldStore({
      appointmentId: 'appointment-123',
    });
    const wrapper = mount(
      <HiddenFields store={fakeStore} onChange={onChange} delay={delay} />,
    );
    expect(delay.called).to.be.false;
    wrapper.unmount();
  });
  it('appointment id is missing', () => {
    const onChange = sinon.spy();
    const delay = sinon.spy();
    const fakeStore = createFakeHiddenFieldStore({
      questionnaireId: 'questionnaire-123',
    });
    const wrapper = mount(
      <HiddenFields store={fakeStore} onChange={onChange} delay={delay} />,
    );
    expect(delay.called).to.be.false;
    wrapper.unmount();
  });
  it('both ids are missing', () => {
    const onChange = sinon.spy();
    const delay = sinon.spy();
    const fakeStore = createFakeHiddenFieldStore({
      appointmentId: undefined,
      questionnaireId: undefined,
    });
    const wrapper = mount(
      <HiddenFields store={fakeStore} onChange={onChange} delay={delay} />,
    );
    expect(delay.called).to.be.false;
    wrapper.unmount();
  });
});
