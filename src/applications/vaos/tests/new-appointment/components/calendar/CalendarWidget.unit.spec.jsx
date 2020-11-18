import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import moment from 'moment';

import CalendarWidget from '../../../../new-appointment/components/calendar/CalendarWidget';
import { FETCH_STATUS } from '../../../../utils/constants';

const getOptionsByDate = () => [
  {
    date: '2019-10-24',
    datetime: '2019-10-24T09:00:00-07:00',
  },
  {
    date: '2019-10-25',
    datetime: '2019-10-25T09:00:00-07:00',
  },
  {
    date: '2020-03-05',
    datetime: '2020-03-05T09:00:00-05:00',
  },
];

const getDateFromButtonId = button => {
  // Get button id
  const buttonId = button.render().attr('id');

  // Get date from button id
  return buttonId.slice(-10);
};

describe('VAOS <CalendarWidget>', () => {
  it('should render 2 calendars', () => {
    const tree = mount(<CalendarWidget monthsToShowAtOnce={2} />);
    const cell = tree.find('.vaos-calendar__container');
    expect(cell.length).to.equal(2);
    const navigation = tree.find('.vaos-calendar__nav-links');
    expect(navigation.length).to.equal(1);
    const weekdayHeaders = tree.find('.vaos-calendar__weekday-container');
    expect(weekdayHeaders.length).to.equal(2);
    tree.unmount();
  });

  it('should render loading indicator if loadingStatus === "loading"', () => {
    const tree = shallow(
      <CalendarWidget
        monthsToShowAtOnce={2}
        loadingStatus={FETCH_STATUS.loading}
      />,
    );
    expect(tree.find('LoadingIndicator').exists()).to.be.true;
    tree.unmount();
  });

  it('should not render loading indicator if loadingStatus === "succeeded"', () => {
    const tree = shallow(
      <CalendarWidget
        monthsToShowAtOnce={2}
        loadingStatus={FETCH_STATUS.succeeded}
      />,
    );
    expect(tree.find('LoadingIndicator').exists()).to.be.false;
    expect(tree.find('.usa-input-error-message').exists()).to.be.false;
    expect(tree.find('.usa-input-error').exists()).to.be.false;
    tree.unmount();
  });

  it('should not render calendar if loadingStatus === "failed"', () => {
    const tree = shallow(
      <CalendarWidget
        monthsToShowAtOnce={2}
        loadingErrorMessage={
          <div>There was a problem loading appointment availability</div>
        }
        loadingStatus={FETCH_STATUS.failed}
      />,
    );
    expect(tree.text()).to.contain(
      'There was a problem loading appointment availability',
    );
    tree.unmount();
  });

  it('should still render a calendar if startMonth is beyond 90 day default', () => {
    const futureDate = moment()
      .add(6, 'months')
      .format('YYYY-MM');
    const tree = mount(
      <CalendarWidget monthsToShowAtOnce={1} startMonth={futureDate} />,
    );
    const cell = tree.find('.vaos-calendar__container');
    expect(cell.length).to.equal(1);
    const navigation = tree.find('.vaos-calendar__nav-links');
    expect(navigation.length).to.equal(1);
    const weekdayHeaders = tree.find('.vaos-calendar__weekday-container');
    expect(weekdayHeaders.length).to.equal(1);
    tree.unmount();
  });

  it('should display the same month as startMonth', () => {
    const currentDate = moment().format('YYYY-MM-DD');
    const tree = shallow(
      <CalendarWidget monthsToShowAtOnce={1} startMonth={currentDate} />,
    );

    expect(
      tree
        .find('h2')
        .at(0)
        .text(),
    ).to.equal(moment().format('MMMM YYYY'));

    tree.unmount();
  });

  it('should pass click handlers to CalendarNavigation', () => {
    const prevOnClick = sinon.spy();
    const nextOnClick = sinon.spy();

    const tree = shallow(
      <CalendarWidget
        monthsToShowAtOnce={2}
        startMonth="2019-11-20"
        onClickPrev={prevOnClick}
        onClickNext={nextOnClick}
      />,
    );

    const buttons = tree
      .find('CalendarNavigation')
      .dive()
      .find('button');

    buttons.at(0).simulate('click');
    expect(prevOnClick.called).to.be.true;
    buttons.at(1).simulate('click');
    expect(nextOnClick.called).to.be.true;
    tree.unmount();

    tree.unmount();
  });

  it('should display an error if validationError is passed', () => {
    const tree = shallow(
      <CalendarWidget
        monthsToShowAtOnce={2}
        loadingStatus={FETCH_STATUS.succeeded}
        validationError="Error message"
      />,
    );
    expect(tree.find('.usa-input-error-message').exists()).to.be.true;
    expect(tree.find('.usa-input-error').exists()).to.be.true;
    tree.unmount();
  });

  describe('Select single date', () => {
    let tree;
    let buttons;

    beforeEach(() => {
      tree = mount(
        <CalendarWidget
          monthsToShowAtOnce={2}
          minDate={moment().format('YYYY-MM-DD')}
          onChange={state => {
            tree.setProps(state);
          }}
          maxSelections={1}
        />,
      );

      // Find all calendar day buttons that are enabled.
      buttons = tree.find(
        'button.vaos-calendar__calendar-day-button[disabled=false]',
      );
      expect(buttons.exists()).to.be.true;
      expect(buttons.length).to.be.gt(0);
    });

    afterEach(() => {
      tree.unmount();
    });

    it('should save currently selected date', () => {
      buttons.at(0).simulate('click');
      expect(tree.prop('selectedDates').length).to.be.equal(1);
    });

    it('should save new date when date has been selected before', () => {
      let button = buttons.at(0);

      // Simulate the date being selected by setting the 'currentlySelectedDate' property.
      tree.setProps({ currentlySelectedDate: getDateFromButtonId(button) });
      tree.setProps({
        additionalOptions: { required: false, getOptionsByDate },
      });

      // Select a different date...
      button = buttons.at(1);
      button.simulate('click');

      expect(tree.prop('currentlySelectedDate')).to.be.equal(
        getDateFromButtonId(button),
      );
    });
  });

  describe('Select multiple dates', () => {
    let tree;
    let buttons;

    beforeEach(() => {
      tree = mount(
        // No weekend dates and date must be equal or after current date!
        <CalendarWidget
          monthsToShowAtOnce={2}
          minDate={moment().format('YYYY-MM-DD')}
          onChange={state => {
            tree.setProps(state);
          }}
          maxSelections={2}
        />,
      );

      // Find all calendar day buttons that are enabled.
      buttons = tree.find(
        'button.vaos-calendar__calendar-day-button[disabled=false]',
      );
      expect(buttons.length).to.be.gt(0);
    });

    afterEach(() => {
      tree.unmount();
    });

    it('should handle multiple select date', () => {
      const button = buttons.first();

      // Select a date...
      button.simulate('click');

      expect(tree.prop('selectedDates').length).to.be.equal(1);
    });

    it('should select max of 2 dates', () => {
      // This causes dates to be saved
      tree.setProps({
        additionalOptions: { required: false, getOptionsByDate },
      });

      // Select a few dates...
      buttons.at(0).simulate('click');
      buttons.at(1).simulate('click');

      expect(tree.prop('selectedDates').length).to.be.equal(2);
    });

    it('should unselect date when selecting the same date', () => {
      const button = buttons.first();
      const selectedDate = getDateFromButtonId(button);

      // This array is populated when the user selects dates so, add
      // a date...
      tree.setProps({ selectedDates: [{ date: selectedDate }] });

      // Simulate the date being selected by setting the 'currentlySelectedDate' property...
      tree.setProps({ currentlySelectedDate: selectedDate });

      // Click the first button...
      button.simulate('click');

      expect(tree.prop('currentlySelectedDate')).to.equal(null);
    });

    it('should update currently selected date', () => {
      const button = buttons.first();
      const selectedDate = getDateFromButtonId(button);

      // This array is populated when the user selects a dates so, add
      // a date...
      tree.setProps({ selectedDates: [{ date: selectedDate }] });

      // Click the first button...
      button.simulate('click');

      expect(tree.prop('currentlySelectedDate')).to.equal(selectedDate);
    });
  });

  // Disabled due to error when trying to set focus on DOM element
  xdescribe('isValid', () => {
    let tree;
    let buttons;

    beforeEach(() => {
      tree = mount(
        // No weekend dates and date must be equal or after current date!
        <CalendarWidget
          minDate={moment().format('YYYY-MM-DD')}
          onChange={state => {
            tree.setProps(state);
          }}
          maxSelections={2}
          additionalOptions={{
            required: true,
            maxSelections: 2,
            getOptionsByDate,
          }}
        />,
      );

      // Find all calendar day buttons that are enabled.
      buttons = tree.find(
        'button.vaos-calendar__calendar-day-button[disabled=false]',
      );
      expect(buttons.length).to.be.gt(0);
    });

    afterEach(() => {
      tree.unmount();
    });

    it('should return true', () => {
      const button = buttons.first();

      // This array is populated when the user selects a dates so, add
      // a date...
      tree.setState({ selectedDates: [{ date: getDateFromButtonId(button) }] });
      expect(tree.instance().isValid(getDateFromButtonId(button))).to.be.true;
    });
  });
});
