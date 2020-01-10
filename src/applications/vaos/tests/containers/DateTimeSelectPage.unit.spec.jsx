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
    const openFormPage = sinon.spy();
    const getAppointmentSlots = sinon.spy();
    const updateFormData = sinon.spy();

    const form = mount(
      <DateTimeSelectPage
        openFormPage={openFormPage}
        getAppointmentSlots={getAppointmentSlots}
        updateFormData={updateFormData}
        data={{}}
        facilityId="123"
        availableDates={availableDates}
        availableSlots={availableSlots}
        loadingStatus={FETCH_STATUS.succeeded}
      />,
    );

    expect(form.find('CalendarWidget').length).to.equal(1);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const openFormPage = sinon.spy();
    const getAppointmentSlots = sinon.spy();
    const updateFormData = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <DateTimeSelectPage
        openFormPage={openFormPage}
        getAppointmentSlots={getAppointmentSlots}
        updateFormData={updateFormData}
        data={{}}
        availableDates={availableDates}
        facilityId="123"
        availableSlots={availableSlots}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
        loadingStatus={FETCH_STATUS.succeeded}
      />,
    );

    form.find('form').simulate('submit');
    expect(routeToNextAppointmentPage.called).to.be.false;
    form.unmount();
  });

  it('should submit with selected data', () => {
    const openFormPage = sinon.spy();
    const getAppointmentSlots = sinon.spy();
    const updateFormData = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <DateTimeSelectPage
        openFormPage={openFormPage}
        getAppointmentSlots={getAppointmentSlots}
        updateFormData={updateFormData}
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

    form.find('form').simulate('submit');
    expect(routeToNextAppointmentPage.called).to.be.true;
    form.unmount();
  });

  it('document title should match h1 text', () => {
    const openFormPage = sinon.spy();
    const updateFormData = sinon.spy();
    const getAppointmentSlots = sinon.spy();
    const pageTitle = 'Tell us the date and time you’d like your appointment';

    const form = mount(
      <DateTimeSelectPage
        openFormPage={openFormPage}
        getAppointmentSlots={getAppointmentSlots}
        updateFormData={updateFormData}
        data={{}}
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
