import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import CalendarCell from './CalendarCell';
import CalendarRadioOption from './CalendarRadioOption';
import CalendarCheckboxOption from './CalendarCheckboxOption';
import {
  isDateInSelectedArray,
  isDateOptionPairInSelectedArray,
} from './../../utils/calendar';

export default class CalendarRow extends Component {
  static propTypes = {
    availableDates: PropTypes.array,
    cells: PropTypes.array.isRequired,
    currentlySelectedDate: PropTypes.string,
    getSelectedDateOptions: PropTypes.func,
    handleSelectDate: PropTypes.func.isRequired,
    handleSelectOption: PropTypes.func,
    optionsError: PropTypes.string,
    rowNumber: PropTypes.number.isRequired,
    selectedDates: PropTypes.array,
  };

  isCellDisabled = date => {
    // If user provides an array of availableDates, disable dates that are not
    // in the array.  Otherwise, assume all dates >= today are valid
    const { availableDates } = this.props;
    let disabled = false;

    if (
      (Array.isArray(availableDates) && !availableDates.includes(date)) ||
      moment(date).isBefore(moment().format('YYYY-MM-DD'))
    ) {
      disabled = true;
    }
    return disabled;
  };

  renderOptions = () => {
    const {
      cells,
      currentlySelectedDate,
      additionalOptions,
      handleSelectOption,
      optionsError,
      selectedDates,
    } = this.props;

    if (
      currentlySelectedDate &&
      cells.includes(currentlySelectedDate) &&
      additionalOptions
    ) {
      const selectedDateOptions = additionalOptions?.getOptionsByDate(
        currentlySelectedDate,
      );

      if (selectedDateOptions) {
        const selectedCellIndex = cells.indexOf(currentlySelectedDate);
        const fieldName = additionalOptions.fieldName;

        let justify = 'vads-u-justify-content--flex-start';

        // If list of items is won't fill row, align items closer to selected cell
        if (selectedDateOptions.length < 4) {
          if (selectedCellIndex === 2) {
            justify = 'vads-u-justify-content--center';
          } else if (selectedCellIndex === 3 || selectedCellIndex === 4) {
            justify = 'vads-u-justify-content--flex-end';
          }
        }

        return (
          <div
            className={`vaos-calendar__options vads-u-display--flex vads-u-flex-wrap--wrap vads-u-margin-y--2${
              optionsError ? ' usa-input-error' : ''
            } ${justify}`}
          >
            {optionsError && (
              <span
                className="usa-input-error-message vads-u-margin-bottom--2 vads-u-padding-top--0 vads-u-width--full"
                role="alert"
              >
                <span className="sr-only">Error</span> {optionsError}
              </span>
            )}
            {selectedDateOptions.map((o, index) => {
              const dateObj = {
                date: currentlySelectedDate,
                [fieldName]: o.value,
              };
              const checked = isDateOptionPairInSelectedArray(
                dateObj,
                selectedDates,
                fieldName,
              );

              return additionalOptions?.maxSelections > 1 ? (
                <CalendarCheckboxOption
                  key={`checkbox-${index}`}
                  index={index}
                  fieldName={fieldName}
                  value={o.value}
                  checked={checked}
                  onChange={() => handleSelectOption(dateObj)}
                  label={o.label}
                />
              ) : (
                <CalendarRadioOption
                  key={`radio-${index}`}
                  index={index}
                  fieldName={fieldName}
                  value={o.value}
                  checked={checked}
                  onChange={() => handleSelectOption(dateObj)}
                  label={o.label}
                />
              );
            })}
          </div>
        );
      }
      return null;
    }
    return null;
  };

  render() {
    const {
      cells,
      currentlySelectedDate,
      handleSelectDate,
      rowNumber,
      selectedDates,
    } = this.props;

    return (
      <div>
        <div className="vaos-calendar__calendar-week vads-u-display--flex vads-u-justify-content--space-between">
          {cells.map((date, index) => (
            <CalendarCell
              key={`row-${rowNumber}-cell-${index}`}
              date={date}
              isCurrentlySelected={currentlySelectedDate === date}
              inSelectedArray={isDateInSelectedArray(date, selectedDates)}
              onClick={() => handleSelectDate(date, rowNumber)}
              disabled={this.isCellDisabled(date)}
            />
          ))}
        </div>
        {this.renderOptions()}
      </div>
    );
  }
}
