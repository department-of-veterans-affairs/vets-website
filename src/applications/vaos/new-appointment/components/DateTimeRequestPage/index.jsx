import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import {
  onCalendarChange,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../../redux/actions';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import FormButtons from '../../../components/FormButtons';
import CalendarWidget from '../../../components/calendar/CalendarWidget';
import { getFormPageInfo } from '../../redux/selectors';
import DateTimeRequestOptions from './DateTimeRequestOptions';
import SelectedIndicator, { getSelectedLabel } from './SelectedIndicator';

const pageKey = 'requestDateTime';
const pageTitle = 'Choose an appointment day and time';

const maxSelections = 3;

function userSelectedSlot(dates) {
  return dates?.length > 0;
}

function exceededMaxSelections(dates) {
  return dates?.length > maxSelections;
}

function goForward({ dispatch, data, history, setSubmitted }) {
  setSubmitted(true);

  if (
    userSelectedSlot(data.selectedDates) &&
    !exceededMaxSelections(data.selectedDates)
  ) {
    dispatch(routeToNextAppointmentPage(history, pageKey));
  } else {
    scrollAndFocus('.usa-input-error-message');
  }
}

export default function DateTimeRequestPage() {
  const { data, pageChangeInProgress } = useSelector(
    state => getFormPageInfo(state, pageKey),
    shallowEqual,
  );

  const history = useHistory();
  const dispatch = useDispatch();
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
        onChange={(...args) => dispatch(onCalendarChange(...args))}
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
        renderSelectedLabel={getSelectedLabel}
        required
        requiredMessage="Please select at least one preferred date for your appointment. You can select up to three dates."
        showValidation={submitted && !userSelectedSlot(selectedDates)}
      />
      <FormButtons
        onBack={() =>
          dispatch(routeToPreviousAppointmentPage(history, pageKey))
        }
        onSubmit={() =>
          goForward({
            dispatch,
            data,
            history,
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
