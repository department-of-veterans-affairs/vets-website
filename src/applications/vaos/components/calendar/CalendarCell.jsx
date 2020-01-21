import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import debounce from 'platform/utilities/data/debounce';
import CalendarOptions from './CalendarOptions';
import CalendarSelectedIndicator from './CalendarSelectedIndicator';

const CalendarCell = ({
  additionalOptions,
  currentlySelectedDate,
  date,
  disabled,
  handleSelectOption,
  index,
  inSelectedArray,
  onClick,
  optionsError,
  selectedDates,
  selectedIndicatorType,
}) => {
  const [optionsHeight, setOptionsHeight] = useState(0);
  const buttonRef = useRef(null);
  const optionsHeightRef = useRef(null);

  useEffect(
    () => {
      if (date !== null && currentlySelectedDate === date) {
        const onResize = debounce(50, () => {
          if (optionsHeightRef?.current && buttonRef?.current) {
            const newHeight =
              optionsHeightRef.current.getBoundingClientRect().height +
              buttonRef.current.getBoundingClientRect().height;

            if (newHeight !== optionsHeight) {
              setOptionsHeight(newHeight);
            }
          }
        });

        if (optionsHeightRef?.current && buttonRef?.current) {
          const newHeight =
            optionsHeightRef.current.getBoundingClientRect().height +
            buttonRef.current.getBoundingClientRect().height;

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
        <button className=" vads-u-visibility--hidden" />
      </div>
    );
  }

  const isCurrentlySelected = currentlySelectedDate === date;
  const momentDate = moment(date);
  const dateDay = momentDate.format('D');
  const ariaDate = momentDate.format('dddd, MMMM Do');

  const cssClasses = classNames('vaos-calendar__calendar-day', {
    'vaos-calendar__cell-current': isCurrentlySelected,
    'vaos-calendar__cell-selected': inSelectedArray,
  });

  return (
    <div
      role="cell"
      className={cssClasses}
      style={{ height: isCurrentlySelected ? optionsHeight : 'auto' }}
    >
      <button
        id={`date-cell-${date}`}
        onClick={() => onClick(date)}
        disabled={disabled}
        aria-label={ariaDate}
        aria-expanded={isCurrentlySelected}
        type="button"
        ref={buttonRef}
      >
        {inSelectedArray && (
          <CalendarSelectedIndicator
            date={date}
            fieldName={additionalOptions?.fieldName}
            selectedDates={selectedDates}
            selectedIndicatorType={selectedIndicatorType}
          />
        )}
        {dateDay}
        {isCurrentlySelected && (
          <span className="vaos-calendar__cell-selected-triangle" />
        )}
      </button>
      {isCurrentlySelected && (
        <CalendarOptions
          selectedCellIndex={index}
          currentlySelectedDate={date}
          additionalOptions={additionalOptions}
          handleSelectOption={handleSelectOption}
          optionsError={optionsError}
          selectedDates={selectedDates}
          optionsHeightRef={optionsHeightRef}
        />
      )}
    </div>
  );
};

export default CalendarCell;
