import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import { selectFeatureRequests } from '../../../redux/selectors';
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
import PageLayout from '../PageLayout';

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
    return {
      dropdownValue: DROPDOWN_VALUES.requested,
      subPageTitle: 'Requested',
      subHeading: 'Requested appointments',
    };
  } else if (pathname.endsWith(DROPDOWN_VALUES.past)) {
    return {
      dropdownValue: DROPDOWN_VALUES.past,
      subPageTitle: 'Past appointments',
      subHeading: 'Past appointments',
    };
  } else if (pathname.endsWith(DROPDOWN_VALUES.canceled)) {
    return {
      dropdownValue: DROPDOWN_VALUES.canceled,
      subPageTitle: 'Canceled appointments',
      subHeading: 'Canceled appointments',
    };
  } else {
    return {
      dropdownValue: DROPDOWN_VALUES.upcoming,
      subPageTitle: 'Your appointments',
      subHeading: 'Your appointments',
    };
  }
}

export default function AppointmentsPageV2() {
  const location = useLocation();
  const [hasTypeChanged, setHasTypeChanged] = useState(false);
  const showScheduleButton = useSelector(state => selectFeatureRequests(state));
  const {
    dropdownValue,
    subPageTitle,
    subHeading,
  } = getDropdownValueFromLocation(location.pathname);

  useEffect(
    () => {
      document.title = `${subPageTitle} | ${pageTitle} | Veterans Affairs`;
    },
    [subPageTitle],
  );

  const [documentTitle, setDocumentTitle] = useState();
  useEffect(
    () => {
      function handleBeforePrint(_event) {
        document.title = `Your appointments | ${pageTitle} | Veterans Affairs`;
      }

      function handleAfterPrint(_event) {
        document.title = documentTitle;
      }
      setDocumentTitle(document.title);

      window.addEventListener('beforeprint', handleBeforePrint);
      window.addEventListener('afterprint', handleAfterPrint);
      return () => {
        window.removeEventListener('beforeprint', handleBeforePrint);
        window.removeEventListener('afterprint', handleAfterPrint);
      };
    },
    [documentTitle, subPageTitle],
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

  return (
    <PageLayout showBreadcrumbs showNeedHelp>
      <h1 className="vads-u-flex--1 vads-u-margin-bottom--1p5 vaos-hide-for-print">
        {pageTitle}
      </h1>
      <DowntimeNotification
        appTitle="VA online scheduling tool"
        isReady
        dependencies={[externalServices.vaosWarning]}
        render={(props, childContent) => (
          <WarningNotification {...props}>{childContent}</WarningNotification>
        )}
      />
      {showScheduleButton && <ScheduleNewAppointment />}
      <h2 className="vads-u-margin-y--3">{subHeading}</h2>
      <label
        htmlFor="type-dropdown"
        className="vads-u-display--inline-block vads-u-margin-top--0 vads-u-margin-right--2 vaos-hide-for-print"
      >
        Show by status
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
    </PageLayout>
  );
}
