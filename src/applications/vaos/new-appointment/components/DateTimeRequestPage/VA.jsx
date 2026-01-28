import { addDays } from 'date-fns';
import { scrollToFirstError } from 'platform/utilities/scroll';
import CalendarWidget from 'platform/shared/calendar/CalendarWidget';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FormButtons from '../../../components/FormButtons';
import { FETCH_STATUS, FLOW_TYPES } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import {
  onCalendarChange,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../../redux/actions';
import {
  getFlowType,
  getFormPageInfo,
  selectAppointmentSlotsStatus,
} from '../../redux/selectors';
import DateTimeRequestOptions from './DateTimeRequestOptions';
import SelectedIndicator, { getSelectedLabel } from './SelectedIndicator';

const pageKey = 'requestDateTime';
const pageTitle = 'When would you like an appointment?';

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
  }
}

export default function VARequest() {
  const { data, pageChangeInProgress } = useSelector(
    state => getFormPageInfo(state, pageKey),
    shallowEqual,
  );

  const history = useHistory();
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);
  // Add a counter state to trigger focusing
  const [focusTrigger, setFocusTrigger] = useState(0);
  const [alertTrigger, setAlertTrigger] = useState(0);
  const appointmentSlotsStatus = useSelector(state =>
    selectAppointmentSlotsStatus(state),
  );
  const flowType = useSelector(state => getFlowType(state));

  // Effect to focus on validation message whenever error state changes
  useEffect(
    () => {
      scrollToFirstError();
    },
    [focusTrigger],
  );

  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  const { selectedDates } = data;

  // Calendar displays business days so check if adding 5 days falls on a Sat or Sun
  // If so, add 1 or 2 days to get to Mon. This fixes displaying and empty calendar
  // error.
  const minDate = addDays(new Date(), 5);
  if (minDate.getDay() === 6) addDays(minDate, 2);
  if (minDate.getDay() === 0) addDays(minDate, 1);

  return (
    <div className="vaos-form__detailed-radio">
      <h1 className="vaos__dynamic-font-size--h2">
        {pageTitle}
        <span className="schemaform-required-span vaos-calendar__page_header vads-u-font-family--sans vads-u-font-weight--normal">
          (*Required)
        </span>
      </h1>
      <p>You can select up to 3 preferred timeframes.</p>
      <p>
        <strong>Note:</strong> We’ll contact you to finish scheduling the
        appointment.
      </p>
      <CalendarWidget
        multiSelect
        maxSelections={maxSelections}
        onChange={(...args) => dispatch(onCalendarChange(...args))}
        minDate={minDate}
        maxDate={addDays(new Date(), 120)}
        value={selectedDates}
        id="optionTime"
        renderIndicator={props => <SelectedIndicator {...props} />}
        renderOptions={props => <DateTimeRequestOptions {...props} />}
        renderSelectedLabel={getSelectedLabel}
        required
        requiredMessage="Select at least 1 preferred timeframe for your appointment."
        showValidation={submitted && !userSelectedSlot(selectedDates)}
        alertTrigger={alertTrigger}
        setAlertTrigger={() => setAlertTrigger(prev => prev + 1)}
      />
      <FormButtons
        onBack={() => {
          // If error occurred retrieving open slots for the current clinic
          // send the user back to the clinic choice page. Maybe there are
          // open slots at a different clinic.
          if (
            flowType === FLOW_TYPES.REQUEST &&
            appointmentSlotsStatus === FETCH_STATUS.failed
          ) {
            return dispatch(
              routeToPreviousAppointmentPage(history, 'clinicChoice'),
            );
          }

          return dispatch(routeToPreviousAppointmentPage(history, pageKey));
        }}
        onSubmit={() => {
          // Increment the alert and focus triggers to force re-focusing the validation message and re-announce it
          setAlertTrigger(prev => prev + 1);
          setFocusTrigger(prev => prev + 1);
          goForward({
            dispatch,
            data,
            history,
            submitted,
            setSubmitted,
          });
        }}
        pageChangeInProgress={pageChangeInProgress}
        loadingText="Page change in progress"
      />
    </div>
  );
}
