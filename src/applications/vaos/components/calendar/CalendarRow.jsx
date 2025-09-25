import PropTypes from 'prop-types';
import React from 'react';

import { isAfter, isBefore, isValid, parseISO, startOfDay } from 'date-fns';
import CalendarCell from './CalendarCell';

function isCellDisabled({ date, availableSlots, minDate, maxDate }) {
  let disabled = false;

  // If user provides an array of availableDates, disable dates that are not
  // in the array.
  if (
    (Array.isArray(availableSlots) &&
      !availableSlots.some(slot => slot?.start?.startsWith(date))) ||
    isBefore(startOfDay(parseISO(date)), startOfDay(new Date()))
  ) {
    disabled = true;
  }

  // If minDate provided, disable dates before minDate
  if (
    minDate &&
    isValid(minDate) &&
    isBefore(startOfDay(parseISO(date)), startOfDay(minDate))
  ) {
    disabled = true;
  }

  // If maxDate provided, disable dates after maxDate
  if (
    maxDate &&
    isValid(maxDate) &&
    isAfter(startOfDay(parseISO(date)), startOfDay(maxDate))
  ) {
    disabled = true;
  }

  return disabled;
}

export default function CalendarRow({
  availableSlots,
  cells,
  currentlySelectedDate,
  disabled,
  handleSelectDate,
  handleSelectOption,
  hasError,
  maxDate,
  maxSelections,
  minDate,
  renderIndicator,
  renderOptions,
  renderSelectedLabel,
  rowNumber,
  selectedDates,
  id,
  timezone,
  showWeekends,
}) {
  return (
    <div>
      <div
        className="vads-u-flex-wrap--wrap vads-u-display--flex vads-u-justify-content--space-between"
        role="row"
      >
        {cells.map((date, index) => (
          <CalendarCell
            availableSlots={availableSlots}
            currentlySelectedDate={currentlySelectedDate}
            date={date}
            disabled={
              disabled ||
              isCellDisabled({
                date,
                availableSlots,
                minDate,
                maxDate,
              })
            }
            handleSelectOption={handleSelectOption}
            hasError={hasError}
            index={index}
            key={`row-${rowNumber}-cell-${index}`}
            maxSelections={maxSelections}
            onClick={handleSelectDate}
            selectedDates={selectedDates}
            renderIndicator={renderIndicator}
            renderSelectedLabel={renderSelectedLabel}
            renderOptions={renderOptions}
            id={id}
            timezone={timezone}
            showWeekends={showWeekends}
          />
        ))}
      </div>
    </div>
  );
}

CalendarRow.propTypes = {
  cells: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleSelectDate: PropTypes.func.isRequired,
  handleSelectOption: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  rowNumber: PropTypes.number.isRequired,
  availableSlots: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.string,
      end: PropTypes.string,
    }),
  ),
  currentlySelectedDate: PropTypes.string,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  maxDate: PropTypes.instanceOf(Date),
  maxSelections: PropTypes.number,
  minDate: PropTypes.instanceOf(Date),
  renderIndicator: PropTypes.func,
  renderOptions: PropTypes.func,
  renderSelectedLabel: PropTypes.func,
  selectedDates: PropTypes.arrayOf(PropTypes.string),
  showWeekends: PropTypes.bool,
  timezone: PropTypes.string,
};
