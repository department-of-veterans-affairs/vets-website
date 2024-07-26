import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppointmentsPage from './components/AppointmentsPage/index';
import AppointmentNotificationPage from '../referral-appointments/AppointmentNotificationsPage';
import ReviewApproved from '../referral-appointments/ReviewApproved';
import ChooseCommunityCare from '../referral-appointments/ChooseCommunityCare';
import FilterPage from '../referral-appointments/FilterPage';
import RequestedAppointmentDetailsPage from './components/RequestedAppointmentDetailsPage';
import ConfirmedAppointmentDetailsPage from './components/ConfirmedAppointmentDetailsPage';
import ConfirmApprovedPage from '../referral-appointments/ConfirmApprovedPage';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import { selectFeatureBreadcrumbUrlUpdate } from '../redux/selectors';
import ChooseDateAndTime from '../referral-appointments/ChooseDateAndTime';

function AppointmentListSection() {
  useManualScrollRestoration();

  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );

  return (
    <>
      {!featureBreadcrumbUrlUpdate && (
        <Switch>
          <Route
            path="/choose-community-care-appointment"
            component={ChooseCommunityCare}
          />
          <Route path="/filter-page" component={FilterPage} />
          <Route path="/confirm-approved" component={ConfirmApprovedPage} />
          <Route path="/review-approved" component={ReviewApproved} />
          <Route
            path="/:pastOrPending?/cc/:id"
            component={ConfirmedAppointmentDetailsPage}
          />
          <Route
            path="/:pastOrPending?/va/:id"
            component={ConfirmedAppointmentDetailsPage}
          />
          <Route
            path="/:pastOrPending?/requests/:id"
            component={RequestedAppointmentDetailsPage}
          />
          <Route path="/" component={AppointmentsPage} />
        </Switch>
      )}
      {featureBreadcrumbUrlUpdate && (
        <Switch>
          <Route
            path="/choose-community-care-appointment"
            component={ChooseCommunityCare}
          />
          <Route path="/filter-page" component={FilterPage} />
          <Route
            path="/appointment-notifications"
            component={AppointmentNotificationPage}
          />
          <Route path="/confirm-approved" component={ConfirmApprovedPage} />
          <Route path="/review-approved" component={ReviewApproved} />
          <Route
            path="/provider-choose-date-and-time"
            component={ChooseDateAndTime}
          />
          <Route
            path="/pending/:id"
            component={RequestedAppointmentDetailsPage}
          />
          <Route path="/pending" component={AppointmentsPage} />
          <Route path="/past/:id" component={ConfirmedAppointmentDetailsPage} />
          <Route path="/past" component={AppointmentsPage} />
          <Route
            path={['/va/:id', '/:id']}
            component={ConfirmedAppointmentDetailsPage}
          />
          <Route path="/" component={AppointmentsPage} />
        </Switch>
      )}
    </>
  );
}

export const AppointmentList = AppointmentListSection;
