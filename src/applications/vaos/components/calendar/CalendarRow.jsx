import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import CalendarCell from './CalendarCell';
import { isDateInSelectedArray } from './../../utils/calendar';

export default class CalendarRow extends Component {
  static propTypes = {
    availableDates: PropTypes.array,
    cells: PropTypes.array.isRequired,
    currentlySelectedDate: PropTypes.string,
    getSelectedDateOptions: PropTypes.func,
    handleSelectDate: PropTypes.func.isRequired,
    handleSelectOption: PropTypes.func,
    maxDate: PropTypes.string,
    maxSelections: PropTypes.number,
    minDate: PropTypes.string,
    rowNumber: PropTypes.number.isRequired,
    selectedDates: PropTypes.array,
  };

  isCellDisabled = date => {
    const { availableDates, minDate, maxDate } = this.props;
    let disabled = false;

    // If user provides an array of availableDates, disable dates that are not
    // in the array.
    if (
      (Array.isArray(availableDates) && !availableDates.includes(date)) ||
      moment(date).isBefore(moment().format('YYYY-MM-DD'))
    ) {
      disabled = true;
    }

    // If minDate provided, disable dates before minDate
    if (
      minDate &&
      moment(minDate).isValid() &&
      moment(date).isBefore(moment(minDate))
    ) {
      disabled = true;
    }

    // If maxDate provided, disable dates after maxDate
    if (
      maxDate &&
      moment(maxDate).isValid() &&
      moment(date).isAfter(moment(maxDate))
    ) {
      disabled = true;
    }

    return disabled;
  };

  render() {
    const {
      additionalOptions,
      cells,
      currentlySelectedDate,
      handleSelectDate,
      handleSelectOption,
      hasError,
      maxSelections,
      rowNumber,
      selectedDates,
      selectedIndicatorType,
    } = this.props;

    return (
      <div>
        <div
          className="vads-u-flex-wrap--wrap vads-u-display--flex vads-u-justify-content--space-between"
          role="row"
        >
          {cells.map((date, index) => (
            <CalendarCell
              additionalOptions={additionalOptions}
              currentlySelectedDate={currentlySelectedDate}
              date={date}
              disabled={this.isCellDisabled(date)}
              handleSelectOption={handleSelectOption}
              hasError={hasError}
              index={index}
              inSelectedArray={isDateInSelectedArray(date, selectedDates)}
              key={`row-${rowNumber}-cell-${index}`}
              maxSelections={maxSelections}
              onClick={() => handleSelectDate(date, rowNumber)}
              selectedDates={selectedDates}
              selectedIndicatorType={selectedIndicatorType}
            />
          ))}
        </div>
      </div>
    );
  }
}
