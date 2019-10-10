import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import CalendarCell from './CalendarCell';
import CalendarRadioOption from './CalendarRadioOption';

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
    selectedDates: PropTypes.object,
  };

  isCurrentlySelected = date => this.props.currentlySelectedDate === date;

  isDisabled = date => {
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

  handleSelectDate = date => {
    this.props.handleSelectDate(date, this.props.rowNumber);
  };

  handleSelectOption = (fieldName, value) => {
    this.props.handleSelectOption({
      fieldName,
      value,
    });
  };

  renderOptions = () => {
    const {
      cells,
      currentlySelectedDate,
      selectedDates,
      getSelectedDateOptions,
      optionsError,
    } = this.props;

    if (currentlySelectedDate && getSelectedDateOptions) {
      let showOptions = false;

      let selectedCellIndex;

      for (let index = 0; index < cells.length; index++) {
        const cell = this.props.cells[index];
        if (cell !== null) {
          if (this.isCurrentlySelected(cell)) {
            showOptions = true;
            selectedCellIndex = index;
          }
        }
      }

      if (showOptions) {
        const additionalOptions = getSelectedDateOptions(currentlySelectedDate);

        if (additionalOptions) {
          const fieldName = additionalOptions.fieldName;

          let justify = 'vads-u-justify-content--flex-start';

          // If list is items is won't fill row, align items closer to selected cell
          if (additionalOptions?.options?.length < 4) {
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
              {additionalOptions?.options.map((o, index) => (
                <CalendarRadioOption
                  key={`radio-${index}`}
                  index={index}
                  fieldName={fieldName}
                  value={o.value}
                  checked={
                    selectedDates[currentlySelectedDate][fieldName] === o.value
                  }
                  onChange={e =>
                    this.handleSelectOption(fieldName, e.target.value)
                  }
                  label={o.label}
                />
              ))}
            </div>
          );
        }
        return null;
      }
    }
    return null;
  };

  render() {
    const { cells, rowNumber, selectedDates } = this.props;

    return (
      <div>
        <div className="vaos-calendar__calendar-week">
          {cells.map((date, index) => (
            <CalendarCell
              key={`row-${rowNumber}-cell-${index}`}
              date={date}
              formattedDate={moment(date).format('D')}
              isCurrentlySelected={this.isCurrentlySelected(date)}
              isInSelectedMap={selectedDates[date] !== undefined}
              onClick={this.handleSelectDate}
              disabled={this.isDisabled(date)}
            />
          ))}
        </div>
        {this.renderOptions()}
      </div>
    );
  }
}
