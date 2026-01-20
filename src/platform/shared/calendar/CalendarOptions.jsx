import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { CalendarContext } from './CalendarContext';
import CalendarOptionsSlots from './CalendarOptionsSlots';

const smallMediaQuery = '(min-width: 481px)';
const smallDesktopMediaQuery = '(min-width: 1008px)';

// matches vaos-calendar__option-cell widths
function calculateRowSize() {
  if (matchMedia(smallDesktopMediaQuery).matches) {
    return 4;
  }
  if (matchMedia(smallMediaQuery).matches) {
    return 3;
  }

  return 2;
}

export default function CalendarOptions({
  currentlySelectedDate,
  availableSlots,
  handleSelectOption,
  hasError,
  maxSelections,
  renderOptions,
  selectedDates,
  selectedCellIndex,
  optionsHeightRef,
  timezone,
  id,
  showWeekends,
  buttonRef,
  optionsHeight,
  setOptionsHeight,
}) {
  const {
    isAppointmentSelectionError,
    appointmentSelectionErrorMsg,
  } = useContext(CalendarContext);
  // Because we need to conditionally apply classes to get the right padding
  // and border radius for each cell, we need to know when the page size trips
  // a breakpoint
  const [rowSize, setRowSize] = useState(() => calculateRowSize());
  useEffect(() => {
    function updateRowSize() {
      setRowSize(calculateRowSize());
    }

    const smallMatcher = matchMedia(smallMediaQuery);
    // IE 11 and some versions of Safari don't support addEventListener here
    smallMatcher.addListener(updateRowSize);

    const smallDesktopMatcher = matchMedia(smallDesktopMediaQuery);
    smallDesktopMatcher.addListener(updateRowSize);

    return () => {
      smallMatcher.removeListener(updateRowSize);
      smallDesktopMatcher.removeListener(updateRowSize);
    };
  }, []);

  useEffect(() => {
    if (optionsHeightRef?.current && buttonRef?.current) {
      const newHeight =
        optionsHeightRef.current.getBoundingClientRect().height +
        buttonRef.current.getBoundingClientRect().height +
        10;

      if (newHeight !== optionsHeight) {
        setOptionsHeight(() => {
          return newHeight;
        });
      }
    }
  });

  const containerClasses = classNames('vaos-calendar__options-container');

  return (
    <div
      className={containerClasses}
      id={`vaos-options-container-${currentlySelectedDate}`}
      ref={optionsHeightRef}
    >
      {isAppointmentSelectionError && (
        <div
          className={classNames(
            'vaos-calendar__options',
            'usa-input-error',
            'vads-u-margin-top--0',
            'vads-u-margin-bottom--0',
            'vads-u-padding-top--0',
            'vads-u-padding-bottom--0',
          )}
          style={{ position: 'static' }}
        >
          <span
            className={classNames(
              'vaos-calendar__validation-msg, usa-input-error-message',
              {},
            )}
            style={{ position: 'static' }}
            role="alert"
          >
            {appointmentSelectionErrorMsg}
          </span>
        </div>
      )}
      <fieldset>
        <legend className="vads-u-visibility--screen-reader">
          Please select an option for this date
        </legend>
        {!!renderOptions &&
          renderOptions({
            id,
            currentlySelectedDate,
            availableSlots,
            selectedDates,
            rowSize,
            selectedCellIndex,
            maxSelections,
            hasError,
            onChange: handleSelectOption,
            timezone,
          })}
        {!renderOptions && (
          <CalendarOptionsSlots
            id={id}
            currentlySelectedDate={currentlySelectedDate}
            availableSlots={availableSlots}
            selectedDates={selectedDates}
            rowSize={rowSize}
            selectedCellIndex={selectedCellIndex}
            maxSelections={maxSelections}
            hasError={hasError || isAppointmentSelectionError}
            onChange={handleSelectOption}
            timezone={timezone}
            showWeekends={showWeekends}
          />
        )}
      </fieldset>
    </div>
  );
}
CalendarOptions.propTypes = {
  availableSlots: PropTypes.array,
  buttonRef: PropTypes.object,
  currentlySelectedDate: PropTypes.string,
  handleSelectOption: PropTypes.func,
  hasError: PropTypes.bool,
  id: PropTypes.string,
  maxSelections: PropTypes.number,
  optionsHeight: PropTypes.number,
  optionsHeightRef: PropTypes.object,
  renderOptions: PropTypes.func,
  selectedCellIndex: PropTypes.number,
  selectedDates: PropTypes.array,
  setOptionsHeight: PropTypes.func,
  showWeekends: PropTypes.bool,
  timezone: PropTypes.string,
};
