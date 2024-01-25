import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import DowntimeNotification, {
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import PropTypes from 'prop-types';
import {
  selectFeatureStatusImprovement,
  selectFeatureBreadcrumbUrlUpdate,
} from '../../../redux/selectors';
import RequestedAppointmentsList from '../RequestedAppointmentsList';
import UpcomingAppointmentsList from '../UpcomingAppointmentsList';
import PastAppointmentsList from '../PastAppointmentsList';
import CanceledAppointmentsList from '../CanceledAppointmentsList';
import WarningNotification from '../../../components/WarningNotification';
import Select from '../../../components/Select';
import ScheduleNewAppointment from '../ScheduleNewAppointment';
import PageLayout from '../PageLayout';
import { selectPendingAppointments } from '../../redux/selectors';
import { APPOINTMENT_STATUS } from '../../../utils/constants';
import AppointmentListNavigation from '../AppointmentListNavigation';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import RequestedAppointmentsListGroup from '../RequestedAppointmentsListGroup';
import CernerAlert from '../../../components/CernerAlert';

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
    const { status, description } = props;
    return (
      <WarningNotification description={description} status={status}>
        {childContent}
      </WarningNotification>
    );
  };
}

export default function AppointmentsPage() {
  const location = useLocation();
  const [hasTypeChanged, setHasTypeChanged] = useState(false);
  let [pageTitle] = useState('VA online scheduling');

  const featureStatusImprovement = useSelector(state =>
    selectFeatureStatusImprovement(state),
  );

  const pendingAppointments = useSelector(state =>
    selectPendingAppointments(state),
  );
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );
  const {
    dropdownValue,
    subPageTitle,
    subHeading,
  } = getDropdownValueFromLocation(location.pathname);

  let prefix = 'Your';
  const isPending = location.pathname.endsWith('/pending');
  const isPast = location.pathname.endsWith('/past');

  if (featureStatusImprovement) {
    if (isPending) {
      prefix = 'Pending';
      pageTitle = `${prefix} appointments`;
    } else if (isPast) {
      prefix = 'Past';
      pageTitle = `${prefix} appointments`;
    } else {
      pageTitle = 'Appointments';
    }
  }
  useEffect(
    () => {
      if (featureStatusImprovement && !featureBreadcrumbUrlUpdate) {
        document.title = `${pageTitle} | VA online scheduling | Veterans Affairs`;
        scrollAndFocus('h1');
      } else if (featureStatusImprovement && featureBreadcrumbUrlUpdate) {
        document.title = `${pageTitle} | Veterans Affairs`;
        scrollAndFocus('h1');
      } else {
        document.title = `${subPageTitle} | ${pageTitle} | Veterans Affairs`;
        scrollAndFocus('h1');
      }
    },
    [
      subPageTitle,
      featureStatusImprovement,
      location.pathname,
      prefix,
      pageTitle,
      featureBreadcrumbUrlUpdate,
    ],
  );

  const [count, setCount] = useState(0);
  useEffect(
    () => {
      // Get non cancelled appointment requests from store
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
      <h1
        className={classNames(
          `xsmall-screen:vads-u-margin-bottom--3 small-screen:${
            isPast || isPending
              ? 'vads-u-margin-bottom--3'
              : 'vads-u-margin-bottom--4'
          }`,
        )}
      >
        {pageTitle}
      </h1>
      {/* display paragraphText on RequestedAppointmentsListGroup page when print list flag is on */}
      <CernerAlert className="vads-u-margin-bottom--3" pageTitle={pageTitle} />
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
          <PastAppointmentsList hasTypeChanged={hasTypeChanged} />
        </Route>
        <Route path="/canceled">
          <CanceledAppointmentsList hasTypeChanged={hasTypeChanged} />
        </Route>
      </Switch>
    </PageLayout>
  );
}

renderWarningNotification.propTypes = {
  description: PropTypes.string,
  status: PropTypes.string,
};
