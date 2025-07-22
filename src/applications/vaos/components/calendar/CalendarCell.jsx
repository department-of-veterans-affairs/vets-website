/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
/* eslint-disable @department-of-veterans-affairs/prefer-icon-component */
import classNames from 'classnames';
import { format, parseISO } from 'date-fns';
import debounce from 'platform/utilities/data/debounce';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import CalendarOptions from './CalendarOptions';

const CalendarCell = ({
  availableSlots,
  currentlySelectedDate,
  date,
  disabled,
  handleSelectOption,
  hasError,
  index,
  maxSelections,
  onClick,
  renderIndicator,
  renderOptions,
  renderSelectedLabel,
  selectedDates,
  id,
  timezone,
  showWeekends,
}) => {
  const [optionsHeight, setOptionsHeight] = useState(0);
  const buttonRef = useRef(null);
  const optionsHeightRef = useRef(null);
  const inSelectedArray = selectedDates?.some(selectedDate =>
    selectedDate?.startsWith(date),
  );

  useEffect(
    () => {
      if (date !== null && currentlySelectedDate === date) {
        const onResize = debounce(50, () => {
          if (optionsHeightRef?.current && buttonRef?.current) {
            const newHeight =
              optionsHeightRef.current.getBoundingClientRect().height +
              buttonRef.current.getBoundingClientRect().height +
              10;

            if (newHeight !== optionsHeight) {
              setOptionsHeight(newHeight);
            }
          }
        });

        if (optionsHeightRef?.current && buttonRef?.current) {
          const newHeight =
            optionsHeightRef.current.getBoundingClientRect().height +
            buttonRef.current.getBoundingClientRect().height +
            10;

          if (newHeight !== optionsHeight) {
            setOptionsHeight(newHeight);
          }
        }

        window.addEventListener('resize', onResize);

        return () => {
          window.removeEventListener('resize', onResize);
        };
      }

      return undefined;
    },
    [date, currentlySelectedDate, optionsHeight],
  );

  if (date === null) {
    return (
      <div role="cell" className="vaos-calendar__calendar-day">
        <button
          type="button"
          className="vads-u-padding--0 vads-u-visibility--hidden"
          aria-label="Non-existing Date"
        />
      </div>
    );
  }

  const isCurrentlySelected = currentlySelectedDate === date;
  const dateObj = parseISO(date);
  const dateDay = format(dateObj, 'd');
  const ariaDate = format(dateObj, 'EEEE, MMMM do');
  const buttonLabel = inSelectedArray
    ? `${ariaDate}, ${
        renderSelectedLabel
          ? renderSelectedLabel(date, selectedDates)
          : 'selected.'
      }`
    : ariaDate;

  const cssClasses = classNames('vaos-calendar__calendar-day', {
    'vaos-calendar__day--current': isCurrentlySelected,
    'vaos-calendar__day--selected': inSelectedArray,
  });

  return (
    <div
      role="cell"
      className={cssClasses}
      style={{ height: isCurrentlySelected ? optionsHeight : 'auto' }}
    >
      <button
        aria-controls={
          isCurrentlySelected ? `vaos-options-container-${date}` : undefined
        }
        className="vaos-calendar__calendar-day-button"
        id={`date-cell-${date}`}
        onClick={() => onClick(date)}
        disabled={disabled}
        aria-label={buttonLabel}
        aria-expanded={isCurrentlySelected}
        type="button"
        ref={buttonRef}
      >
        {inSelectedArray &&
          !!renderIndicator &&
          renderIndicator({ date, id, selectedDates })}
        {dateDay}
        {isCurrentlySelected && (
          <span className="vaos-calendar__day--selected-triangle" />
        )}
      </button>
      {isCurrentlySelected && (
        <CalendarOptions
          availableSlots={availableSlots}
          currentlySelectedDate={date}
          handleSelectOption={handleSelectOption}
          hasError={hasError}
          maxSelections={maxSelections}
          optionsHeightRef={optionsHeightRef}
          selectedCellIndex={index}
          selectedDates={selectedDates}
          renderOptions={renderOptions}
          id={id}
          timezone={timezone}
          showWeekends={showWeekends}
          optionsHeight={optionsHeight}
          setOptionsHeight={setOptionsHeight}
          buttonRef={buttonRef}
        />
      )}
    </div>
  );
};

export default CalendarCell;

CalendarCell.propTypes = {
  availableSlots: PropTypes.array,
  currentlySelectedDate: PropTypes.string,
  date: PropTypes.string,
  disabled: PropTypes.bool,
  handleSelectOption: PropTypes.func,
  hasError: PropTypes.bool,
  id: PropTypes.string,
  index: PropTypes.number,
  maxSelections: PropTypes.number,
  renderIndicator: PropTypes.func,
  renderOptions: PropTypes.func,
  renderSelectedLabel: PropTypes.func,
  selectedDates: PropTypes.array,
  showWeekends: PropTypes.bool,
  timezone: PropTypes.string,
  onClick: PropTypes.func,
};
