/**
 * Shared calendar widget component used by the VAOS application.
 * @module components/calendar
 */
import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  addMonths,
  format,
  isSameDay,
  parseISO,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import { CalendarContext } from './CalendarContext';
import CalendarNavigation from './CalendarNavigation';
import CalendarRow from './CalendarRow';
import CalendarWeekdayHeader from './CalendarWeekdayHeader';
import {
  getAppointmentConflict,
  getMaxMonth,
  handleNext,
  handlePrev,
  getCalendarWeeks,
} from './utils/utils';

/**
 * Calendar widget
 *
 * @param {Object} props
 * @param {Array<Slot>} props.availableSlots
 * @param {string} props.id
 * @param {boolean} props.disabled
 * @param {string} props.disabledMessage
 * @param {Date} props.maxDate
 * @param {number} props.maxSelections
 * @param {string} props.maxSelectionsError
 * @param {Date} props.minDate
 * @param {Function} props.onChange
 * @param {Function} props.onNextMonth
 * @param {Function} props.onPreviousMonth
 * @param {Function} props.renderOptions
 * @param {Function} props.renderIndicator
 * @param {Function} props.renderSelectedLabel
 * @param {boolean} props.required
 * @param {string} props.requiredMessage
 * @param {boolean} props.showValidation
 * @param {Date} props.startMonth
 * @param {string} props.timezone America/Denver
 * @param {Array<string>} props.value
 * @param {boolean} [props.showWeekends=false] Whether to show full weekend slots or not
 * @param {boolean} [props.overrideMaxDays=false] Disables the default max days value
 * @param {boolean} [props.hideWhileDisabled=false] Whether to show the calendar while disabled
 * @returns {JSX.Element} props.Calendar Calendar Widget
 */
