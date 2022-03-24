import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { selectFeatureStatusImprovement } from '../../../redux/selectors';
import RequestedAppointmentsList from '../RequestedAppointmentsList';
import UpcomingAppointmentsList from '../UpcomingAppointmentsList';
import PastAppointmentsListV2 from '../PastAppointmentsListV2';
import CanceledAppointmentsList from '../CanceledAppointmentsList';
import WarningNotification from '../../../components/WarningNotification';
import Select from '../../../components/Select';
import ScheduleNewAppointment from '../ScheduleNewAppointment';
import PageLayout from '../PageLayout';
import { selectPendingAppointments } from '../../redux/selectors';
import { APPOINTMENT_STATUS } from '../../../utils/constants';
import AppointmentListNavigation from '../AppointmentListNavigation';
import { updateBreadcrumb } from '../../redux/actions';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import RequestedAppointmentsListGroup from '../RequestedAppointmentsListGroup';

let pageTitle = 'VA online scheduling';

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
  }
  if (pathname.endsWith(DROPDOWN_VALUES.past)) {
    return {
      dropdownValue: DROPDOWN_VALUES.past,
      subPageTitle: 'Past appointments',
      subHeading: 'Past appointments',
    };
  }
  if (pathname.endsWith(DROPDOWN_VALUES.canceled)) {
    return {
      dropdownValue: DROPDOWN_VALUES.canceled,
      subPageTitle: 'Canceled appointments',
      subHeading: 'Canceled appointments',
    };
  }
  return {
    dropdownValue: DROPDOWN_VALUES.upcoming,
    subPageTitle: 'Your appointments',
    subHeading: 'Your appointments',
  };
}

function handleDropdownChange(history, setHasTypeChanged) {
  return e => {
    const { value } = e.detail;
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
  };
}

function renderWarningNotification() {
  return (props, childContent) => {
    const { status } = props;
    return (
      <WarningNotification status={status}>{childContent}</WarningNotification>
    );
  };
}

export default function AppointmentsPageV2() {
  const location = useLocation();
  const [hasTypeChanged, setHasTypeChanged] = useState(false);
  const featureStatusImprovement = useSelector(state =>
    selectFeatureStatusImprovement(state),
  );
  const pendingAppointments = useSelector(state =>
    selectPendingAppointments(state),
  );
  const {
    dropdownValue,
    subPageTitle,
    subHeading,
  } = getDropdownValueFromLocation(location.pathname);

  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  useEffect(
    () => {
      if (featureStatusImprovement) {
        let prefix = 'Your';
        if (location.pathname.endsWith('pending')) {
          prefix = 'Pending';
          pageTitle = `${prefix} appointments`;
          dispatch(updateBreadcrumb({ title: prefix, path: 'pending' }));
        } else if (location.pathname.endsWith('past')) {
          prefix = 'Past';
          pageTitle = `${prefix} appointments`;
          dispatch(updateBreadcrumb({ title: prefix, path: 'past' }));
        } else {
          pageTitle = 'Your appointments';
        }

        document.title = `${prefix} appointments | VA online scheduling | Veterans Affairs`;
        scrollAndFocus('h1');
      } else {
        document.title = `${subPageTitle} | ${pageTitle} | Veterans Affairs`;
        scrollAndFocus('h1');
      }
    },
    [subPageTitle, featureStatusImprovement, location.pathname, dispatch],
  );

  const [documentTitle, setDocumentTitle] = useState();
  useEffect(
    () => {
      function handleBeforePrint(_event) {
        document.title = `Your appointments | VA online scheduling | Veterans Affairs`;
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

  useEffect(
    () => {
      // Get non cancled appointment requests from store
      setCount(
        pendingAppointments
          ? pendingAppointments.filter(
              appointment =>
                appointment.status !== APPOINTMENT_STATUS.cancelled,
            ).length
          : 0,
      );
    },
    [pendingAppointments],
  );

  const history = useHistory();

  return (
    <PageLayout showBreadcrumbs showNeedHelp>
      <h1 className="vads-u-flex--1 vads-u-margin-bottom--1p5 vaos-hide-for-print">
        {pageTitle}
      </h1>
      <DowntimeNotification
        appTitle="VA online scheduling tool"
        isReady
        dependencies={[externalServices.vaosWarning]}
        render={renderWarningNotification()}
      />
      <ScheduleNewAppointment />
      <AppointmentListNavigation count={count} callback={setHasTypeChanged} />
      {!featureStatusImprovement && (
        <>
          <h2 className="vads-u-margin-y--3">{subHeading}</h2>
          {/* Commenting out for now. See https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/718 */}
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <Select
            options={options}
            onChange={handleDropdownChange(history, setHasTypeChanged)}
            id="type-dropdown"
            value={dropdownValue}
            label="Show by status"
          />
        </>
      )}
      <Switch>
        <Route exact path="/">
          <UpcomingAppointmentsList hasTypeChanged={hasTypeChanged} />
        </Route>
        <Route path={featureStatusImprovement ? '/pending' : '/requested'}>
          {featureStatusImprovement && (
            <RequestedAppointmentsListGroup hasTypeChanged={hasTypeChanged} />
          )}
          {!featureStatusImprovement && (
            <RequestedAppointmentsList hasTypeChanged={hasTypeChanged} />
          )}
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
