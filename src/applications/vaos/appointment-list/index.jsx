import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { selectFeatureHomepageRefresh } from '../redux/selectors';
import PageLayout from './components/AppointmentsPage/PageLayout';
import AppointmentsPageV2 from './components/AppointmentsPage/AppointmentsPageV2';
import AppointmentsPage from './components/AppointmentsPage/index';
import RequestedAppointmentDetailsPage from './components/RequestedAppointmentDetailsPage';
import ConfirmedAppointmentDetailsPage from './components/ConfirmedAppointmentDetailsPage/ConfirmedAppointmentDetailsPage';
import CommunityCareAppointmentDetailsPage from './components/CommunityCareAppointmentDetailsPage';
import ExpressCareDetailsPage from './components/ExpressCareDetailsPage';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';

function AppointmentListSection({ featureHomepageRefresh }) {
  useManualScrollRestoration();
  return (
    <Switch>
      <Route path="/cc/:id" component={CommunityCareAppointmentDetailsPage} />
      <Route path="/va/:id" component={ConfirmedAppointmentDetailsPage} />
      <Route path="/requests/:id" component={RequestedAppointmentDetailsPage} />
      <Route path="/express-care/:id" component={ExpressCareDetailsPage} />
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

function mapStateToProps(state) {
  return {
    featureHomepageRefresh: selectFeatureHomepageRefresh(state),
  };
}

export const AppointmentList = connect(mapStateToProps)(AppointmentListSection);
