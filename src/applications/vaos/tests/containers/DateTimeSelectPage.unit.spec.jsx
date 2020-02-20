import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DateTimeSelectPage } from '../../containers/DateTimeSelectPage';
import { FETCH_STATUS } from '../../utils/constants';

const availableDates = ['2019-10-29'];
const availableSlots = [
  {
    date: '2019-10-29',
    datetime: '2019-10-29T09:30:00-07:00',
  },
  {
    date: '2019-10-29',
    datetime: '2019-10-29T10:00:00-07:00',
  },
];

describe('VAOS <DateTimeSelectPage>', () => {
  it('should render', () => {
    const clearCalendarData = sinon.spy();
    const getAppointmentSlots = sinon.spy();
    const onCalendarChange = sinon.spy();
    const validateCalendar = sinon.spy();

    const form = mount(
      <DateTimeSelectPage
        availableDates={availableDates}
        availableSlots={availableSlots}
        clearCalendarData={clearCalendarData}
        data={{ calendarData: {} }}
        facilityId="123"
        getAppointmentSlots={getAppointmentSlots}
        loadingStatus={FETCH_STATUS.succeeded}
        onCalendarChange={onCalendarChange}
        validateCalendar={validateCalendar}
      />,
    );

    expect(form.find('CalendarWidget').length).to.equal(1);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const clearCalendarData = sinon.spy();
    const getAppointmentSlots = sinon.spy();
    const onCalendarChange = sinon.spy();
    const validateCalendar = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <DateTimeSelectPage
        onCalendarChange={onCalendarChange}
        getAppointmentSlots={getAppointmentSlots}
        clearCalendarData={clearCalendarData}
        data={{ calendarData: {} }}
        availableDates={availableDates}
        facilityId="123"
        availableSlots={availableSlots}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
        loadingStatus={FETCH_STATUS.succeeded}
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
    const getAppointmentSlots = sinon.spy();
    const onCalendarChange = sinon.spy();
    const validateCalendar = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <DateTimeSelectPage
        getAppointmentSlots={getAppointmentSlots}
        clearCalendarData={clearCalendarData}
        onCalendarChange={onCalendarChange}
        data={{
          calendarData: { currentlySelectedDate: '2020-12-20', error: 'test' },
        }}
        availableDates={availableDates}
        facilityId="123"
        availableSlots={availableSlots}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
        loadingStatus={FETCH_STATUS.succeeded}
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
    const getAppointmentSlots = sinon.spy();
    const onCalendarChange = sinon.spy();
    const validateCalendar = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <DateTimeSelectPage
        onCalendarChange={onCalendarChange}
        getAppointmentSlots={getAppointmentSlots}
        validateCalendar={validateCalendar}
        clearCalendarData={clearCalendarData}
        data={{
          calendarData: {
            selectedDates: [
              { date: '2019-10-30', datetime: '2019-10-30T10:00:00-07:00' },
            ],
          },
        }}
        availableDates={availableDates}
        availableSlots={availableSlots}
        loadingStatus={FETCH_STATUS.succeeded}
        facilityId="123"
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
    const getAppointmentSlots = sinon.spy();
    const onCalendarChange = sinon.spy();
    const validateCalendar = sinon.spy();
    const pageTitle = 'Tell us the date and time you’d like your appointment';

    const form = mount(
      <DateTimeSelectPage
        onCalendarChange={onCalendarChange}
        getAppointmentSlots={getAppointmentSlots}
        clearCalendarData={clearCalendarData}
        validateCalendar={validateCalendar}
        data={{ calendarData: {} }}
        facilityId="123"
        availableDates={availableDates}
        availableSlots={availableSlots}
      />,
    );

    expect(form.find('h1').text()).to.equal(pageTitle);
    expect(document.title).to.contain(pageTitle);
    form.unmount();
  });
});
