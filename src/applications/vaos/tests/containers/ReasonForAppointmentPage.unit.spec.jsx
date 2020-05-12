import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { selectRadio } from 'platform/testing/unit/schemaform-utils.jsx';
import { ReasonForAppointmentPage } from '../../containers/ReasonForAppointmentPage';

describe('VAOS <ReasonForAppointmentPage>', () => {
  it('should render', () => {
    const openReasonForAppointment = sinon.spy();
    const updateReasonForAppointmentData = sinon.spy();

    const form = mount(
      <ReasonForAppointmentPage
        openReasonForAppointment={openReasonForAppointment}
        updateReasonForAppointmentData={updateReasonForAppointmentData}
        data={{}}
      />,
    );

    expect(form.find('input').length).to.equal(4);
    expect(form.find('textarea').length).to.equal(1);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const openReasonForAppointment = sinon.spy();
    const router = {
      push: sinon.spy(),
    };

    const form = mount(
      <ReasonForAppointmentPage
        openReasonForAppointment={openReasonForAppointment}
        router={router}
        data={{}}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('AlertBox').length).to.equal(1);

    expect(form.find('.usa-input-error').length).to.equal(2);
    expect(router.push.called).to.be.false;
    form.unmount();
  });

  it('should call updateReasonForAppointmentData after change', () => {
    const openReasonForAppointment = sinon.spy();
    const updateReasonForAppointmentData = sinon.spy();
    const router = {
      push: sinon.spy(),
    };

    const form = mount(
      <ReasonForAppointmentPage
        openReasonForAppointment={openReasonForAppointment}
        updateReasonForAppointmentData={updateReasonForAppointmentData}
        router={router}
        data={{}}
      />,
    );

    selectRadio(form, 'root_reasonForAppointment', 'routine-follow-up');

    expect(
      updateReasonForAppointmentData.firstCall.args[2].reasonForAppointment,
    ).to.equal('routine-follow-up');
    form.unmount();
  });

  it('should submit with valid data', () => {
    const openReasonForAppointment = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <ReasonForAppointmentPage
        openReasonForAppointment={openReasonForAppointment}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
        data={{
          reasonForAppointment: 'routine-follow-up',
          reasonAdditionalInfo: 'test',
        }}
      />,
    );
    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);

    form.unmount();
  });

  it('should render alert message', () => {
    const openReasonForAppointment = sinon.spy();
    const updateReasonForAppointmentData = sinon.spy();

    const form = mount(
      <ReasonForAppointmentPage
        openReasonForAppointment={openReasonForAppointment}
        updateReasonForAppointmentData={updateReasonForAppointmentData}
        data={{}}
      />,
    );
    expect(form.text()).to.contain(
      'If you have an urgent medical need, please',
    );

    form.unmount();
  });

  it('document title should match h1 text', () => {
    const openReasonForAppointment = sinon.spy();
    const updateReasonForAppointmentData = sinon.spy();
    const pageTitle = 'Choose a reason for your appointment';

    const form = mount(
      <ReasonForAppointmentPage
        openReasonForAppointment={openReasonForAppointment}
        updateReasonForAppointmentData={updateReasonForAppointmentData}
        data={{}}
      />,
    );

    expect(form.find('h1').text()).to.equal(pageTitle);
    expect(document.title).contain(pageTitle);

    form.unmount();
  });

  it('should show error msg when enter all spaces', () => {
    const openReasonForAppointment = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <ReasonForAppointmentPage
        openReasonForAppointment={openReasonForAppointment}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
        data={{
          reasonForAppointment: 'routine-follow-up',
          reasonAdditionalInfo: '   ',
        }}
      />,
    );
    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error-message').length).to.equal(1);

    form.unmount();
  });
});
