import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import FormButtons from '../../components/FormButtons';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import CalendarWidget from '../../components/calendar/CalendarWidget';
import { onCalendarChange } from '../redux/actions';
import moment from 'moment';
import { CALENDAR_INDICATOR_TYPES } from '../../utils/constants';
import { getProjectCheetahFormPageInfo } from '../redux/selectors';

const pageKey = 'selectDate2';
const pageTitle = 'Select Second Date';

const maxSelections = 1;

const missingDateError =
  'Please select one preferred date for your appointment. You can select only one date.';
const maxSelectionsError = 'You can only choose one date for your appointment.';

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

function SelectDate2Page({
  data,
  pageChangeInProgress,
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
    maxSelections: 1,
    validationMessage:
      'Please select a preferred time or unselect this date to continue',
    getOptionsByDate,
  };

  return (
    <div>
      <h1>{pageTitle}</h1>
      <p>
        You can choose a date. A scheduling coordinator will call you to
        schedule the best time for your appointment.
      </p>
      <CalendarWidget
        maxSelections={maxSelections}
        onChange={newData => {
          validate({ data: newData, setValidationError });
          onCalendarChange(newData);
        }}
        minDate={moment()
          .add(5, 'days')
          .format('YYYY-MM-DD')}
        maxDate={moment()
          .add(21, 'days')
          .format('YYYY-MM-DD')}
        currentlySelectedDate={currentlySelectedDate}
        selectedDates={selectedDates}
        selectedIndicatorType={CALENDAR_INDICATOR_TYPES.CHECK}
        additionalOptions={additionalOptions}
        validationError={
          submitted || isMaxSelectionsError(validationError)
            ? validationError
            : null
        }
      />
      <FormButtons
        pageChangeInProgress={pageChangeInProgress}
        loadingText="Page change in progress"
        onBack={() => {
          routeToPreviousAppointmentPage(history, pageKey);
        }}
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
      />
    </div>
  );
}

function mapStateToProps(state) {
  return getProjectCheetahFormPageInfo(state, pageKey);
}

const mapDispatchToProps = {
  onCalendarChange: actions.onCalendarChange,
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectDate2Page);
