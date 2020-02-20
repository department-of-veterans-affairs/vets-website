import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DateTimeRequestPage } from '../../containers/DateTimeRequestPage';

describe('VAOS <DateTimeRequestPage>', () => {
  it('should render', () => {
    const clearCalendarData = sinon.spy();
    const onCalendarChange = sinon.spy();
    const validateCalendar = sinon.spy();

    const form = mount(
      <DateTimeRequestPage
        clearCalendarData={clearCalendarData}
        data={{ calendarData: {} }}
        onCalendarChange={onCalendarChange}
        validateCalendar={validateCalendar}
      />,
    );

    expect(form.find('CalendarWidget').length).to.equal(1);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const clearCalendarData = sinon.spy();
    const onCalendarChange = sinon.spy();
    const validateCalendar = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <DateTimeRequestPage
        onCalendarChange={onCalendarChange}
        clearCalendarData={clearCalendarData}
        data={{ calendarData: {} }}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
        validateCalendar={validateCalendar}
      />,
    );

    form
      .find('FormButtons')
      .find('button[type="submit"]')
      .simulate('click');
    expect(routeToNextAppointmentPage.called).to.be.false;
    form.unmount();
  });

  it('should not submit form with validation error', () => {
    const clearCalendarData = sinon.spy();
    const onCalendarChange = sinon.spy();
    const validateCalendar = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <DateTimeRequestPage
        clearCalendarData={clearCalendarData}
        onCalendarChange={onCalendarChange}
        data={{
          calendarData: { currentlySelectedDate: '2020-12-20', error: 'test' },
        }}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
        validateCalendar={validateCalendar}
      />,
    );

    form
      .find('FormButtons')
      .find('button[type="submit"]')
      .simulate('click');
    expect(routeToNextAppointmentPage.called).to.be.false;
    form.unmount();
  });

  it('should submit with selected data', () => {
    const clearCalendarData = sinon.spy();
    const onCalendarChange = sinon.spy();
    const validateCalendar = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <DateTimeRequestPage
        onCalendarChange={onCalendarChange}
        validateCalendar={validateCalendar}
        clearCalendarData={clearCalendarData}
        data={{
          calendarData: {
            selectedDates: [{ date: '2019-10-30', optionTime: 'AM' }],
          },
        }}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
      />,
    );

    form
      .find('FormButtons')
      .find('button[type="submit"]')
      .simulate('click');
    expect(routeToNextAppointmentPage.called).to.be.true;
    form.unmount();
  });

  it('document title should match h1 text', () => {
    const clearCalendarData = sinon.spy();
    const onCalendarChange = sinon.spy();
    const validateCalendar = sinon.spy();
    const pageTitle = 'Choose a day and time for your appointment';

    const form = mount(
      <DateTimeRequestPage
        onCalendarChange={onCalendarChange}
        clearCalendarData={clearCalendarData}
        validateCalendar={validateCalendar}
        data={{ calendarData: {} }}
      />,
    );

    expect(form.find('h1').text()).to.equal(pageTitle);
    expect(document.title).to.contain(pageTitle);
    form.unmount();
  });
});
