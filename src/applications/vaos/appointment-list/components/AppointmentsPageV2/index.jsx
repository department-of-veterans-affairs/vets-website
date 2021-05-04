import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import { selectExpressCareAvailability } from '../../redux/selectors';
import {
  selectFeatureRequests,
  selectIsWelcomeModalDismissed,
  selectIsCernerOnlyPatient,
} from '../../../redux/selectors';
import { GA_PREFIX, FETCH_STATUS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import RequestExpressCare from './RequestExpressCareV2';
import RequestedAppointmentsList from '../RequestedAppointmentsList';
import UpcomingAppointmentsList from '../UpcomingAppointmentsList';
import PastAppointmentsListV2 from '../PastAppointmentsListV2';
import CanceledAppointmentsList from '../CanceledAppointmentsList';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import WarningNotification from '../../../components/WarningNotification';
import Select from '../../../components/Select';
import ScheduleNewAppointmentRadioButtons from '../ScheduleNewAppointmentRadioButtons';
import {
  fetchExpressCareWindows,
  startNewExpressCareFlow,
} from '../../redux/actions';

const pageTitle = 'VA appointments';

const DROPDOWN_VALUES = {
  upcoming: 'upcoming',
  requested: 'requested',
  past: 'past',
  canceled: 'canceled',
};

const options = [
  { label: 'Upcoming', value: DROPDOWN_VALUES.upcoming },
  { label: 'Requested', value: DROPDOWN_VALUES.requested },
  { label: 'Past', value: DROPDOWN_VALUES.past },
  { label: 'Canceled', value: DROPDOWN_VALUES.canceled },
];

function getDropdownValueFromLocation(pathname) {
  if (pathname.endsWith(DROPDOWN_VALUES.requested)) {
    return DROPDOWN_VALUES.requested;
  } else if (pathname.endsWith(DROPDOWN_VALUES.past)) {
    return DROPDOWN_VALUES.past;
  } else if (pathname.endsWith(DROPDOWN_VALUES.canceled)) {
    return DROPDOWN_VALUES.canceled;
  } else {
    return DROPDOWN_VALUES.upcoming;
  }
}

export default function AppointmentsPageV2() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [hasTypeChanged, setHasTypeChanged] = useState(false);
  const showScheduleButton = useSelector(state => selectFeatureRequests(state));
  const isWelcomeModalDismissed = useSelector(state =>
    selectIsWelcomeModalDismissed(state),
  );
  const isCernerOnlyPatient = useSelector(state =>
    selectIsCernerOnlyPatient(state),
  );
  const expressCare = useSelector(state =>
    selectExpressCareAvailability(state),
  );

  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;

    if (
      expressCare.useNewFlow &&
      expressCare.windowsStatus === FETCH_STATUS.notStarted
    ) {
      dispatch(fetchExpressCareWindows());
    }
  }, []);

  useEffect(
    () => {
      if (isWelcomeModalDismissed) {
        scrollAndFocus();
      }
    },
    [isWelcomeModalDismissed],
  );
  const history = useHistory();

  function onDropdownChange(e) {
    const value = e.target.value;
    if (value === DROPDOWN_VALUES.upcoming) {
      history.push('/');
    } else if (value === DROPDOWN_VALUES.requested) {
      history.push('/requested');
    } else if (value === DROPDOWN_VALUES.past) {
      history.push('/past');
    } else if (value === DROPDOWN_VALUES.canceled) {
      history.push('/canceled');
    }
    setHasTypeChanged(true);
  }

  const dropdownValue = getDropdownValueFromLocation(location.pathname);

  return (
    <>
      <h1 className="vads-u-flex--1">{pageTitle}</h1>
      <DowntimeNotification
        appTitle="VA online scheduling tool"
        isReady
        dependencies={[externalServices.vaosWarning]}
        render={(props, childContent) => (
          <WarningNotification {...props}>{childContent}</WarningNotification>
        )}
      />
      {showScheduleButton && <ScheduleNewAppointmentRadioButtons />}
      {expressCare.useNewFlow &&
        !isCernerOnlyPatient && (
          <RequestExpressCare
            {...expressCare}
            startNewExpressCareFlow={() => {
              recordEvent({
                event: `${GA_PREFIX}-express-care-request-button-clicked`,
              });
              dispatch(startNewExpressCareFlow());
            }}
          />
        )}
      <h2 className="vads-u-margin-y--3">Your appointments</h2>
      <label
        htmlFor="type-dropdown"
        className="vads-u-display--inline-block vads-u-margin-top--0 vads-u-margin-right--2"
      >
        Show by type
      </label>
      <Select
        options={options}
        onChange={onDropdownChange}
        id="type-dropdown"
        value={dropdownValue}
      />
      <Switch>
        <Route exact path="/">
          <UpcomingAppointmentsList hasTypeChanged={hasTypeChanged} />
        </Route>
        <Route path="/requested">
          <RequestedAppointmentsList hasTypeChanged={hasTypeChanged} />
        </Route>
        <Route path="/past">
          <PastAppointmentsListV2 hasTypeChanged={hasTypeChanged} />
        </Route>
        <Route path="/canceled">
          <CanceledAppointmentsList hasTypeChanged={hasTypeChanged} />
        </Route>
      </Switch>
    </>
  );
}
