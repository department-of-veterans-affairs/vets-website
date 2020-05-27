import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount, shallow } from 'enzyme';
import moment from 'moment';

import {
  DateTimeSelectPage,
  getOptionsByDate,
} from '../../containers/DateTimeSelectPage';
import { FETCH_STATUS } from '../../utils/constants';

const availableDates = ['2019-10-29'];
const availableSlots = [
  {
    start: '2019-10-29T09:30:00',
    end: '2019-10-29T09:50:00',
  },
  {
    start: '2019-10-29T10:00:00',
    end: '2019-10-29T10:20:00',
  },
];

describe('VAOS <DateTimeSelectPage>', () => {
  it('should render', () => {
    const getAppointmentSlots = sinon.spy();
    const onCalendarChange = sinon.spy();

    const form = mount(
      <DateTimeSelectPage
        availableDates={availableDates}
        availableSlots={availableSlots}
        data={{ calendarData: {} }}
        facilityId="123"
        getAppointmentSlots={getAppointmentSlots}
        appointmentSlotsStatus={FETCH_STATUS.succeeded}
        onCalendarChange={onCalendarChange}
      />,
    );

    expect(form.find('CalendarWidget').length).to.equal(1);
    expect(form.find('FormButtons').length).to.equal(1);
    expect(form.find('WaitTimeAlert').length).to.equal(1);
    form.unmount();
  });

  it('should not display WaitTimeAlert if loading', () => {
    const getAppointmentSlots = sinon.spy();
    const onCalendarChange = sinon.spy();

    const form = mount(
      <DateTimeSelectPage
        availableDates={availableDates}
        availableSlots={availableSlots}
        data={{ calendarData: {} }}
        facilityId="123"
        getAppointmentSlots={getAppointmentSlots}
        appointmentSlotsStatus={FETCH_STATUS.loading}
        onCalendarChange={onCalendarChange}
      />,
    );

    expect(form.find('WaitTimeAlert').length).to.equal(0);
    form.unmount();
  });

  it('should fetch appointment slots', () => {
    const getAppointmentSlots = sinon.spy();
    const onCalendarChange = sinon.spy();

    const form = mount(
      <DateTimeSelectPage
        availableDates={availableDates}
        availableSlots={availableSlots}
        data={{ calendarData: {} }}
        facilityId="123"
        getAppointmentSlots={getAppointmentSlots}
        appointmentSlotsStatus={FETCH_STATUS.succeeded}
        onCalendarChange={onCalendarChange}
      />,
    );

    expect(getAppointmentSlots.called).to.be.true;
    form.unmount();
  });

  // it('should display WaitTimeAlert ')

  it('should not submit empty form', () => {
    const getAppointmentSlots = sinon.spy();
    const onCalendarChange = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <DateTimeSelectPage
        onCalendarChange={onCalendarChange}
        getAppointmentSlots={getAppointmentSlots}
        data={{ calendarData: {} }}
        availableDates={availableDates}
        facilityId="123"
        availableSlots={availableSlots}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
        appointmentSlotsStatus={FETCH_STATUS.succeeded}
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
    const getAppointmentSlots = sinon.spy();
    const onCalendarChange = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <DateTimeSelectPage
        getAppointmentSlots={getAppointmentSlots}
        onCalendarChange={onCalendarChange}
        data={{
          calendarData: { currentlySelectedDate: '2020-12-20' },
        }}
        availableDates={availableDates}
        facilityId="123"
        availableSlots={availableSlots}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
        appointmentSlotsStatus={FETCH_STATUS.succeeded}
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
    const getAppointmentSlots = sinon.spy();
    const onCalendarChange = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <DateTimeSelectPage
        onCalendarChange={onCalendarChange}
        getAppointmentSlots={getAppointmentSlots}
        data={{
          calendarData: {
            selectedDates: [
              { date: '2019-10-30', datetime: '2019-10-30T10:00:00' },
            ],
          },
        }}
        availableDates={availableDates}
        availableSlots={availableSlots}
        appointmentSlotsStatus={FETCH_STATUS.succeeded}
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
    const getAppointmentSlots = sinon.spy();
    const onCalendarChange = sinon.spy();
    const pageTitle = 'Tell us the date and time you’d like your appointment';

    const form = mount(
      <DateTimeSelectPage
        onCalendarChange={onCalendarChange}
        getAppointmentSlots={getAppointmentSlots}
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

  it('should return options for date with getOptionsByDate', () => {
    const selectedDate = '2019-10-29';
    const options = getOptionsByDate(selectedDate, availableSlots);
    const dateTime0 = moment(availableSlots[0].start);
    const dateTime1 = moment(availableSlots[1].start);
    const srMeridiem = m =>
      m
        .format('A')
        .replace(/\./g, '')
        .toUpperCase();

    expect(options.length).to.equal(2);
    expect(options[0].label.props.children[0]).to.equal(
      dateTime0.format('h:mm'),
    );
    expect(options[0].label.props.children[2].props.children).to.equal(
      dateTime0.format('A'),
    );
    expect(options[0].label.props.children[4].props.children).to.equal(
      srMeridiem(dateTime0),
    );

    expect(options[1].label.props.children[0]).to.equal(
      dateTime1.format('h:mm'),
    );
    expect(options[1].label.props.children[2].props.children).to.equal(
      dateTime1.format('A'),
    );
    expect(options[1].label.props.children[4].props.children).to.equal(
      srMeridiem(dateTime1),
    );
  });

  it('should render error message if slots call fails', () => {
    const getAppointmentSlots = sinon.spy();
    const onCalendarChange = sinon.spy();
    const requestAppointmentDateChoice = sinon.spy();

    const form = mount(
      <DateTimeSelectPage
        availableDates={availableDates}
        availableSlots={availableSlots}
        data={{ calendarData: {} }}
        facilityId="123"
        getAppointmentSlots={getAppointmentSlots}
        appointmentSlotsStatus={FETCH_STATUS.failed}
        onCalendarChange={onCalendarChange}
        requestAppointmentDateChoice={requestAppointmentDateChoice}
      />,
    );

    const message = shallow(
      form.find('CalendarWidget').props().loadingErrorMessage,
    );
    message
      .find('button')
      .props()
      .onClick();

    expect(message.find('AlertBox').exists()).to.be.true;
    expect(message.find('a').props().href).to.contain('vha_123');
    expect(requestAppointmentDateChoice.called).to.be.true;

    form.unmount();
    message.unmount();
  });
});
