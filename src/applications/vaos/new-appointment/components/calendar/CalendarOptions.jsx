import React from 'react';
import classNames from 'classnames';
import CalendarRadioOption from './CalendarRadioOption';
import CalendarCheckboxOption from './CalendarCheckboxOption';
import { isDateOptionPairInSelectedArray } from './dateHelpers';

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

    const containerClasses = classNames(
      'vaos-calendar__options-container',
      'vads-u-display--flex',
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
    const useCheckboxes = additionalOptions?.maxSelections > 1;

    // If list of items won't fill row, align items closer to selected cell
    const cssClasses = classNames('vaos-calendar__options', {
      'vads-u-background-color--primary': useCheckboxes,
      'vaos-calendar__options--checkbox': useCheckboxes,
      'vads-u-padding-left--1p5': hasError,
    });

    const fieldsetClasses = classNames({
      'vads-u-width--auto': useCheckboxes,
    });

    return (
      <div
        className={containerClasses}
        id={`vaos-options-container-${currentlySelectedDate}`}
        ref={optionsHeightRef}
      >
        <fieldset className={fieldsetClasses}>
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

              if (useCheckboxes) {
                return (
                  <CalendarCheckboxOption
                    key={`option-${index}`}
                    id={`${currentlySelectedDate}_${index}`}
                    fieldName={fieldName}
                    value={o.value}
                    checked={checked}
                    onChange={() => handleSelectOption(dateObj)}
                    label={o.label}
                    secondaryLabel={o.secondaryLabel}
                    disabled={
                      !checked && selectedDates?.length === maxSelections
                    }
                  />
                );
              }

              return (
                <CalendarRadioOption
                  key={`option-${index}`}
                  id={`${currentlySelectedDate}_${index}`}
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
      </div>
    );
  }
  return null;
}
