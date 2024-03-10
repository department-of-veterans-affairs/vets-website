import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  onCalendarChange,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../../redux/actions';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import FormButtons from '../../../components/FormButtons';
import CalendarWidget from '../../../components/calendar/CalendarWidget';
import {
  getFlowType,
  getFormPageInfo,
  selectAppointmentSlotsStatus,
} from '../../redux/selectors';
import DateTimeRequestOptions from './DateTimeRequestOptions';
import SelectedIndicator, { getSelectedLabel } from './SelectedIndicator';
import { FETCH_STATUS, FLOW_TYPES } from '../../../utils/constants';
import { selectFeatureBreadcrumbUrlUpdate } from '../../../redux/selectors';

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

export default function VARequest({ changeCrumb }) {
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );

  const { data, pageChangeInProgress } = useSelector(
    state => getFormPageInfo(state, pageKey),
    shallowEqual,
  );

  const history = useHistory();
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);
  const appointmentSlotsStatus = useSelector(state =>
    selectAppointmentSlotsStatus(state),
  );
  const flowType = useSelector(state => getFlowType(state));

  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    if (featureBreadcrumbUrlUpdate) {
      changeCrumb(pageTitle);
    }
  }, []);

  const { selectedDates } = data;

  // Calendar displays business days so check if adding 5 days falls on a Sat or Sun
  // If so, add 1 or 2 days to get to Mon. This fixes displaying and empty calendar
  // error.
  const minDate = moment().add(5, 'd');
  if (minDate.day() === 6) minDate.add(2, 'days');
  if (minDate.day() === 0) minDate.add(1, 'days');

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
        minDate={minDate.format('YYYY-MM-DD')}
        maxDate={moment()
          .add(120, 'days')
          .format('YYYY-MM-DD')}
        value={selectedDates}
        id="optionTime"
        renderIndicator={props => <SelectedIndicator {...props} />}
        renderOptions={props => <DateTimeRequestOptions {...props} />}
        renderSelectedLabel={getSelectedLabel}
        required
        requiredMessage="Select at least 1 preferred timeframe for your appointment."
        showValidation={submitted && !userSelectedSlot(selectedDates)}
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

VARequest.propTypes = {
  changeCrumb: PropTypes.func,
};
