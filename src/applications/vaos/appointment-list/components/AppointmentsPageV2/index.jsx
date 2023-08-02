import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import PropTypes from 'prop-types';
import { selectFeaturePrintList } from '../../../redux/selectors';
import UpcomingAppointmentsList from '../UpcomingAppointmentsList';
import PastAppointmentsListV2 from '../PastAppointmentsListV2';
import CanceledAppointmentsList from '../CanceledAppointmentsList';
import WarningNotification from '../../../components/WarningNotification';
import ScheduleNewAppointment from '../ScheduleNewAppointment';
import PageLayout from '../PageLayout';
import { selectPendingAppointments } from '../../redux/selectors';
import { APPOINTMENT_STATUS } from '../../../utils/constants';
import AppointmentListNavigation from '../AppointmentListNavigation';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import RequestedAppointmentsListGroup from '../RequestedAppointmentsListGroup';

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

function getSpacing({ isPrintList, isPast, isPending }) {
  let names = classNames(
    `xsmall-screen:vads-u-margin-bottom--2 small-screen:${
      isPending ? 'vads-u-margin-bottom--2' : 'vads-u-margin-bottom--4'
    }`,
  );
  if (isPrintList) {
    names = classNames(
      `xsmall-screen:vads-u-margin-bottom--3 small-screen:${
        isPast || isPending
          ? 'vads-u-margin-bottom--3'
          : 'vads-u-margin-bottom--4'
      }`,
    );
    return `${names}`;
  }
  return `${names}`;
}

export default function AppointmentsPageV2() {
  const location = useLocation();
  const [hasTypeChanged, setHasTypeChanged] = useState(false);

  const pendingAppointments = useSelector(state =>
    selectPendingAppointments(state),
  );
  const isPrintList = useSelector(state => selectFeaturePrintList(state));
  const isPending = location.pathname.endsWith('/pending');
  const isPast = location.pathname.endsWith('/past');

  let pageTitle;

  if (isPending) {
    pageTitle = `Pending appointments`;
  } else if (isPast) {
    pageTitle = `Past appointments`;
  } else {
    pageTitle = 'Appointments';
  }

  useEffect(
    () => {
      document.title = `${pageTitle} | VA online scheduling | Veterans Affairs`;
      scrollAndFocus('h1');
    },
    [pageTitle],
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

  const paragraphText =
    'These appointment requests haven’t been scheduled yet.';

  return (
    <PageLayout showBreadcrumbs showNeedHelp>
      <h1 className={getSpacing({ isPrintList, isPast, isPending })}>
        {pageTitle}
      </h1>
      {/* display paragraphText on RequestedAppointmentsListGroup page when print list flag is on */}
      {pageTitle === 'Pending appointments' &&
        !isPrintList && (
          <p className="xsmall-screen:vads-u-margin-top--0 vads-u-margin-bottom--2 vaos-hide-for-print small-screen:vads-u-margin-bottom--4">
            {paragraphText}
          </p>
        )}
      <DowntimeNotification
        appTitle="VA online scheduling tool"
        isReady
        dependencies={[externalServices.vaosWarning]}
        render={renderWarningNotification()}
      />
      <ScheduleNewAppointment />
      <AppointmentListNavigation count={count} callback={setHasTypeChanged} />

      <Switch>
        <Route exact path="/">
          <UpcomingAppointmentsList hasTypeChanged={hasTypeChanged} />
        </Route>
        <Route path="/pending">
          <RequestedAppointmentsListGroup hasTypeChanged={hasTypeChanged} />
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

renderWarningNotification.propTypes = {
  description: PropTypes.string,
  status: PropTypes.string,
};
