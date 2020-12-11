import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import * as actions from '../redux/actions';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import FormButtons from '../../components/FormButtons';
import CalendarWidget from './calendar/CalendarWidget';
import { getFormPageInfo } from '../redux/selectors';
import { CALENDAR_INDICATOR_TYPES } from '../../utils/constants';

const pageKey = 'requestDateTime';
const pageTitle = 'Choose a day and time for your appointment';

const maxSelections = 3;

const missingDateError =
  'Please select at least one preferred date for your appointment. You can select up to three dates.';
const maxSelectionsError =
  'You can only choose up to 3 dates for your appointment.';

export function getOptionsByDate() {
  return [
    {
      value: 'AM',
      label: 'AM',
      secondaryLabel: 'Before noon',
    },
    {
      value: 'PM',
      label: 'PM',
      secondaryLabel: 'Noon or later',
    },
  ];
}

function isMaxSelectionsError(validationError) {
  return validationError === maxSelectionsError;
}

function userSelectedSlot(calendarData) {
  return calendarData?.selectedDates?.length > 0;
}

function exceededMaxSelections(calendarData) {
  return calendarData?.selectedDates?.length > maxSelections;
}

function validate({ data, setValidationError }) {
  if (exceededMaxSelections(data)) {
    setValidationError(maxSelectionsError);
  } else if (!userSelectedSlot(data)) {
    setValidationError(missingDateError);
  } else {
    setValidationError(null);
  }
}

function goForward({
  data,
  history,
  routeToNextAppointmentPage,
  submitted,
  setSubmitted,
  setValidationError,
}) {
  const { calendarData } = data || {};
  validate({ data: calendarData, setValidationError });
  if (userSelectedSlot(calendarData) && !exceededMaxSelections(calendarData)) {
    routeToNextAppointmentPage(history, pageKey);
  } else if (submitted) {
    scrollAndFocus('.usa-input-error-message');
  } else {
    setSubmitted(true);
  }
}

export function DateTimeRequestPage({
  data,
  pageChangeInProgress,
  onCalendarChange,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
}) {
  const history = useHistory();
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  useEffect(
    () => {
      if (
        validationError &&
        (isMaxSelectionsError(validationError) || submitted)
      ) {
        scrollAndFocus('.usa-input-error-message');
      }
    },
    [validationError, submitted],
  );

  const calendarData = data?.calendarData || {};
  const { currentlySelectedDate, selectedDates } = calendarData;

  const additionalOptions = {
    fieldName: 'optionTime',
    required: true,
    maxSelections: 2,
    validationMessage:
      'Please select a preferred time or unselect this date to continue',
    getOptionsByDate,
  };

  return (
    <div className="vaos-form__detailed-radio">
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      <p>
        You can choose up to 3 dates. A scheduling coordinator will call you to
        schedule the best time for your appointment.
      </p>
      <CalendarWidget
        multiSelect
        maxSelections={maxSelections}
        onChange={newData => {
          validate({ data: newData, setValidationError });
          onCalendarChange(newData);
        }}
        minDate={moment()
          .add(5, 'days')
          .format('YYYY-MM-DD')}
        maxDate={moment()
          .add(120, 'days')
          .format('YYYY-MM-DD')}
        currentlySelectedDate={currentlySelectedDate}
        selectedDates={selectedDates}
        selectedIndicatorType={CALENDAR_INDICATOR_TYPES.BUBBLES}
        additionalOptions={additionalOptions}
        validationError={
          submitted || isMaxSelectionsError(validationError)
            ? validationError
            : null
        }
      />
      <FormButtons
        onBack={() => routeToPreviousAppointmentPage(history, pageKey)}
        onSubmit={() =>
          goForward({
            data,
            history,
            routeToNextAppointmentPage,
            submitted,
            setSubmitted,
            setValidationError,
          })
        }
        pageChangeInProgress={pageChangeInProgress}
        loadingText="Page change in progress"
      />
    </div>
  );
}

function mapStateToProps(state) {
  return getFormPageInfo(state, pageKey);
}

const mapDispatchToProps = {
  onCalendarChange: actions.onCalendarChange,
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DateTimeRequestPage);
