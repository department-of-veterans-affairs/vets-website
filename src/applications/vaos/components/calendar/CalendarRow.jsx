import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

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

  getCssClasses = date => {
    const cssClasses = ['vaos-calendar__calendar-day'];

    if (this.isCurrentlySelected(date))
      cssClasses.push('vaos-calendar__cell-current');

    if (this.isInSelectedMap(date)) {
      cssClasses.push('vaos-calendar__cell-selected');
    }

    return cssClasses;
  };

  isCurrentlySelected = date => this.props.currentlySelectedDate === date;

  isInSelectedMap = date => this.props.selectedDates[date] !== undefined;

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

      for (let index = 0; index < cells.length; index++) {
        const cell = this.props.cells[index];
        if (cell !== null) {
          if (this.isCurrentlySelected(cell)) {
            showOptions = true;
          }
        }
      }

      if (showOptions) {
        const additionalOptions = getSelectedDateOptions(currentlySelectedDate);

        if (additionalOptions) {
          const fieldName = additionalOptions.fieldName;
          return (
            <div
              className={`vaos-calendar__options vads-u-display--flex vads-u-flex-wrap--wrap vads-u-margin-y--2${
                optionsError ? ' usa-input-error' : ''
              }`}
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
                <div
                  key={`radio-${index}`}
                  className="vaos-calendar__option vads-u-display--flex vads-u-border--1px vads-u-justify-content--center vads-u-align-items--center vads-u-padding-y--1p5 vads-u-padding-x--0 vads-u-margin-right--1 vads-u-margin-bottom--1 vads-u-border-color--primary"
                >
                  <input
                    id={`radio-${index}`}
                    type="radio"
                    name={fieldName}
                    value={o.value}
                    checked={
                      selectedDates[currentlySelectedDate][fieldName] ===
                      o.value
                    }
                    onChange={e =>
                      this.handleSelectOption(fieldName, e.target.value)
                    }
                  />
                  <label
                    className="vads-u-margin--0 vads-u-font-weight--bold vads-u-color--primary"
                    htmlFor={`radio-${index}`}
                  >
                    {o.label}
                  </label>
                </div>
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
    const { cells, rowNumber } = this.props;

    return (
      <div>
        <div className="vaos-calendar__calendar-week">
          {cells.map((date, index) => {
            if (date === null) {
              return (
                <button
                  key={`row-${rowNumber}-cell-${index}`}
                  className="vaos-calendar__calendar-day vads-u-visibility--hidden"
                />
              );
            }

            const cssClasses = this.getCssClasses(date);

            return (
              <button
                key={`row-${rowNumber}-cell-${index}`}
                id={`date-cell-${date}`}
                className={cssClasses.join(' ')}
                onClick={() => this.handleSelectDate(date)}
                disabled={this.isDisabled(date)}
              >
                {this.isInSelectedMap(date) && (
                  <i className="fas fa-check vads-u-color--white" />
                )}
                {moment(date).format('D')}
                {this.isCurrentlySelected(date) && (
                  <span className="vaos-calendar__cell-selected-triangle" />
                )}
              </button>
            );
          })}
        </div>
        {this.renderOptions()}
      </div>
    );
  }
}
