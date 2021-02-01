import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { selectFeatureHomepageRefresh } from '../redux/selectors';
import PageLayout from './components/AppointmentsPage/PageLayout';
import AppointmentsPageV2 from './components/AppointmentsPage/AppointmentsPageV2';
import AppointmentsPage from './components/AppointmentsPage/index';
import RequestedAppointmentDetailsPage from './components/RequestedAppointmentDetailsPage';

function AppointmentListSection({ featureHomepageRefresh }) {
  return (
    <Switch>
      {featureHomepageRefresh && (
        <Route
          path="/requests/:id"
          component={() => (
            <PageLayout>
              <RequestedAppointmentDetailsPage />
            </PageLayout>
          )}
        />
      )}
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
