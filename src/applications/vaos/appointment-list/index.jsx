import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { selectFeatureHomepageRefresh } from '../redux/selectors';
import PageLayout from './components/AppointmentsPage/PageLayout';
import AppointmentsPageV2 from './components/AppointmentsPage/AppointmentsPageV2';
import AppointmentsPage from './components/AppointmentsPage/index';

function AppointmentListSection({ featureHomepageRefresh }) {
  return (
    <PageLayout>
      <Switch>
        <Route
          path="/"
          render={() => {
            if (featureHomepageRefresh) {
              return <AppointmentsPageV2 />;
            }

            return <AppointmentsPage />;
          }}
        />
      </Switch>
    </PageLayout>
  );
}

function mapStateToProps(state) {
  return {
    featureHomepageRefresh: selectFeatureHomepageRefresh(state),
  };
}

export const AppointmentList = connect(mapStateToProps)(AppointmentListSection);
