import React from 'react';
import { Route, IndexRoute } from 'react-router';
import asyncLoader from 'platform/utilities/ui/asyncLoader';
import AppointmentsPage from './features/appointments/AppointmentsPage';
import FutureAppointmentsList from './features/components/FutureAppointmentsList';
import PastAppointmentsList from './features/components/PastAppointmentsList';
import VAOSApp from './VAOSApp';

const ReasonForAppointmentPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './features/appointments/ReasonForAppointmentPage'),
);
const TypeOfCarePage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './features/appointments/TypeOfCarePage'),
);
const CommunityCarePreferencesPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './features/appointments/CommunityCarePreferencesPage'),
);
const TypeOfAudiologyCarePage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './features/appointments/TypeOfAudiologyCarePage'),
);
const TypeOfFacilityPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './features/appointments/TypeOfFacilityPage'),
);
const ContactInfoPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './features/appointments/ContactInfoPage'),
);
const VAFacilityPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './features/appointments/VAFacilityPage'),
);
const TypeOfVisitPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './features/appointments/TypeOfVisitPage'),
);
const ReviewPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './features/appointments/ReviewPage/ReviewPage'),
);
const ClinicChoicePage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './features/appointments/ClinicChoicePage'),
);
const TypeOfSleepCarePage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './features/appointments/TypeOfSleepCarePage'),
);
const TypeOfEyeCarePage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './features/appointments/TypeOfEyeCarePage'),
);
const PreferredDatePage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './features/appointments/PreferredDatePage'),
);
const DateTimeRequestPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './features/appointments/DateTimeRequestPage'),
);
const DateTimeSelectPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './features/appointments/DateTimeSelectPage'),
);
const ConfirmationPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './features/appointments/ConfirmationPage/ConfirmationPage'),
);
const ExpressCareList = asyncLoader(() =>
  import(/* webpackChunkName: "express-care" */ './features/express-care/ExpressCareList'),
);
const NewExpressCareRequestLayout = asyncLoader(() =>
  import(/* webpackChunkName: "express-care" */ './features/express-care/NewExpressCareRequestLayout'),
);
const ExpressCareInfoPage = asyncLoader(() =>
  import(/* webpackChunkName: "express-care" */ './features/express-care/ExpressCareInfoPage'),
);
const ExpressCareFormPage = asyncLoader(() =>
  import(/* webpackChunkName: "express-care" */ './features/express-care/ExpressCareFormPage'),
);
const ExpressCareConfirmationPage = asyncLoader(() =>
  import(/* webpackChunkName: "express-care" */ './features/express-care/ExpressCareConfirmationPage'),
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
            import(/* webpackChunkName: "vaos-form" */ './features/appointments/NewAppointmentLayout'),
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
      <Route
        path="new-express-care-request"
        component={NewExpressCareRequestLayout}
      >
        <IndexRoute component={ExpressCareInfoPage} />
        <Route path="form" component={ExpressCareFormPage} />
        <Route path="confirmation" component={ExpressCareConfirmationPage} />
      </Route>
    </Route>
  );
}
