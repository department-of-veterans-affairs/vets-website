import React from 'react';
import { Route, IndexRoute } from 'react-router';
import asyncLoader from 'platform/utilities/ui/asyncLoader';
import AppointmentsPage from './containers/AppointmentsPage';
import VAOSApp from './containers/VAOSApp';

const ReasonForAppointmentPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/ReasonForAppointmentPage').then(
    m => m.default,
  ),
);
const TypeOfCarePage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/TypeOfCarePage').then(
    m => m.default,
  ),
);
const CommunityCarePreferencesPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/CommunityCarePreferencesPage').then(
    m => m.default,
  ),
);
const TypeOfAudiologyCarePage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/TypeOfAudiologyCarePage').then(
    m => m.default,
  ),
);
const TypeOfFacilityPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/TypeOfFacilityPage').then(
    m => m.default,
  ),
);
const ContactInfoPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/ContactInfoPage').then(
    m => m.default,
  ),
);
const VAFacilityPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/VAFacilityPage').then(
    m => m.default,
  ),
);
const TypeOfVisitPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/TypeOfVisitPage').then(
    m => m.default,
  ),
);
const ReviewPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/ReviewPage').then(
    m => m.default,
  ),
);
const ClinicChoicePage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/ClinicChoicePage').then(
    m => m.default,
  ),
);
const TypeOfSleepCarePage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/TypeOfSleepCarePage').then(
    m => m.default,
  ),
);
const PreferredDatePage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/PreferredDatePage').then(
    m => m.default,
  ),
);
const DateTimeRequestPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/DateTimeRequestPage').then(
    m => m.default,
  ),
);
const DateTimeSelectPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/DateTimeSelectPage').then(
    m => m.default,
  ),
);
const ConfirmationPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/ConfirmationPage').then(
    m => m.default,
  ),
);

export default function createRoutesWithStore(store) {
  return (
    <Route path="/" component={VAOSApp}>
      <IndexRoute component={AppointmentsPage} />
      <Route
        path="new-appointment"
        component={asyncLoader(() =>
          Promise.all([
            import(/* webpackChunkName: "vaos-form" */ './components/NewAppointmentLayout'),
            import(/* webpackChunkName: "vaos-form" */ './reducers/newAppointment'),
          ]).then(([component, reducer]) => {
            store.injectReducer('newAppointment', reducer.default);
            return component.default;
          }),
        )}
      >
        <IndexRoute component={TypeOfCarePage} />
        <Route path="contact-info" component={ContactInfoPage} />
        <Route path="choose-facility-type" component={TypeOfFacilityPage} />
        <Route path="choose-visit-type" component={TypeOfVisitPage} />
        <Route path="choose-sleep-care" component={TypeOfSleepCarePage} />
        <Route path="audiology" component={TypeOfAudiologyCarePage} />
        <Route path="preferred-date" component={PreferredDatePage} />
        <Route path="request-date" component={DateTimeRequestPage} />
        <Route path="select-date" component={DateTimeSelectPage} />
        <Route path="va-facility" component={VAFacilityPage} />
        <Route
          path="community-care-preferences"
          component={CommunityCarePreferencesPage}
        />
        <Route path="clinics" component={ClinicChoicePage} />
        <Route path="reason-appointment" component={ReasonForAppointmentPage} />
        <Route path="review" component={ReviewPage} />
        <Route path="confirmation" component={ConfirmationPage} />
      </Route>
    </Route>
  );
}
