import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import CalendarRow from './CalendarRow';
import CalendarNavigation from './CalendarNavigation';
import { getCalendarCells } from '../../utils/calendar';

class CalendarWidget extends Component {
  static defaultProps = {
    monthsToShowAtOnce: 1,
    maxSelections: 1,
    showPastMonths: false,
  };

  constructor(props) {
    super(props);

    const currentDate = moment();
    this.state = {
      currentDate,
      months: [currentDate],
      currentlySelectedDate: null,
      selectedDates: {},
    };
  }

  componentWillMount() {
    const monthsToShowAtOnce = this.props.monthsToShowAtOnce;
    // Updates months to show at once if > default setting
    if (monthsToShowAtOnce > this.state.months.length) {
      const months = [];
      const currentDate = moment();
      for (let index = 0; index < monthsToShowAtOnce; index++) {
        months.push(currentDate.clone().add(index, 'months'));
      }
      this.setState({
        months,
      });
    }
  }

  handlePrev = () => {
    const updatedMonths = this.state.months.map(m =>
      m.add(-this.props.monthsToShowAtOnce, 'months'),
    );
    this.setState({ months: updatedMonths });
  };

  handleNext = () => {
    const updatedMonths = this.state.months.map(m =>
      m.add(this.props.monthsToShowAtOnce, 'months'),
    );
    this.setState({ months: updatedMonths });
  };

  handleSelectDate = date => {
    const { maxSelections } = this.props;
    const selectedDates = { ...this.state.selectedDates };
    const currentlySelectedDate = this.state.currentlySelectedDate;

    const alreadySelected = selectedDates[date] !== undefined;

    if (alreadySelected) {
      if (currentlySelectedDate === date) {
        delete selectedDates[date];
        this.setState({
          currentlySelectedDate: null,
          selectedDates,
        });
      } else {
        this.setState({ currentlySelectedDate: date });
      }
    } else if (Object.keys(selectedDates).length < maxSelections) {
      selectedDates[date] = {};
      this.setState({
        currentlySelectedDate: date,
        selectedDates,
      });
    }
  };

  handleSelectOption = data => {
    const currentlySelectedDate = this.state.currentlySelectedDate;
    const selectedDates = { ...this.state.selectedDates };
    selectedDates[currentlySelectedDate][data.fieldName] = data.value;
    this.setState({ selectedDates });
  };

  renderWeekdayLabels = () => (
    <div className="vaos-calendar__weekday-container">
      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(
        (day, index) => (
          <div
            key={`weekday-${index}`}
            className="vaos-calendar__weekday vads-u-font-weight--bold vads-u-text-align--center vads-u-margin-bottom--0p5"
          >
            {day}
          </div>
        ),
      )}
    </div>
  );

  renderWeeks = month => {
    const cells = getCalendarCells(month);
    const weeks = [];
    let currentWeek = [];

    for (let index = 0; index < cells.length; index++) {
      if (index > 0 && index % 5 === 0) {
        weeks.push(currentWeek);
        currentWeek = [cells[index]];
      } else {
        currentWeek.push(cells[index]);
      }
    }

    weeks.push(currentWeek);

    return weeks.map((week, index) => (
      <CalendarRow
        key={`row-${index}`}
        cells={week}
        rowNumber={index}
        additionalOptions={this.props.additionalOptions}
        handleSelectDate={this.handleSelectDate}
        handleSelectOption={this.handleSelectOption}
        selectedDates={this.state.selectedDates}
        currentlySelectedDate={this.state.currentlySelectedDate}
      />
    ));
  };

  renderMonth = (month, index) => (
    <>
      <span
        className="vads-u-font-weight--bold vads-u-text-align--center vads-u-display--block vads-u-font-family--serif
"
      >
        {month.format('MMMM YYYY')}
      </span>

      {index === 0 && (
        <CalendarNavigation
          prevOnClick={this.handlePrev}
          nextOnClick={this.handleNext}
          prevDisabled={
            this.state.months[0].format('MMYYY') ===
            this.state.currentDate.format('MMYYY')
          }
          nextDisabled={false}
        />
      )}
      <hr className="vads-u-margin-y--1" />
      {this.renderWeekdayLabels()}
      {this.renderWeeks(month)}
    </>
  );

  render() {
    return (
      <div className="vaos-calendar vads-u-margin-top--4">
        <div className="vaos-calendar__calendars">
          {this.state.months.map((month, index) => (
            <div
              key={`month-${index}`}
              className="vaos-calendar__container vads-u-margin-bottom--3"
            >
              {this.renderMonth(month, index)}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

CalendarWidget.props = {
  monthsToShowAtOnce: PropTypes.number,
  maxSelections: PropTypes.number,
  additionalOptions: PropTypes.array,
};

export default CalendarWidget;
