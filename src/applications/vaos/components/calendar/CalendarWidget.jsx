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
  removeDateOptionPairFromSelectedArray,
} from '../../utils/calendar';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { FETCH_STATUS } from '../../utils/constants';

export default class CalendarWidget extends Component {
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

  handleMultiSelect = date => {
    const { onChange } = this.props;
    const selectedDates = this.props.selectedDates
      ? [...this.props.selectedDates]
      : [];

    const isInSelectedArray = isDateInSelectedArray(date, selectedDates);
    // If an option selection is required, don't add this date to selectedDates
    // array until an option is selected as well
    if (!isInSelectedArray && !this.props.additionalOptions?.required) {
      selectedDates.push({ date });
    }

    onChange({
      currentlySelectedDate:
        this.props.currentlySelectedDate === date ? null : date,
      selectedDates,
    });
  };

  handleSelectDate = date => {
    let selectedDates = this.props.selectedDates
      ? [...this.props.selectedDates]
      : [];
    let currentlySelectedDate = this.props.currentlySelectedDate;

    const { maxSelections, additionalOptions, onChange } = this.props;

    if (maxSelections > 1) {
      this.handleMultiSelect(date);
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
      onChange({
        currentlySelectedDate,
        selectedDates,
      });
    }
  };

  handleSelectOption = dateObj => {
    let selectedDates = [...this.props.selectedDates];

    const { additionalOptions, onChange, currentlySelectedDate } = this.props;

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
      } else {
        selectedDates.push(dateObj);
      }
    } else {
      selectedDates = [dateObj];
    }
    onChange({
      currentlySelectedDate,
      selectedDates,
    });
  };

  renderWeeks = month => {
    const {
      additionalOptions,
      availableDates,
      currentlySelectedDate,
      maxDate,
      maxSelections,
      minDate,
      selectedDates,
      selectedIndicatorType,
      validationError,
    } = this.props;

    return getCalendarWeeks(month).map((week, index) => (
      <CalendarRow
        additionalOptions={additionalOptions}
        availableDates={availableDates}
        cells={week}
        currentlySelectedDate={currentlySelectedDate}
        handleSelectDate={this.handleSelectDate}
        handleSelectOption={this.handleSelectOption}
        hasError={validationError?.length > 0}
        key={`row-${index}`}
        maxDate={maxDate}
        maxSelections={maxSelections}
        minDate={minDate}
        rowNumber={index}
        selectedDates={selectedDates || []}
        selectedIndicatorType={selectedIndicatorType}
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
        <div
          className="sr-only"
          id={`vaos-calendar-instructions-${month.month()}`}
        >
          Press the Enter key to expand the day you want to schedule an
          appointment. Then press the Tab key or form shortcut key to select an
          appointment time.
        </div>

        {index === 0 && (
          <CalendarNavigation
            prevOnClick={this.handlePrev}
            nextOnClick={this.handleNext}
            prevDisabled={prevDisabled}
            nextDisabled={nextDisabled}
          />
        )}
        <hr aria-hidden="true" className="vads-u-margin-y--1" />
        <CalendarWeekdayHeader />
        <div role="rowgroup">{this.renderWeeks(month)}</div>
      </>
    );
  };

  render() {
    const { loadingStatus, validationError, loadingErrorMessage } = this.props;
    const { maxMonth, months } = this.state;
    const showError = validationError?.length > 0;

    const calendarCss = classNames('vaos-calendar__calendars vads-u-flex--1', {
      'vaos-calendar__loading': loadingStatus === FETCH_STATUS.loading,
      'usa-input-error': showError,
    });

    if (loadingStatus === FETCH_STATUS.failed) {
      return loadingErrorMessage;
    }

    return (
      <div className="vaos-calendar vads-u-margin-top--4 vads-u-display--flex">
        {loadingStatus === FETCH_STATUS.loading && (
          <div className="vaos-calendar__loading-overlay">
            <LoadingIndicator message="Finding appointment availability..." />
          </div>
        )}
        <div className={calendarCss}>
          {showError && (
            <span
              className="vaos-calendar__validation-msg usa-input-error-message"
              role="alert"
            >
              {validationError}
            </span>
          )}
          {months.map(
            (month, index) =>
              month.format('YYYY-MM') <= maxMonth ? (
                <div
                  key={`month-${index}`}
                  className="vaos-calendar__container vads-u-margin-bottom--3"
                  aria-labelledby={`h2-${month.format('YYYY-MM')}`}
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

CalendarWidget.propTypes = {
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
  validationError: PropTypes.string,
};
