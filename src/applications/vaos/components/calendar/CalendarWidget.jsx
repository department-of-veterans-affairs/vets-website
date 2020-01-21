import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';

import CalendarRow from './CalendarRow';
import CalendarNavigation from './CalendarNavigation';
import CalendarWeekdayHeader from './CalendarWeekdayHeader';
import {
  getMaxMonth,
  getCalendarWeeks,
  isDateInSelectedArray,
  isDateOptionPairInSelectedArray,
  removeDateFromSelectedArray,
  removeDateOptionPairFromSelectedArray,
} from '../../utils/calendar';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { FETCH_STATUS } from '../../utils/constants';

export default class CalendarWidget extends Component {
  static props = {
    // TODO: add "showWeekends" prop
    additionalOptions: PropTypes.object,
    availableDates: PropTypes.array, // ['YYYY-MM-DD']
    loadingStatus: PropTypes.string,
    minDate: PropTypes.string, // YYYY-MM-DD
    maxDate: PropTypes.string, // YYYY-MM-DD
    maxSelections: PropTypes.number,
    monthsToShowAtOnce: PropTypes.number,
    startMonth: PropTypes.string, // YYYY-MM
    onChange: PropTypes.func,
    onClickNext: PropTypes.func,
    onClickPrev: PropTypes.func,
  };

  static defaultProps = {
    monthsToShowAtOnce: 1,
    maxSelections: 1,
    showPastMonths: false,
  };

  constructor(props) {
    super(props);

    const { maxDate, startMonth } = this.props;

    const currentDate = moment();
    this.state = {
      currentDate,
      months: [currentDate],
      maxMonth: getMaxMonth(maxDate, startMonth),
      optionsError: null,
    };
    this.currentDate = currentDate;
  }

  componentWillMount() {
    const { monthsToShowAtOnce, startMonth } = this.props;

    // Updates months to show at once if > default setting
    if (monthsToShowAtOnce > this.state.months.length) {
      const months = [];
      const startDate = startMonth ? moment(startMonth) : moment();

      for (let index = 0; index < monthsToShowAtOnce; index++) {
        months.push(startDate.clone().add(index, 'months'));
      }
      this.setState({
        months,
      });
    }
  }

  handlePrev = () => {
    const { onClickPrev } = this.props;
    const updatedMonths = this.state.months.map(m =>
      m.subtract(this.props.monthsToShowAtOnce, 'months'),
    );

    if (onClickPrev) {
      onClickPrev(
        updatedMonths[0].format('YYYY-MM-DD'),
        updatedMonths[updatedMonths.length - 1]
          .endOf('month')
          .format('YYYY-MM-DD'),
      );
    }
    this.setState({ months: updatedMonths });
  };

  handleNext = () => {
    const { onClickNext } = this.props;
    const updatedMonths = this.state.months.map(m =>
      m.add(this.props.monthsToShowAtOnce, 'months'),
    );

    if (onClickNext) {
      onClickNext(
        updatedMonths[0].format('YYYY-MM-DD'),
        updatedMonths[updatedMonths.length - 1]
          .endOf('month')
          .format('YYYY-MM-DD'),
      );
    }
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
        if (!additionalOptions?.required) {
          selectedDates = [{ date }];
        }
        currentlySelectedDate = date;
      } else {
        selectedDates = selectedDates.filter(d => d.date !== date);
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

  renderWeeks = month => {
    const {
      additionalOptions,
      availableDates,
      currentlySelectedDate,
      maxDate,
      minDate,
      selectedDates,
      selectedIndicatorType,
    } = this.props;

    return getCalendarWeeks(month).map((week, index) => (
      <CalendarRow
        key={`row-${index}`}
        cells={week}
        availableDates={availableDates}
        minDate={minDate}
        maxDate={maxDate}
        rowNumber={index}
        additionalOptions={additionalOptions}
        handleSelectDate={this.handleSelectDate}
        handleSelectOption={this.handleSelectOption}
        selectedDates={selectedDates || []}
        selectedIndicatorType={selectedIndicatorType}
        currentlySelectedDate={currentlySelectedDate}
        optionsError={
          this.state.currentRowIndex === index ? this.state.optionsError : null
        }
      />
    ));
  };

  renderMonth = (month, index) => {
    const { months, currentDate, maxMonth } = this.state;
    const nextMonthToDisplay = months[months.length - 1]
      ?.clone()
      .add(1, 'months')
      .format('YYYY-MM');

    const prevDisabled =
      months[0].format('YYYY-MM') <= currentDate.format('YYYY-MM');
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
    const { loadingStatus } = this.props;
    const { maxMonth, months } = this.state;
    const calendarCss = classNames('vaos-calendar__calendars vads-u-flex--1', {
      'vaos-calendar__loading': loadingStatus === FETCH_STATUS.loading,
    });

    if (loadingStatus === FETCH_STATUS.failed) {
      return (
        <p>
          There was a problem loading appointment availability. Please try again
          later.
        </p>
      );
    }

    return (
      <div className="vaos-calendar, vads-u-margin-top--4 vads-u-display--flex">
        {loadingStatus === FETCH_STATUS.loading && (
          <div className="vaos-calendar__loading-overlay">
            <LoadingIndicator message="Finding appointment availability..." />
          </div>
        )}
        <div className={calendarCss}>
          {months.map(
            (month, index) =>
              month.format('YYYY-MM') <= maxMonth ? (
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
