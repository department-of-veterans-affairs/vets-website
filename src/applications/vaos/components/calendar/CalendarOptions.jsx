import React from 'react';
import classNames from 'classnames';
import CalendarRadioOption from './CalendarRadioOption';
import CalendarCheckboxOption from './CalendarCheckboxOption';
import { isDateOptionPairInSelectedArray } from './../../utils/calendar';

export default function CalendarOptions({
  currentlySelectedDate,
  additionalOptions,
  handleSelectOption,
  maxSelections,
  selectedDates,
  selectedCellIndex,
  optionsHeightRef,
  hasError,
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

    // If list of items won't fill row, align items closer to selected cell
    const cssClasses = classNames(
      'vaos-calendar__options',
      {
        'vads-u-padding-left--1p5': hasError,
      },
      selectedDateOptions.length < maxCellsPerRow
        ? {
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
      <div
        className="vaos-calendar__options-container"
        id={`vaos-options-container-${currentlySelectedDate}`}
        ref={optionsHeightRef}
      >
        <fieldset>
          <legend className="vads-u-visibility--screen-reader">
            {additionalOptions.legend ||
              'Please select an option for this date'}
          </legend>
          <div className={cssClasses}>
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

              return (
                <div
                  key={`option-${index}`}
                  className="vaos-calendar__option-cell"
                >
                  {additionalOptions?.maxSelections > 1 ? (
                    <CalendarCheckboxOption
                      id={`${currentlySelectedDate}_${index}`}
                      fieldName={fieldName}
                      value={o.value}
                      checked={checked}
                      onChange={() => handleSelectOption(dateObj)}
                      label={o.label}
                      disabled={
                        !checked && selectedDates?.length === maxSelections
                      }
                    />
                  ) : (
                    <CalendarRadioOption
                      id={`${currentlySelectedDate}_${index}`}
                      fieldName={fieldName}
                      value={o.value}
                      checked={checked}
                      onChange={() => handleSelectOption(dateObj)}
                      label={o.label}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </fieldset>
      </div>
    );
  }
  return null;
}
