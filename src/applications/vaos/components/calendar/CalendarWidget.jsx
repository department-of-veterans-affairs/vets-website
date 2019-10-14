import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import CalendarRow from './CalendarRow';
import CalendarNavigation from './CalendarNavigation';
import CalendarWeekdayHeader from './CalendarWeekdayHeader';
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
    onChange: PropTypes.func,
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
      maxMonth: this.getMaxMonth(),
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

  componentDidUpdate(prevProps) {
    if (this.availableDatesChanged(prevProps.availableDates)) {
      this.setMaxMonth();
    }
  }

  setMaxMonth = () => {
    this.setState({ maxMonth: this.getMaxMonth() });
  };

  getMaxMonth = () => {
    const { availableDates } = this.props;
    if (Array.isArray(availableDates) && availableDates.length) {
      // get max date
      const sortedArray = this.sortDates(availableDates);
      return moment(sortedArray[sortedArray.length - 1]).format('YYYYMM');
    }

    // If no available dates array provided, set max to 45 days from now
    return moment()
      .add(45, 'days')
      .format('YYYYMM');
  };

  availableDatesChanged = prevDates => {
    const availableDates = this.props.availableDates;
    const availDatesIsArray = Array.isArray(availableDates);
    const prevDatesIsArray = Array.isArray(prevDates);

    if (
      (!prevDatesIsArray && availDatesIsArray) ||
      (prevDatesIsArray && !availDatesIsArray)
    ) {
      // If types of either changed
      return true;
    } else if (prevDatesIsArray && Array.isArray(availableDates)) {
      if (prevDates.length !== availableDates.length) {
        return true;
      }

      for (let index = 0; index < prevDates.length; index++) {
        if (prevDates[index] !== availableDates[index]) {
          return true;
        }
      }
    }

    return false;
  };

  sortDates = array =>
    array.sort((a, b) => moment.utc(a.timeStamp).diff(moment.utc(b.timeStamp)));

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

  shouldDisableNextButton = () => {};

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

  handleMultiSelect = (date, currentRowIndex) => {
    const { maxSelections } = this.props;
    const selectedDates = { ...this.state.selectedDates };
    const currentlySelectedDate = this.state.currentlySelectedDate;
    const isInSelectedMap = selectedDates[date] !== undefined;

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
      selectedDates[date] = {
        date,
      };

      this.setState({
        currentlySelectedDate: date,
        selectedDates,
        currentRowIndex,
      });
    }
  };

  handleSelectDate = (date, currentRowIndex) => {
    const selectedDates = { ...this.state.selectedDates };
    const currentlySelectedDate = this.state.currentlySelectedDate;

    if (this.props.maxSelections > 1) {
      this.handleMultiSelect(date, currentRowIndex);
    } else if (date !== currentlySelectedDate) {
      delete selectedDates[currentlySelectedDate];
      selectedDates[date] = {
        date,
      };

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

  renderMonth = (month, index) => {
    const { months, currentDate, maxMonth } = this.state;
    const nextMonthToDisplay = months[months.length - 1]
      ?.clone()
      .add(1, 'months')
      .format('YYYYMM');

    const prevDisabled =
      months[0].format('MMYYY') === currentDate.format('MMYYY');
    const nextDisabled = nextMonthToDisplay > maxMonth;

    return (
      <>
        <h2 className="vads-u-font-size--h3 vads-u-font-weight--bold vads-u-text-align--center vads-u-margin-bottom--0 vads-u-display--block vads-u-font-family--serif">
          {month.format('MMMM YYYY')}
        </h2>

        {index === 0 && (
          <CalendarNavigation
            prevOnClick={this.handlePrev}
            nextOnClick={this.handleNext}
            prevDisabled={prevDisabled}
            nextDisabled={nextDisabled}
          />
        )}
        <hr className="vads-u-margin-y--1" />
        <CalendarWeekdayHeader />
        {this.renderWeeks(month)}
      </>
    );
  };

  render() {
    const { maxMonth, months } = this.state;

    return (
      <div className="vaos-calendar vads-u-margin-top--4 vads-u-display--flex">
        <div className="vaos-calendar__calendars vads-u-flex--1">
          {months.map(
            (month, index) =>
              month.format('YYYYMM') <= maxMonth ? (
                <div
                  key={`month-${index}`}
                  className="vaos-calendar__container vads-u-margin-bottom--3"
                >
                  {this.renderMonth(month, index)}
                </div>
              ) : null,
          )}
        </div>
      </div>
    );
  }
}
