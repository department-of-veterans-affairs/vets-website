import React from 'react';
import { Route, IndexRoute } from 'react-router';
import asyncLoader from 'platform/utilities/ui/asyncLoader';
import AppointmentsPage from './containers/AppointmentsPage';
import VAOSApp from './containers/VAOSApp';

const routes = (
  <Route path="/" component={VAOSApp}>
    <IndexRoute component={AppointmentsPage} />
    <Route
      path="new-appointment"
      component={asyncLoader(() =>
        import(/* webpackChunkName: "vaos-form" */ './components/NewAppointmentLayout').then(
          m => m.default,
        ),
      )}
    >
      <IndexRoute
        component={asyncLoader(() =>
          import(/* webpackChunkName: "vaos-form" */ './containers/TypeOfCarePage').then(
            m => m.default,
          ),
        )}
      />
      <Route
        path="contact-info"
        component={asyncLoader(() =>
          import(/* webpackChunkName: "vaos-form" */ './containers/ContactInfoPage').then(
            m => m.default,
          ),
        )}
      />
      <Route
        path="choose-facility-type"
        component={asyncLoader(() =>
          import(/* webpackChunkName: "vaos-form" */ './containers/TypeOfFacilityPage').then(
            m => m.default,
          ),
        )}
      />
      <Route
        path="choose-visit-type"
        component={asyncLoader(() =>
          import(/* webpackChunkName: "vaos-form" */ './containers/TypeOfVisitPage').then(
            m => m.default,
          ),
        )}
      />
      <Route
        path="choose-sleep-care"
        component={asyncLoader(() =>
          import(/* webpackChunkName: "vaos-form" */ './containers/TypeOfSleepCarePage').then(
            m => m.default,
          ),
        )}
      />
      <Route
        path="audiology"
        component={asyncLoader(() =>
          import(/* webpackChunkName: "vaos-form" */ './containers/TypeOfAudiologyCarePage').then(
            m => m.default,
          ),
        )}
      />
      <Route
        path="preferred-date"
        component={asyncLoader(() =>
          import(/* webpackChunkName: "vaos-form" */ './containers/PreferredDatePage').then(
            m => m.default,
          ),
        )}
      />
      <Route
        path="request-date"
        component={asyncLoader(() =>
          import(/* webpackChunkName: "vaos-form" */ './containers/DateTimeRequestPage').then(
            m => m.default,
          ),
        )}
      />
      <Route
        path="select-date"
        component={asyncLoader(() =>
          import(/* webpackChunkName: "vaos-form" */ './containers/DateTimeSelectPage').then(
            m => m.default,
          ),
        )}
      />
      <Route
        path="va-facility"
        component={asyncLoader(() =>
          import(/* webpackChunkName: "vaos-form" */ './containers/VAFacilityPage').then(
            m => m.default,
          ),
        )}
      />
      <Route
        path="community-care-preferences"
        component={asyncLoader(() =>
          import(/* webpackChunkName: "vaos-form" */ './containers/CommunityCarePreferencesPage').then(
            m => m.default,
          ),
        )}
      />
      <Route
        path="clinics"
        component={asyncLoader(() =>
          import(/* webpackChunkName: "vaos-form" */ './containers/ClinicChoicePage').then(
            m => m.default,
          ),
        )}
      />
      <Route
        path="reason-appointment"
        component={asyncLoader(() =>
          import(/* webpackChunkName: "vaos-form" */ './containers/ReasonForAppointmentPage').then(
            m => m.default,
          ),
        )}
      />
      <Route
        path="review"
        component={asyncLoader(() =>
          import(/* webpackChunkName: "vaos-form" */ './containers/ReviewPage').then(
            m => m.default,
          ),
        )}
      />
      <Route
        path="confirmation"
        component={asyncLoader(() =>
          import(/* webpackChunkName: "vaos-form" */ './containers/ConfirmationPage').then(
            m => m.default,
          ),
        )}
      />
    </Route>
  </Route>
);

export default routes;
