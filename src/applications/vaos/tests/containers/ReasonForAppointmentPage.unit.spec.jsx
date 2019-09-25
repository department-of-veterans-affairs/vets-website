import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { selectRadio } from 'platform/testing/unit/schemaform-utils.jsx';
import { ReasonForAppointmentPage } from '../../containers/ReasonForAppointmentPage';
import { PURPOSE_TEXT } from '../../utils/constants';

describe('VAOS <ReasonForAppointmentPage>', () => {
  it('should render', () => {
    const openFormPage = sinon.spy();
    const updateFormData = sinon.spy();

    const form = mount(
      <ReasonForAppointmentPage
        openFormPage={openFormPage}
        updateFormData={updateFormData}
        data={{}}
      />,
    );

    expect(form.find('input').length).to.equal(3);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const openFormPage = sinon.spy();
    const router = {
      push: sinon.spy(),
    };

    const form = mount(
      <ReasonForAppointmentPage
        openFormPage={openFormPage}
        router={router}
        data={{}}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(router.push.called).to.be.false;
    form.unmount();
  });

  it('should call updateFormData after change', () => {
    const openFormPage = sinon.spy();
    const updateFormData = sinon.spy();
    const router = {
      push: sinon.spy(),
    };

    const form = mount(
      <ReasonForAppointmentPage
        openFormPage={openFormPage}
        updateFormData={updateFormData}
        router={router}
        data={{}}
      />,
    );

    selectRadio(
      form,
      'root_reasonForAppointment',
      PURPOSE_TEXT['routine-follow-up'],
    );

    expect(updateFormData.firstCall.args[2].reasonForAppointment).to.equal(
      PURPOSE_TEXT['routine-follow-up'],
    );
    form.unmount();
  });

  xit('should submit with valid data', () => {
    const openFormPage = sinon.spy();
    const router = {
      push: sinon.spy(),
    };

    const form = mount(
      <ReasonForAppointmentPage
        openFormPage={openFormPage}
        router={router}
        data={{ reasonForAppointment: PURPOSE_TEXT['routine-rollow-up'] }}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(router.push.called).to.be.true;
    form.unmount();
  });
});
