import React from 'react';
import classNames from 'classnames';

/*
 * Simiarly to slots, but for checkboxes, which we know we only ever have two of
 * So calculations are against either the first or the second one
 */
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

export default function DateTimeRequestOptions({
  currentlySelectedDate,
  selectedDates,
  rowSize,
  selectedCellIndex,
  maxSelections,
  hasError,
  onChange,
  id,
}) {
  const options = [
    {
      value: `${currentlySelectedDate}T00:00:00.000`,
      label: 'A.M.',
      secondaryLabel: 'Before noon',
    },
    {
      value: `${currentlySelectedDate}T12:00:00.000`,
      label: 'P.M.',
      secondaryLabel: 'Noon or later',
    },
  ];
  const maxCellsPerRow = rowSize;
  const middleCellIndex = 2;
  const beginningCellIndex = [0, 1];
  const endCellIndexes = [3, 4];
  const justifyClasses =
    options.length < maxCellsPerRow
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

  // If list of items won't fill row, align items closer to selected cell
  const cssClasses = classNames('vaos-calendar__options', {
    'vaos-calendar__options--checkbox': true,
    'vads-u-padding-left--1p5': hasError,
    ...justifyClasses,
  });

  return (
    <div className={cssClasses}>
      {options.map((o, index) => {
        const checked = selectedDates.includes(o.value);
        const disabled = !checked && selectedDates?.length === maxSelections;

        const divClasses = classNames(
          'vaos-calendar__option',
          'vaos-calendar__option--checkbox',
          'vads-u-background-color--white',
          {
            'vads-u-border-color--gray-light': disabled,
            disabled,
          },
        );

        const labelClasses = classNames(
          'vads-u-margin--0',
          'vads-u-font-weight--bold',
          {
            'vads-u-color--primary': !disabled,
            'vads-u-color--gray-medium': disabled,
          },
        );

        return (
          <div key={o.value} className={getCheckboxOptionClasses(index)}>
            <div className={divClasses}>
              <input
                id={`${id}_${currentlySelectedDate}_${index}`}
                type="checkbox"
                name={id}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
              />
              <label
                className={labelClasses}
                htmlFor={`${id}_${currentlySelectedDate}_${index}`}
              >
                <span aria-hidden="true">{o.label}</span>
                <span className="vads-u-visibility--screen-reader">
                  {o.label} appointment
                </span>
              </label>
              <span>{o.secondaryLabel}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
