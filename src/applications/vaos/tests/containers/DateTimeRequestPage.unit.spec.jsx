import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DateTimeRequestPage } from '../../containers/DateTimeRequestPage';

describe('VAOS <DateTimeRequestPage>', () => {
  it('should render', () => {
    const openFormPage = sinon.spy();
    const updateFormData = sinon.spy();

    const form = mount(
      <DateTimeRequestPage
        openFormPage={openFormPage}
        updateFormData={updateFormData}
        data={{}}
      />,
    );

    expect(form.find('CalendarWidget').length).to.equal(1);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const openFormPage = sinon.spy();
    const updateFormData = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <DateTimeRequestPage
        openFormPage={openFormPage}
        updateFormData={updateFormData}
        data={{}}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
      />,
    );

    form.find('form').simulate('submit');
    expect(routeToNextAppointmentPage.called).to.be.false;
    form.unmount();
  });

  it('should submit with selected data', () => {
    const openFormPage = sinon.spy();
    const updateFormData = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <DateTimeRequestPage
        openFormPage={openFormPage}
        updateFormData={updateFormData}
        data={{
          calendarData: {
            selectedDates: [{ date: '2019-10-30', optionTime: 'AM' }],
          },
        }}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
      />,
    );

    form.find('form').simulate('submit');
    expect(routeToNextAppointmentPage.called).to.be.true;
    form.unmount();
  });
});
