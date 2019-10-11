import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import CalendarRow from './CalendarRow';
import CalendarNavigation from './CalendarNavigation';
import {
  getCalendarWeeks,
  // convertSelectedDatesObjToArray,
  // convertSelectedDatesArrayToObj,
} from '../../utils/calendar';

export default class CalendarWidget extends Component {
  static props = {
    // TODO: add "showWeekends" prop
    availableDates: PropTypes.array,
    monthsToShowAtOnce: PropTypes.number,
    maxSelections: PropTypes.number,
    getSelectedDateOptions: PropTypes.array,
  };

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
      currentRowIndex: null,
      selectedDates: {},
      optionsError: null,
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

  isValid = date => {
    let isValid = true;

    if (this.props.getSelectedDateOptions) {
      const additionalOptions = this.props.getSelectedDateOptions(date);
      if (
        additionalOptions.required &&
        this.state.selectedDates?.[date]?.[additionalOptions.fieldName] ===
          undefined
      ) {
        isValid = false;
        document.getElementById(`date-cell-${date}`).focus();
        this.setState({ optionsError: additionalOptions.validationMessage });
      } else {
        this.setState({ optionsError: null });
      }
    }

    return isValid;
  };

  handleSelectDate = (date, currentRowIndex) => {
    const { maxSelections } = this.props;
    const selectedDates = { ...this.state.selectedDates };
    const currentlySelectedDate = this.state.currentlySelectedDate;
    const isInSelectedMap = selectedDates[date] !== undefined;

    if (maxSelections > 1) {
      if (isInSelectedMap) {
        if (currentlySelectedDate === date) {
          // If already in map, "unselect" and remove from map
          delete selectedDates[date];
          this.setState({
            currentlySelectedDate: null,
            currentRowIndex: null,
            selectedDates,
            optionsError: null,
          });
        } else if (
          !currentlySelectedDate ||
          (currentlySelectedDate && this.isValid(currentlySelectedDate))
        ) {
          this.setState({
            currentlySelectedDate: date,
            currentRowIndex,
          });
        }
      } else if (
        Object.keys(selectedDates).length < maxSelections &&
        (!currentlySelectedDate ||
          (currentlySelectedDate && this.isValid(currentlySelectedDate)))
      ) {
        selectedDates[date] = {};

        this.setState({
          currentlySelectedDate: date,
          selectedDates,
          currentRowIndex,
        });
      }
    } else {
      delete selectedDates[currentlySelectedDate];
      selectedDates[date] = {};

      this.setState({
        currentlySelectedDate: date,
        selectedDates,
        currentRowIndex,
      });
    }
  };

  handleSelectOption = data => {
    const currentlySelectedDate = this.state.currentlySelectedDate;
    const selectedDates = { ...this.state.selectedDates };
    selectedDates[currentlySelectedDate][data.fieldName] = data.value;
    this.setState({ selectedDates, optionsError: null });
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

  renderWeeks = month =>
    getCalendarWeeks(month).map((week, index) => (
      <CalendarRow
        key={`row-${index}`}
        cells={week}
        availableDates={this.props.availableDates}
        rowNumber={index}
        getSelectedDateOptions={this.props.getSelectedDateOptions}
        handleSelectDate={this.handleSelectDate}
        handleSelectOption={this.handleSelectOption}
        selectedDates={this.state.selectedDates}
        currentlySelectedDate={this.state.currentlySelectedDate}
        optionsError={
          this.state.currentRowIndex === index ? this.state.optionsError : null
        }
      />
    ));

  renderMonth = (month, index) => (
    <>
      <h2 className="vads-u-font-size--h3 vads-u-font-weight--bold vads-u-text-align--center vads-u-margin-bottom--0 vads-u-display--block vads-u-font-family--serif">
        {month.format('MMMM YYYY')}
      </h2>

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
