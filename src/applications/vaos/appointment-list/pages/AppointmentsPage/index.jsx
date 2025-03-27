import DowntimeNotification, {
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import CernerAlert from '../../../components/CernerAlert';
import WarningNotification from '../../../components/WarningNotification';
import {
  selectFeatureBreadcrumbUrlUpdate,
  selectPendingAppointments,
} from '../../../redux/selectors';
import { APPOINTMENT_STATUS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import RequestedAppointmentsPage from '../RequestedAppointmentsPage/RequestedAppointmentsPage';
// import CernerTransitionAlert from '../../../components/CernerTransitionAlert';
// import { selectPatientFacilities } from '~/platform/user/cerner-dsot/selectors';
// import ReferralTaskCardWithReferral from '../../../referral-appointments/components/ReferralTaskCardWithReferral';
import { routeToCCPage } from '../../../referral-appointments/flow';
import { useIsInCCPilot } from '../../../referral-appointments/hooks/useIsInCCPilot';
import { setFormCurrentPage } from '../../../referral-appointments/redux/actions';
import AppointmentListNavigation from '../../components/AppointmentListNavigation';
import PageLayout from '../../components/PageLayout';
import ScheduleNewAppointment from '../../components/ScheduleNewAppointment';
import PastAppointmentsPage from '../PastAppointmentsPage';
import UpcomingAppointmentsPage from '../UpcomingAppointmentsPage/UpcomingAppointmentsPage';

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
renderWarningNotification.propTypes = {
  description: PropTypes.string,
  status: PropTypes.string,
};

export default function AppointmentsPage() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [hasTypeChanged, setHasTypeChanged] = useState(false);
  let [pageTitle] = useState('VA online scheduling');
  const { isInCCPilot } = useIsInCCPilot();

  const pendingAppointments = useSelector(state =>
    selectPendingAppointments(state),
  );
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );
  // const featureBookingExclusion = useSelector(state =>
  //   selectFeatureBookingExclusion(state),
  // );

  useEffect(
    () => {
      dispatch(setFormCurrentPage('appointments'));
    },
    [location, dispatch],
  );

  let prefix = 'Your';
  const isPending = location.pathname.endsWith('/pending');
  const isPast = location.pathname.endsWith('/past');

  if (isPending) {
    prefix = 'Pending';
    pageTitle = `${prefix} appointments`;
  } else if (isPast) {
    prefix = 'Past';
    pageTitle = `${prefix} appointments`;
  } else {
    pageTitle = 'Appointments';
  }

  // Commenting this out for now until we have another migration.

  // const registeredFacilities = useSelector(selectPatientFacilities);
  // const hasRegisteredOHTransitionSite = registeredFacilities?.find(
  //   ({ facilityId }) => facilityId === OH_TRANSITION_SITES.siteName.id,
  // );
  // const hasRegisteredNonTransitionSite = registeredFacilities?.find(
  //   ({ facilityId }) => facilityId !== OH_TRANSITION_SITES.siteName.id,
  // );
  // hide schedule link if user is registered at an OH Transition site and has no other registered facilities.
  // const hideScheduleLink = () =>
  //   featureBookingExclusion
  //     ? !!hasRegisteredOHTransitionSite && !hasRegisteredNonTransitionSite
  //     : false;

  useEffect(
    () => {
      if (featureBreadcrumbUrlUpdate) {
        document.title = `${pageTitle} | Veterans Affairs`;
        scrollAndFocus('h1');
      } else {
        document.title = `${pageTitle} | VA online scheduling | Veterans Affairs`;
        scrollAndFocus('h1');
      }
    },
    [location.pathname, prefix, pageTitle, featureBreadcrumbUrlUpdate],
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

  const handleCCLinkClick = e => {
    e.preventDefault();
    routeToCCPage(history, 'referralsAndRequests');
  };

  return (
    <PageLayout showBreadcrumbs showNeedHelp>
      <h1
        className={classNames(
          `mobile:vads-u-margin-bottom--3 small-screen:${
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
      {/* {featureBookingExclusion && (
        <CernerTransitionAlert
          className="vads-u-margin-bottom--3"
          pageTitle={pageTitle}
        />
      )} */}
      <DowntimeNotification
        appTitle="VA online scheduling tool"
        isReady
        dependencies={[externalServices.vaosWarning]}
        render={renderWarningNotification()}
      />
      {/* {!hideScheduleLink() && <ScheduleNewAppointment />} */}
      <ScheduleNewAppointment />

      {/* This was commented out temporarily. When the full API integration 
      is added then this piece of code can be integrated back in */}
      {/* {isInCCPilot && <ReferralTaskCardWithReferral />} */}

      {isInCCPilot && (
        <div
          className={classNames(
            'vads-u-padding-y--3',
            'vads-u-margin-bottom--3',
            'vads-u-margin-top--1',
            'vads-u-border-top--1px',
            'vads-u-border-color--info-light',
            'vads-u-border-bottom--1px',
            'vads-u-border-color--info-light',
          )}
        >
          <va-link
            calendar
            href="/my-health/appointments/referrals-requests"
            text="Review requests and referrals"
            data-testid="review-requests-and-referrals"
            onClick={handleCCLinkClick}
          />
        </div>
      )}
      <AppointmentListNavigation
        hidePendingTab={isInCCPilot}
        count={count}
        callback={setHasTypeChanged}
      />
      <Switch>
        <Route exact path="/">
          <UpcomingAppointmentsPage hasTypeChanged={hasTypeChanged} />
        </Route>
        <Route path="/pending">
          <RequestedAppointmentsPage hasTypeChanged={hasTypeChanged} />
        </Route>
        <Route path="/past">
          <PastAppointmentsPage hasTypeChanged={hasTypeChanged} />
        </Route>
      </Switch>
    </PageLayout>
  );
}
