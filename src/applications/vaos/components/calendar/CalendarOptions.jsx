import React, { useState, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import debounce from 'platform/utilities/data/debounce';
import CalendarRadioOption from './CalendarRadioOption';
import CalendarCheckboxOption from './CalendarCheckboxOption';
import { isDateOptionPairInSelectedArray } from './../../utils/calendar';

export default function CalendarOptions({
  isCurrentlySelected,
  currentlySelectedDate,
  additionalOptions,
  handleSelectOption,
  optionsError,
  selectedDates,
  selectedCellIndex,
}) {
  const [fieldsetHeight, setFieldsetHeight] = useState(0);
  const [fieldsetNode, setFieldsetNode] = useState(null);

  const measuredHeight = useCallback(
    node => {
      if (node !== null && isCurrentlySelected) {
        setFieldsetHeight(node.getBoundingClientRect().height);
        setFieldsetNode(node);
      }
    },
    [isCurrentlySelected],
  );

  useEffect(() => {
    if (isCurrentlySelected) {
      const onResize = debounce(50, () => {
        if (fieldsetNode) {
          const newHeight = fieldsetNode.getBoundingClientRect().height;
          if (newHeight !== fieldsetHeight) {
            setFieldsetHeight(newHeight);
          }
        }
      });

      window.addEventListener('resize', onResize);

      return () => {
        window.removeEventListener('resize', onResize);
      };
    }

    return undefined;
  });

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
      <div
        aria-hidden={isCurrentlySelected ? 'false' : 'true'}
        className={isCurrentlySelected ? undefined : 'vads-u-display--none'}
        style={{ height: fieldsetHeight }}
      >
        <fieldset
          ref={measuredHeight}
          className="vaos-calendar__options-container"
        >
          <legend className="vads-u-visibility--screen-reader">
            {additionalOptions.legend ||
              'Please select an option for this date'}
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

              return (
                <div
                  key={`option-${index}`}
                  className="vaos-calendar__option-cell"
                >
                  {additionalOptions?.maxSelections > 1 ? (
                    <CalendarCheckboxOption
                      index={`${currentlySelectedDate}_${index}`}
                      fieldName={fieldName}
                      value={o.value}
                      checked={checked}
                      onChange={() => handleSelectOption(dateObj)}
                      label={o.label}
                    />
                  ) : (
                    <CalendarRadioOption
                      index={`${currentlySelectedDate}_${index}`}
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
