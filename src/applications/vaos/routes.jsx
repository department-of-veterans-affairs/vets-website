import React from 'react';
import { Route, IndexRoute } from 'react-router';
import asyncLoader from 'platform/utilities/ui/asyncLoader';
import AppointmentsPage from './containers/AppointmentsPage';
import FutureAppointmentsList from './components/FutureAppointmentsList';
import PastAppointmentsList from './components/PastAppointmentsList';
import VAOSApp from './containers/VAOSApp';

const ReasonForAppointmentPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/ReasonForAppointmentPage'),
);
const TypeOfCarePage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/TypeOfCarePage'),
);
const CommunityCarePreferencesPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/CommunityCarePreferencesPage'),
);
const TypeOfAudiologyCarePage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/TypeOfAudiologyCarePage'),
);
const TypeOfFacilityPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/TypeOfFacilityPage'),
);
const ContactInfoPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/ContactInfoPage'),
);
const VAFacilityPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/VAFacilityPage'),
);
const TypeOfVisitPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/TypeOfVisitPage'),
);
const ReviewPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/ReviewPage'),
);
const ClinicChoicePage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/ClinicChoicePage'),
);
const TypeOfSleepCarePage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/TypeOfSleepCarePage'),
);
const TypeOfEyeCarePage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/TypeOfEyeCarePage'),
);
const PreferredDatePage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/PreferredDatePage'),
);
const DateTimeRequestPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/DateTimeRequestPage'),
);
const DateTimeSelectPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/DateTimeSelectPage'),
);
const ConfirmationPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './containers/ConfirmationPage'),
);
const ExpressCareList = asyncLoader(() =>
  import(/* webpackChunkName: "express-care" */ './components/ExpressCareList'),
);

export default function createRoutesWithStore(store) {
  return (
    <Route component={VAOSApp}>
      <Route path="/" component={AppointmentsPage}>
        <IndexRoute component={FutureAppointmentsList} />
        <Route component={PastAppointmentsList} path="past" />
        <Route component={ExpressCareList} path="express-care" />
      </Route>
      <Route
        path="new-appointment"
        component={asyncLoader(() =>
          Promise.all([
            import(/* webpackChunkName: "vaos-form" */ './containers/NewAppointmentLayout'),
            import(/* webpackChunkName: "vaos-form" */ './reducers/newAppointment'),
          ]).then(([component, reducer]) => {
            store.injectReducer('newAppointment', reducer.default);
            return component;
          }),
        )}
      >
        <IndexRoute component={TypeOfCarePage} />
        <Route path="contact-info" component={ContactInfoPage} />
        <Route path="choose-facility-type" component={TypeOfFacilityPage} />
        <Route path="choose-visit-type" component={TypeOfVisitPage} />
        <Route path="choose-sleep-care" component={TypeOfSleepCarePage} />
        <Route path="choose-eye-care" component={TypeOfEyeCarePage} />
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
