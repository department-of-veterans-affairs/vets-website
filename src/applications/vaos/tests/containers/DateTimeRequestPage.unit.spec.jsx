import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import moment from 'moment';

import {
  DateTimeRequestPage,
  getOptionsByDate,
} from '../../containers/DateTimeRequestPage';

describe('VAOS <DateTimeRequestPage>', () => {
  it('should render', () => {
    const onCalendarChange = sinon.spy();

    const form = mount(
      <DateTimeRequestPage
        data={{ calendarData: {} }}
        onCalendarChange={onCalendarChange}
      />,
    );

    expect(form.find('CalendarWidget').length).to.equal(1);
    expect(form.find('FormButtons').length).to.equal(1);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const onCalendarChange = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <DateTimeRequestPage
        onCalendarChange={onCalendarChange}
        data={{ calendarData: {} }}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
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
    const onCalendarChange = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();
    const thirtyDaysFromNow = moment()
      .add(30, 'day')
      .format('YYYY-MM-DD');

    const data = {
      calendarData: { currentlySelectedDate: thirtyDaysFromNow, error: 'test' },
    };

    const form = mount(
      <DateTimeRequestPage
        onCalendarChange={onCalendarChange}
        data={data}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
      />,
    );

    form
      .find('FormButtons')
      .find('button[type="submit"]')
      .simulate('click');
    expect(routeToNextAppointmentPage.called).to.be.false;
    expect(form.instance().isMaxSelectionsError()).to.be.false;
    form.unmount();
  });

  it('should have userSelectedSlot return false if no date selected', () => {
    const onCalendarChange = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();
    const data = {
      calendarData: {
        currentlySelectedDate: '2020-12-20',
        selectedDates: [],
      },
    };

    const form = mount(
      <DateTimeRequestPage
        onCalendarChange={onCalendarChange}
        data={data}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
      />,
    );

    expect(form.instance().userSelectedSlot(data.calendarData)).to.be.false;
    form.unmount();
  });

  it('should have userSelectedSlot return true if date selected', () => {
    const onCalendarChange = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();
    const data = {
      calendarData: {
        currentlySelectedDate: '2020-12-20',
        selectedDates: [{}],
      },
    };

    const form = mount(
      <DateTimeRequestPage
        onCalendarChange={onCalendarChange}
        data={data}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
      />,
    );

    expect(form.instance().userSelectedSlot(data.calendarData)).to.be.true;
    form.unmount();
  });

  it('should have exceededMaxSelections return false if 3 or less dates provided', () => {
    const onCalendarChange = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();
    const data = {
      calendarData: {
        currentlySelectedDate: '2020-12-20',
        selectedDates: [{}, {}, {}],
      },
    };

    const form = mount(
      <DateTimeRequestPage
        onCalendarChange={onCalendarChange}
        data={data}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
      />,
    );

    expect(form.instance().exceededMaxSelections(data.calendarData)).to.be
      .false;
    form.unmount();
  });

  it('should have exceededMaxSelections return true if 4 dates provided', () => {
    const onCalendarChange = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();
    const data = {
      calendarData: {
        currentlySelectedDate: '2020-12-20',
        selectedDates: [{}, {}, {}, {}],
      },
    };

    const form = mount(
      <DateTimeRequestPage
        onCalendarChange={onCalendarChange}
        data={data}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
      />,
    );

    expect(form.instance().exceededMaxSelections(data.calendarData)).to.be.true;
    form.unmount();
  });

  it('should submit with selected data', () => {
    const onCalendarChange = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <DateTimeRequestPage
        onCalendarChange={onCalendarChange}
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
    const onCalendarChange = sinon.spy();
    const pageTitle = 'Choose a day and time for your appointment';

    const form = mount(
      <DateTimeRequestPage
        onCalendarChange={onCalendarChange}
        data={{ calendarData: {} }}
      />,
    );

    expect(form.find('h1').text()).to.equal(pageTitle);
    expect(document.title).to.contain(pageTitle);
    form.unmount();
  });

  it('should return options for date with getOptionsByDate', () => {
    const options = getOptionsByDate();
    expect(options.length).to.equal(2);
    expect(options[0].value).to.equal('AM');
    expect(options[0].label).to.equal('AM');
    expect(options[1].value).to.equal('PM');
    expect(options[1].label).to.equal('PM');
  });
});
