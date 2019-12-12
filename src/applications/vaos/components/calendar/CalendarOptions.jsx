import React from 'react';
import classNames from 'classnames';
import CalendarRadioOption from './CalendarRadioOption';
import CalendarCheckboxOption from './CalendarCheckboxOption';
import { isDateOptionPairInSelectedArray } from './../../utils/calendar';

export default function CalendarOptions({
  currentlySelectedDate,
  additionalOptions,
  handleSelectOption,
  optionsError,
  selectedDates,
  selectedCellIndex,
}) {
  const selectedDateOptions = additionalOptions?.getOptionsByDate(
    currentlySelectedDate,
  );

  if (selectedDateOptions) {
    const fieldName = additionalOptions.fieldName;

    const maxCellsPerRow = 4;
    const middleCellIndex = 2;
    const beginningCellIndex = [0, 1];
    const endCellIndexes = [3, 4];

    // If list of items is won't fill row, align items closer to selected cell
    const cssClasses = classNames(
      'vaos-calendar__options',
      selectedDateOptions.length < maxCellsPerRow
        ? {
            'usa-input-error': optionsError,
            'vads-u-justify-content--flex-start': beginningCellIndex.includes(
              selectedCellIndex,
            ),
            'vads-u-justify-content--center':
              selectedCellIndex === middleCellIndex,
            'vads-u-justify-content--flex-end': endCellIndexes.includes(
              selectedCellIndex,
            ),
          }
        : null,
    );

    return (
      <fieldset className="vaos-calendar__calendar-options">
        <legend className="vads-u-visibility--screen-reader">
          {additionalOptions.legend || 'Please select an option for this date'}
        </legend>
        <div className={cssClasses}>
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
      </fieldset>
    );
  }
  return null;
}
