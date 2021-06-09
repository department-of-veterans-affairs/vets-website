import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import {
  selectFeatureRequests,
  selectIsWelcomeModalDismissed,
} from '../../../redux/selectors';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import RequestedAppointmentsList from '../RequestedAppointmentsList';
import UpcomingAppointmentsList from '../UpcomingAppointmentsList';
import PastAppointmentsListV2 from '../PastAppointmentsListV2';
import CanceledAppointmentsList from '../CanceledAppointmentsList';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import WarningNotification from '../../../components/WarningNotification';
import Select from '../../../components/Select';
import ScheduleNewAppointment from '../ScheduleNewAppointment';

const pageTitle = 'VA online scheduling';

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
  const location = useLocation();
  const [hasTypeChanged, setHasTypeChanged] = useState(false);
  const showScheduleButton = useSelector(state => selectFeatureRequests(state));
  const isWelcomeModalDismissed = useSelector(state =>
    selectIsWelcomeModalDismissed(state),
  );

  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
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
      <h1 className="vads-u-flex--1 vads-u-margin-bottom--1p5">{pageTitle}</h1>
      <DowntimeNotification
        appTitle="VA online scheduling tool"
        isReady
        dependencies={[externalServices.vaosWarning]}
        render={(props, childContent) => (
          <WarningNotification {...props}>{childContent}</WarningNotification>
        )}
      />
      {showScheduleButton && <ScheduleNewAppointment />}
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