function CalendarWidget({
  appointmentSelectionErrorMsg = 'You already have an appointment scheduled at this time. Please select another day or time.',
  availableSlots,
  id,
  disabled,
  disabledMessage,
  maxDate,
  maxSelections = 1,
  minDate,
  onChange,
  onNextMonth,
  onPreviousMonth,
  overrideMaxDays = false,
  renderOptions,
  renderIndicator,
  renderSelectedLabel,
  required,
  requiredMessage = 'Please select a date',
  showValidation,
  startMonth: startDate,
  timezone,
  value = [],
  showWeekends = false,
  upcomingAppointments = [],
  isAppointmentSelectionError,
  hideWhileDisabled = false,
  alertTrigger = 0,
  setAlertTrigger = () => {},
}) {
  const [currentlySelectedDate, setCurrentlySelectedDate] = useState(date => {
    if (date) {
      return date.split('T')[0];
    }

    return null;
  });
  const currentDate = new Date();
  const maxMonth = getMaxMonth(maxDate, overrideMaxDays);
  const [dates, setDates] = useState([startDate || minDate]);
  const exceededMaximumSelections = value.length > maxSelections;
  const hasError = (required && showValidation) || exceededMaximumSelections;
  let maxSelectionsError;
  if (exceededMaximumSelections) {
    const deselect =
      value.length === maxSelections + 1
        ? `the ${value.length}th time`
        : `${value.length - maxSelections} times`;
    maxSelectionsError = `You can only select ${maxSelections} times for your appointment. Deselect ${deselect} to continue.`;
  }

  // Undefined allows to unset aria-hidden
  const hideCalendar = (disabled && hideWhileDisabled) || undefined;
  const calendarCss = classNames('vaos-calendar__calendars vads-u-flex--1', {
    'vaos-calendar__disabled': disabled,
    'usa-input-error': hasError,
    'vads-u-visibility--hidden': hideCalendar,
  });

  // declare const from renderMonth here
  const nextMonthToDisplay = startOfMonth(
    addMonths(dates[dates.length - 1], 1),
  );

  const prevDisabled =
    disabled || startOfDay(dates[0]) <= startOfDay(currentDate);
  const nextDisabled = disabled || nextMonthToDisplay > maxMonth;

  return (
    <CalendarContext.Provider
      value={{
        isAppointmentSelectionError,
        appointmentSelectionErrorMsg,
      }}
    >
      <div className="vaos-calendar vads-u-margin-top--4 vads-u-display--flex">
        {disabled && (
          <div className="vaos-calendar__disabled-overlay">
            {disabledMessage}
          </div>
        )}
        <div
          data-testid="vaos-calendar"
          className={calendarCss}
          aria-hidden={hideCalendar}
        >
          {hasError && (
            <span
              className="vaos-calendar__validation-msg usa-input-error-message vaos-input-error-message"
              role="alert"
            >
              {showValidation && requiredMessage}
            </span>
          )}
          {exceededMaximumSelections && (
            <span
              className="usa-input-error-message"
              role="alert"
              id="vaos-calendar-max-selections-error"
              key={alertTrigger}
            >
              {maxSelectionsError}
            </span>
          )}
          {dates.map(
            (date, index) =>
              date <= maxMonth ? (
                <div
                  key={`month-${index}`}
                  className="vaos-calendar__container vads-u-margin-bottom--3"
                  aria-labelledby={`h2-${format(date, 'yyyy-MM')}`}
                  role="table"
                >
                  <>
                    {index === 0 && (
                      <CalendarNavigation
                        prevOnClick={() => {
                          setAlertTrigger();
                          handlePrev(onPreviousMonth, dates, setDates);
                        }}
                        nextOnClick={() => {
                          setAlertTrigger();
                          handleNext(onNextMonth, dates, setDates);
                        }}
                        date={date}
                        prevDisabled={prevDisabled}
                        nextDisabled={nextDisabled}
                      />
                    )}
                    <hr aria-hidden="true" className="vads-u-margin-y--1" />
                    <CalendarWeekdayHeader showFullWeek={showWeekends} />
                    <div role="rowgroup">
                      {getCalendarWeeks(date, showWeekends).map(
                        (week, weekIndex) => (
                          <CalendarRow
                            availableSlots={availableSlots}
                            cells={week}
                            id={id}
                            timezone={timezone}
                            currentlySelectedDate={currentlySelectedDate}
                            handleSelectDate={dateSelection => {
                              if (maxSelections === 1) {
                                onChange([]);
                              }

                              if (
                                exceededMaximumSelections &&
                                (dateSelection === currentlySelectedDate ||
                                  (value?.length > 0 &&
                                    !value.some(selectedDate =>
                                      isSameDay(
                                        parseISO(dateSelection),
                                        parseISO(selectedDate),
                                      ),
                                    )))
                              ) {
                                setAlertTrigger();
                              }

                              setCurrentlySelectedDate(
                                dateSelection === currentlySelectedDate
                                  ? null
                                  : dateSelection,
                              );
                            }}
                            handleSelectOption={aDate => {
                              if (maxSelections > 1) {
                                if (value.includes(aDate)) {
                                  onChange(
                                    value.filter(
                                      selectedDate => selectedDate !== aDate,
                                    ),
                                  );
                                } else {
                                  onChange(value.concat(aDate));
                                }
                              } else {
                                const hasConflict = getAppointmentConflict(
                                  aDate,
                                  upcomingAppointments,
                                  availableSlots,
                                );
                                onChange([aDate], hasConflict);
                              }
                            }}
                            hasError={hasError}
                            key={`row-${weekIndex}`}
                            maxDate={maxDate}
                            maxSelections={maxSelections}
                            minDate={minDate}
                            rowNumber={weekIndex}
                            selectedDates={value}
                            renderIndicator={renderIndicator}
                            renderOptions={renderOptions}
                            renderSelectedLabel={renderSelectedLabel}
                            disabled={disabled}
                            showWeekends={showWeekends}
                          />
                        ),
                      )}
                    </div>
                  </>
                </div>
              ) : null,
          )}
        </div>
      </div>
    </CalendarContext.Provider>
  );
}

CalendarWidget.propTypes = {
  id: PropTypes.string.isRequired,
  alertTrigger: PropTypes.number,
  appointmentSelectionErrorMsg: PropTypes.string,
  availableSlots: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.string.isRequired,
      end: PropTypes.string,
    }),
  ),
  disabled: PropTypes.bool,
  disabledMessage: PropTypes.object,
  hideWhileDisabled: PropTypes.bool,
  isAppointmentSelectionError: PropTypes.bool,
  maxDate: PropTypes.instanceOf(Date),
  maxSelections: PropTypes.number,
  maxSelectionsError: PropTypes.string,
  minDate: PropTypes.instanceOf(Date),
  overrideMaxDays: PropTypes.bool,
  renderIndicator: PropTypes.func,
  renderOptions: PropTypes.func,
  renderSelectedLabel: PropTypes.func,
  required: PropTypes.bool,
  requiredMessage: PropTypes.string,
  setAlertTrigger: PropTypes.func,
  showValidation: PropTypes.bool,
  showWeekends: PropTypes.bool,
  startMonth: PropTypes.instanceOf(Date),
  timezone: PropTypes.string,
  upcomingAppointments: PropTypes.object,
  value: PropTypes.array,
  onChange: PropTypes.func,
  onNextMonth: PropTypes.func,
  onPreviousMonth: PropTypes.func,
};

export default CalendarWidget;
