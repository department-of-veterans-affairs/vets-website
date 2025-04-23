import React, { useContext } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { CalendarContext } from './CalendarContext';

/*
 * Because we want to create a background for a jagged grid of cells,
 * we need to set padding and border radius for each cell depending on
 * where it is in the grid and how many cells per row we're displaying
 *
 * This was a huge pain to figure out
 */
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

export default function CalendarOptionsSlots({
  availableSlots,
  currentlySelectedDate,
  selectedDates,
  rowSize,
  selectedCellIndex,
  maxSelections,
  hasError,
  onChange,
  id,
  timezone,
  showWeekends,
}) {
  const { isAppointmentSelectionError } = useContext(CalendarContext);
  const currentSlots = availableSlots.filter(slot =>
    slot?.start?.startsWith(currentlySelectedDate),
  );

  // [0, 1, 2, 3, 4, 5, 6]
  const maxCellsPerRow = rowSize;
  const middleCellIndex = showWeekends ? [2, 3, 4] : [2];
  const tuesThursCellIndex = [2, 4];
  const beginningCellIndex = [0, 1];
  const endCellIndexes = showWeekends ? [5, 6] : [3, 4];
  const justifyClasses =
    currentSlots.length < maxCellsPerRow
      ? {
          'vads-u-justify-content--flex-start': beginningCellIndex.includes(
            selectedCellIndex,
          ),
          'vads-u-justify-content--center': middleCellIndex.includes(
            selectedCellIndex,
          ),
          'vads-u-justify-content--flex-end': endCellIndexes.includes(
            selectedCellIndex,
          ),
        }
      : {};

  const marginClasses =
    currentSlots.length <= 1 && showWeekends
      ? {
          'vaos-calendar__option-cell--full-width': tuesThursCellIndex.includes(
            selectedCellIndex,
          ),
        }
      : {};

  // If list of items won't fill row, align items closer to selected cell
  const cssClasses = classNames('vaos-calendar__options', {
    'vads-u-padding-left--1p5': hasError,
    ...marginClasses,
    ...justifyClasses,
    'usa-input-error': hasError && isAppointmentSelectionError,
    'vads-u-margin-top--0': hasError && isAppointmentSelectionError,
    'vads-u-margin-bottom--0': hasError && isAppointmentSelectionError,
    'vads-u-padding-top--0': hasError && isAppointmentSelectionError,
    'vads-u-padding-bottom--0': hasError && isAppointmentSelectionError,
  });
  return (
    <div
      className={cssClasses}
      style={{
        position: hasError && isAppointmentSelectionError ? 'static' : null,
      }}
    >
      {currentSlots.map((slot, index) => {
        const checked = selectedDates.some(
          selectedDate => selectedDate === slot.start,
        );

        const timeString = formatInTimeZone(
          new Date(slot.start),
          timezone,
          'h:mm aaaa',
        );

        const [time, meridiem] = timeString.split(' ');
        const screenReaderMeridiem = meridiem.replace(/\./g, '').toUpperCase();
        const label = (
          <>
            {time} <span aria-hidden="true">{meridiem}</span>{' '}
            <span className="sr-only">{screenReaderMeridiem}</span>
          </>
        );

        if (maxSelections > 1) {
          throw new Error(
            'Multi-select is currently not implemented without using renderOptions',
          );
        }

        return (
          <div
            className={getOptionClasses(index, currentSlots.length, rowSize)}
            key={`option-${index}`}
          >
            <div className="vaos-calendar__option vaos-calendar__option--radio">
              <input
                id={`${id}_${currentlySelectedDate}_${index}`}
                type="radio"
                name={id}
                value={slot.start}
                checked={checked}
                onChange={() => onChange(slot.start)}
              />
              <label
                className="vads-u-margin--0 vads-u-font-weight--bold vads-u-color--primary"
                htmlFor={`${id}_${currentlySelectedDate}_${index}`}
              >
                <span aria-hidden="true">{label}</span>
                <span className="vads-u-visibility--screen-reader">
                  {label} option selected
                </span>
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
}
CalendarOptionsSlots.propTypes = {
  availableSlots: PropTypes.array,
  currentlySelectedDate: PropTypes.string,
  hasError: PropTypes.bool,
  id: PropTypes.string,
  maxSelections: PropTypes.number,
  rowSize: PropTypes.number,
  selectedCellIndex: PropTypes.number,
  selectedDates: PropTypes.array,
  showWeekends: PropTypes.bool,
  timezone: PropTypes.string,
  onChange: PropTypes.func,
};
