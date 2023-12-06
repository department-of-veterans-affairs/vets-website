import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
// eslint-disable-next-line import/no-unresolved
import asyncLoader from '@department-of-veterans-affairs/platform-utilities/asyncLoader';
import { connectDrupalSourceOfTruthCerner } from 'platform/utilities/cerner/dsot';
import VAOSApp from './components/VAOSApp';
import ErrorBoundary from './components/ErrorBoundary';
import { captureError } from './utils/error';

import ErrorMessage from './components/ErrorMessage';
import FullWidthLayout from './components/FullWidthLayout';
import { AppointmentList } from './appointment-list';
import EnrolledRoute from './components/EnrolledRoute';

// Handles errors loading components by doing one page reload and showing
// an error message otherwise
function handleLoadError(err) {
  if (window.location.search?.includes('retry=1')) {
    captureError(new Error(`vaos_lazy_loading: ${err.message}`));
    return () => (
      <FullWidthLayout>
        <ErrorMessage />
      </FullWidthLayout>
    );
  }
  window.location.replace(`${window.location.pathname}?retry=1`);
  return () => <va-loading-indicator message="Reloading page" />;
}

export default function createRoutesWithStore(store) {
  const newAppointmentPaths = ['/new-appointment', '/schedule'];
  const vaccinePaths = [
    '/new-covid-19-vaccine-appointment',
    '/schedule/covid-vaccine',
  ];

  return (
    <ErrorBoundary fullWidth>
      <VAOSApp>
        <Switch>
          <EnrolledRoute
            path={vaccinePaths}
            component={asyncLoader(() =>
              import(/* webpackChunkName: "covid-19-vaccine" */ './covid-19-vaccine')
                .then(({ NewBookingSection, reducer }) => {
                  store.injectReducer('covid19Vaccine', reducer);
                  return NewBookingSection;
                })
                .catch(handleLoadError),
            )}
          />
          <EnrolledRoute
            path={newAppointmentPaths}
            component={asyncLoader(() =>
              import(/* webpackChunkName: "vaos-form" */ './new-appointment')
                .then(({ NewAppointment, reducer }) => {
                  connectDrupalSourceOfTruthCerner(store.dispatch);
                  store.injectReducer('newAppointment', reducer);
                  return NewAppointment;
                })
                .catch(handleLoadError),
            )}
          />
          <Route
            path="/new-unenrolled-covid-19-vaccine-booking"
            component={asyncLoader(() =>
              import(/* webpackChunkName: "unenrolled-vaccine" */ './unenrolled-vaccine')
                .then(({ UnenrolledVaccineSection, reducer }) => {
                  store.injectReducer('unenrolledVaccine', reducer);
                  return UnenrolledVaccineSection;
                })
                .catch(handleLoadError),
            )}
          />
          <Redirect
            from="/new-covid-19-vaccine-booking"
            to="/new-appointment"
          />
          <EnrolledRoute path="/" component={AppointmentList} />
        </Switch>
      </VAOSApp>
    </ErrorBoundary>
  );
}
