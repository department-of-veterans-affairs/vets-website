import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import * as actions from '../../redux/actions';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import FormButtons from '../../../components/FormButtons';
import CalendarWidget from '../../../components/calendar/CalendarWidget';
import { getFormPageInfo } from '../../redux/selectors';
import DateTimeRequestOptions from './DateTimeRequestOptions';
import SelectedIndicator from './SelectedIndicator';

const pageKey = 'requestDateTime';
const pageTitle = 'Choose an appointment day and time';

const maxSelections = 3;

function userSelectedSlot(dates) {
  return dates?.length > 0;
}

function exceededMaxSelections(dates) {
  return dates?.length > maxSelections;
}

function goForward({
  data,
  history,
  routeToNextAppointmentPage,
  setSubmitted,
}) {
  setSubmitted(true);

  if (
    userSelectedSlot(data.selectedDates) &&
    !exceededMaxSelections(data.selectedDates)
  ) {
    routeToNextAppointmentPage(history, pageKey);
  } else {
    scrollAndFocus('.usa-input-error-message');
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

  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  const selectedDates = data.selectedDates;

  return (
    <div className="vaos-form__detailed-radio">
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      <p>
        Choose your preferred date and time for this appointment. You can
        request up to 3 dates. A scheduling coordinator will call you to
        schedule your appointment.
      </p>
      <CalendarWidget
        multiSelect
        maxSelections={maxSelections}
        maxSelectionsError="You can only choose up to 3 dates for your appointment"
        onChange={onCalendarChange}
        minDate={moment()
          .add(5, 'days')
          .format('YYYY-MM-DD')}
        maxDate={moment()
          .add(120, 'days')
          .format('YYYY-MM-DD')}
        value={selectedDates}
        id="optionTime"
        renderIndicator={props => <SelectedIndicator {...props} />}
        renderOptions={props => <DateTimeRequestOptions {...props} />}
        required
        requiredMessage="Please select at least one preferred date for your appointment. You can select up to three dates."
        showValidation={submitted && !userSelectedSlot(selectedDates)}
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
