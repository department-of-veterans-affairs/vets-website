import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import CalendarRow from './CalendarRow';
import CalendarNavigation from './CalendarNavigation';
import CalendarWeekdayHeader from './CalendarWeekdayHeader';
import {
  getCalendarWeeks,
  isDateInSelectedArray,
  isDateOptionPairInSelectedArray,
  removeDateFromSelectedArray,
  removeDateOptionPairFromSelectedArray,
  // convertSelectedDatesArrayToObj,
} from '../../utils/calendar';

export default class CalendarWidget extends Component {
  static props = {
    // TODO: add "showWeekends" prop
    availableDates: PropTypes.array,
    monthsToShowAtOnce: PropTypes.number,
    maxSelections: PropTypes.number,
    additionalOptions: PropTypes.object,
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
      .add(90, 'days')
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

  isValid = date => {
    let isValid = true;
    const { additionalOptions } = this.props.additionalOptions;

    if (additionalOptions) {
      if (
        additionalOptions.required &&
        isDateInSelectedArray(date, this.state.selectedDates)
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
    const { maxSelections, currentlySelectedDate, onChange } = this.props;
    let selectedDates = this.props.selectedDates
      ? [...this.props.selectedDates]
      : [];
    const isInSelectedArray = isDateInSelectedArray(date, selectedDates);

    if (isInSelectedArray) {
      if (currentlySelectedDate === date) {
        // If already in array, "unselect" and remove from map
        selectedDates = removeDateFromSelectedArray(date, selectedDates);
        this.setState({
          currentRowIndex: null,
          optionsError: null,
        });

        onChange({
          currentlySelectedDate: null,
          selectedDates,
          currentRowIndex,
        });
      } else if (
        !currentlySelectedDate ||
        (currentlySelectedDate && this.isValid(currentlySelectedDate))
      ) {
        this.setState({
          currentRowIndex,
        });

        onChange({
          currentlySelectedDate: date,
          selectedDates,
          currentRowIndex,
        });
      }
    } else if (
      selectedDates.length < maxSelections &&
      (!currentlySelectedDate ||
        (currentlySelectedDate && this.isValid(currentlySelectedDate)))
    ) {
      if (!this.props.additionalOptions?.required) {
        selectedDates.push({ date });
      }

      this.setState({
        currentlySelectedDate: date,
        selectedDates,
        currentRowIndex,
      });

      onChange({
        currentlySelectedDate: date,
        selectedDates,
        currentRowIndex,
      });
    }
  };

  handleSelectDate = (date, currentRowIndex) => {
    let selectedDates = this.props.selectedDates
      ? [...this.props.selectedDates]
      : [];
    let currentlySelectedDate = this.props.currentlySelectedDate;

    const { maxSelections, additionalOptions, onChange } = this.props;

    if (maxSelections > 1) {
      this.handleMultiSelect(date, currentRowIndex);
    } else {
      if (date !== currentlySelectedDate) {
        selectedDates = !additionalOptions?.required ? [{ date }] : [];
        currentlySelectedDate = date;
      } else {
        selectedDates = [];
        currentlySelectedDate = null;
      }
      this.setState(
        {
          currentRowIndex,
        },
        () =>
          onChange({
            currentlySelectedDate,
            selectedDates,
            currentRowIndex,
          }),
      );
    }
  };

  handleSelectOption = dateObj => {
    let selectedDates = [...this.props.selectedDates];

    const {
      maxSelections,
      additionalOptions,
      onChange,
      currentlySelectedDate,
    } = this.props;

    const maxOptionSelections = additionalOptions.maxSelections;
    const fieldName = additionalOptions.fieldName;
    const alreadySelected = isDateOptionPairInSelectedArray(
      dateObj,
      selectedDates,
      fieldName,
    );
    if (maxOptionSelections > 1) {
      if (alreadySelected) {
        selectedDates = removeDateOptionPairFromSelectedArray(
          dateObj,
          selectedDates,
          fieldName,
        );
      } else if (selectedDates.length < maxSelections) {
        selectedDates.push(dateObj);
      }
    } else {
      selectedDates = [dateObj];
    }
    this.setState({ optionsError: null }, () =>
      onChange({
        currentlySelectedDate,
        selectedDates,
        currentRowIndex: this.state.currentRowIndex,
      }),
    );
  };

  renderWeeks = month =>
    getCalendarWeeks(month).map((week, index) => (
      <CalendarRow
        key={`row-${index}`}
        cells={week}
        availableDates={this.props.availableDates}
        rowNumber={index}
        additionalOptions={this.props.additionalOptions}
        handleSelectDate={this.handleSelectDate}
        handleSelectOption={this.handleSelectOption}
        selectedDates={this.props.selectedDates || []}
        currentlySelectedDate={this.props.currentlySelectedDate}
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
      months[0].format('YYYYMM') === currentDate.format('YYYYMM');
    const nextDisabled = nextMonthToDisplay > maxMonth;

    return (
      <>
        <h2
          id={`h2-${month.format('YYYY-MM')}`}
          className="vads-u-font-size--h3 vads-u-font-weight--bold vads-u-text-align--center vads-u-margin-bottom--0 vads-u-display--block vads-u-font-family--serif"
        >
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
        <div role="rowgroup">{this.renderWeeks(month)}</div>
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
                  aria-describedby={`h2-${month.format('YYYY-MM')}`}
                  role="table"
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
