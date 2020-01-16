import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  const [optionsNode, setOptionsNode] = useState(null);
  const buttonRef = useRef();

  const optionsHeightRef = useCallback(
    node => {
      const isCurrentlySelected = currentlySelectedDate === date;
      if (buttonRef !== null && node !== null && isCurrentlySelected) {
        setOptionsHeight(
          node.getBoundingClientRect().height +
            buttonRef.current.getBoundingClientRect().height,
        );
        setOptionsNode(node);
      }
    },
    [currentlySelectedDate, date],
  );

  useEffect(() => {
    const isCurrentlySelected = currentlySelectedDate === date;
    if (isCurrentlySelected) {
      const onResize = debounce(50, () => {
        if (optionsNode) {
          const newHeight =
            optionsNode.getBoundingClientRect().height +
            buttonRef.current.getBoundingClientRect().height;

          if (newHeight !== optionsHeight) {
            setOptionsHeight(newHeight);
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
      <CalendarOptions
        isCurrentlySelected={isCurrentlySelected}
        selectedCellIndex={index}
        currentlySelectedDate={date}
        additionalOptions={additionalOptions}
        handleSelectOption={handleSelectOption}
        optionsError={optionsError}
        selectedDates={selectedDates}
        optionsHeightRef={optionsHeightRef}
      />
    </div>
  );
};

export default CalendarCell;
