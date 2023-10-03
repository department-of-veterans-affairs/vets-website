import React from 'react';

import moment from 'moment';
import CalendarCell from './CalendarCell';

function isCellDisabled({ date, availableSlots, minDate, maxDate }) {
  let disabled = false;

  // If user provides an array of availableDates, disable dates that are not
  // in the array.
  if (
    (Array.isArray(availableSlots) &&
      !availableSlots.some(slot => slot?.start?.startsWith(date))) ||
    moment(date).isBefore(moment().format('YYYY-MM-DD'))
  ) {
    disabled = true;
  }

  // If minDate provided, disable dates before minDate
  if (
    minDate &&
    moment(minDate).isValid() &&
    moment(date).isBefore(moment(minDate))
  ) {
    disabled = true;
  }

  // If maxDate provided, disable dates after maxDate
  if (
    maxDate &&
    moment(maxDate).isValid() &&
    moment(date).isAfter(moment(maxDate))
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
            onClick={() => handleSelectDate(date, rowNumber)}
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
