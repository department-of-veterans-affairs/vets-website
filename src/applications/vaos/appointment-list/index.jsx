import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { selectFeatureHomepageRefresh } from '../redux/selectors';
import PageLayout from './components/AppointmentsPage/PageLayout';
import AppointmentsPageV2 from './components/AppointmentsPageV2/index';
import AppointmentsPage from './components/AppointmentsPage/index';
import RequestedAppointmentDetailsPage from './components/RequestedAppointmentDetailsPage';
import ConfirmedAppointmentDetailsPage from './components/ConfirmedAppointmentDetailsPage';
import CommunityCareAppointmentDetailsPage from './components/CommunityCareAppointmentDetailsPage';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';

function AppointmentListSection() {
  const featureHomepageRefresh = useSelector(state =>
    selectFeatureHomepageRefresh(state),
  );
  useManualScrollRestoration();
  return (
    <Switch>
      <Route path="/cc/:id" component={CommunityCareAppointmentDetailsPage} />
      <Route path="/va/:id" component={ConfirmedAppointmentDetailsPage} />
      <Route path="/requests/:id" component={RequestedAppointmentDetailsPage} />
      <Route
        path="/"
        render={() => {
          let content = <AppointmentsPage />;
          if (featureHomepageRefresh) {
            content = <AppointmentsPageV2 />;
          }

          return (
            <PageLayout showBreadcrumbs showNeedHelp>
              {content}
            </PageLayout>
          );
        }}
      />
    </Switch>
  );
}

export const AppointmentList = AppointmentListSection;
