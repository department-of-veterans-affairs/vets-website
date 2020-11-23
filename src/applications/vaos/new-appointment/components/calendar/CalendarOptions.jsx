import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import CalendarRadioOption from './CalendarRadioOption';
import CalendarCheckboxOption from './CalendarCheckboxOption';
import { isDateOptionPairInSelectedArray } from './dateHelpers';

function getOptionClasses(index, optionCount, rowSize) {
  return classNames(
    'vaos-calendar__option-cell',
    'vaos-calendar__option-cell--radio',
    {
      'vaos-u-border-radius--top-left': index === 0,
      'vaos-u-border-radius--top-right':
        index + 1 === rowSize ||
        (index + 1 === optionCount && optionCount < rowSize),
      'vaos-u-border-radius--bottom-left':
        index % rowSize === 0 && index + rowSize >= optionCount,
      'vaos-u-border-radius--bottom-right':
        (index + 1 === optionCount && optionCount < rowSize) ||
        ((index + 1) % rowSize === 0 && index + rowSize >= optionCount),
      'vads-u-padding-top--2': rowSize - index > 0,
      'vads-u-padding-left--2': index % rowSize === 0,
      'vads-u-padding-right--2':
        (index + 1) % rowSize === 0 ||
        (index + 1 === optionCount && optionCount < rowSize),
      'vaos-calendar__option-cell--last':
        index + 1 === optionCount &&
        (index + 1) % rowSize !== 0 &&
        optionCount > rowSize,
    },
  );
}

function getCheckboxOptionClasses(index) {
  return classNames('vaos-calendar__option-cell', {
    'vaos-u-border-radius--top-left': index === 0,
    'vaos-u-border-radius--top-right': index === 1,
    'vaos-u-border-radius--bottom-left': index === 0,
    'vaos-u-border-radius--bottom-right': index === 1,
    'vads-u-padding-left--2': index === 0,
    'vads-u-padding-top--2': true,
    'vads-u-padding-right--2': index === 1,
  });
}

const smallMediaQuery = '(min-width: 481px)';
const smallDesktopMediaQuery = '(min-width: 1008px)';

function calculateRowSize() {
  if (matchMedia(smallDesktopMediaQuery).matches) {
    return 4;
  } else if (matchMedia(smallMediaQuery).matches) {
    return 3;
  }

  return 2;
}

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
  const [rowSize, setRowSize] = useState(() => calculateRowSize());
  useEffect(() => {
    function updateRowSize() {
      setRowSize(calculateRowSize());
    }

    const smallMatcher = matchMedia(smallMediaQuery);
    smallMatcher.addListener(updateRowSize);

    const smallDesktopMatcher = matchMedia(smallDesktopMediaQuery);
    smallDesktopMatcher.addListener(updateRowSize);

    return () => {
      smallMatcher.removeListener(updateRowSize);
      smallDesktopMatcher.removeListener(updateRowSize);
    };
  }, []);

  const selectedDateOptions = additionalOptions?.getOptionsByDate(
    currentlySelectedDate,
  );

  if (selectedDateOptions) {
    const fieldName = additionalOptions.fieldName;

    const maxCellsPerRow = rowSize;
    const middleCellIndex = 2;
    const beginningCellIndex = [0, 1];
    const endCellIndexes = [3, 4];
    const justifyClasses =
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
        : {};

    const containerClasses = classNames('vaos-calendar__options-container');
    const useCheckboxes = additionalOptions?.maxSelections > 1;

    // If list of items won't fill row, align items closer to selected cell
    const cssClasses = classNames('vaos-calendar__options', {
      'vaos-calendar__options--checkbox': useCheckboxes,
      'vads-u-padding-left--1p5': hasError,
      ...justifyClasses,
    });

    return (
      <div
        className={containerClasses}
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

              if (useCheckboxes) {
                return (
                  <div
                    key={`option-${index}`}
                    className={getCheckboxOptionClasses(index)}
                  >
                    <CalendarCheckboxOption
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
                  </div>
                );
              }

              return (
                <div
                  className={getOptionClasses(
                    index,
                    selectedDateOptions.length,
                    rowSize,
                  )}
                  key={`option-${index}`}
                >
                  <CalendarRadioOption
                    id={`${currentlySelectedDate}_${index}`}
                    fieldName={fieldName}
                    value={o.value}
                    checked={checked}
                    onChange={() => handleSelectOption(dateObj)}
                    label={o.label}
                  />
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
