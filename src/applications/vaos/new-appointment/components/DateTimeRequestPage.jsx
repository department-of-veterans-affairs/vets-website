import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import * as actions from '../redux/actions';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import FormButtons from '../../components/FormButtons';
import CalendarWidget from '../../components/calendar/CalendarWidget';
import { getFormPageInfo } from '../redux/selectors';
import { CALENDAR_INDICATOR_TYPES } from '../../utils/constants';
import DateTimeRequestOptions from './DateTimeRequestOptions';

const pageKey = 'requestDateTime';
const pageTitle = 'Choose a day and time for your appointment';

const maxSelections = 3;

const missingDateError =
  'Please select at least one preferred date for your appointment. You can select up to three dates.';
const maxSelectionsError =
  'You can only choose up to 3 dates for your appointment.';

export function getOptionsByDate(selectedDate) {
  return [
    {
      value: `${selectedDate}T00:00:00.000`,
      label: 'AM',
      secondaryLabel: 'Before noon',
    },
    {
      value: `${selectedDate}T12:00:00.000`,
      label: 'PM',
      secondaryLabel: 'Noon or later',
    },
  ];
}

function isMaxSelectionsError(validationError) {
  return validationError === maxSelectionsError;
}

function userSelectedSlot(dates) {
  return dates?.length > 0;
}

function exceededMaxSelections(dates) {
  return dates?.length > maxSelections;
}

function validate({ dates, setValidationError }) {
  if (exceededMaxSelections(dates)) {
    setValidationError(maxSelectionsError);
  } else if (!userSelectedSlot(dates)) {
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
  validate({ dates: data.selectedDates, setValidationError });
  if (
    userSelectedSlot(data.selectedDates) &&
    !exceededMaxSelections(data.selectedDates)
  ) {
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

  const selectedDates = data.selectedDates;

  const additionalOptions = {
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
        onChange={dates => {
          validate({ dates, setValidationError });
          onCalendarChange(dates);
        }}
        minDate={moment()
          .add(5, 'days')
          .format('YYYY-MM-DD')}
        maxDate={moment()
          .add(120, 'days')
          .format('YYYY-MM-DD')}
        value={selectedDates}
        selectedIndicatorType={CALENDAR_INDICATOR_TYPES.BUBBLES}
        additionalOptions={additionalOptions}
        id="optionTime"
        renderOptions={props => <DateTimeRequestOptions {...props} />}
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
