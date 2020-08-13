import React from 'react';
import { Route, IndexRoute } from 'react-router';
import asyncLoader from 'platform/utilities/ui/asyncLoader';
import AppointmentsPage from './appointment-list/AppointmentsPage';
import FutureAppointmentsList from './appointment-list/FutureAppointmentsList';
import PastAppointmentsList from './appointment-list/PastAppointmentsList';
import VAOSApp from './VAOSApp';

const ReasonForAppointmentPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './new-appointment/ReasonForAppointmentPage'),
);
const TypeOfCarePage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './new-appointment/TypeOfCarePage'),
);
const CommunityCarePreferencesPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './new-appointment/CommunityCarePreferencesPage'),
);
const TypeOfAudiologyCarePage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './new-appointment/TypeOfAudiologyCarePage'),
);
const TypeOfFacilityPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './new-appointment/TypeOfFacilityPage'),
);
const ContactInfoPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './new-appointment/ContactInfoPage'),
);
const VAFacilityPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './new-appointment/VAFacilityPage'),
);
const TypeOfVisitPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './new-appointment/TypeOfVisitPage'),
);
const ReviewPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './new-appointment/ReviewPage/ReviewPage'),
);
const ClinicChoicePage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './new-appointment/ClinicChoicePage'),
);
const TypeOfSleepCarePage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './new-appointment/TypeOfSleepCarePage'),
);
const TypeOfEyeCarePage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './new-appointment/TypeOfEyeCarePage'),
);
const PreferredDatePage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './new-appointment/PreferredDatePage'),
);
const DateTimeRequestPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './new-appointment/DateTimeRequestPage'),
);
const DateTimeSelectPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './new-appointment/DateTimeSelectPage'),
);
const ConfirmationPage = asyncLoader(() =>
  import(/* webpackChunkName: "vaos-form" */ './new-appointment/ConfirmationPage/ConfirmationPage'),
);
const ExpressCareList = asyncLoader(() =>
  import(/* webpackChunkName: "express-care" */ './express-care/components/ExpressCareList'),
);
const NewExpressCareRequestLayout = asyncLoader(() =>
  import(/* webpackChunkName: "express-care" */ './express-care/NewExpressCareRequestLayout'),
);
const ExpressCareInfoPage = asyncLoader(() =>
  import(/* webpackChunkName: "express-care" */ './express-care/ExpressCareInfoPage'),
);
const ExpressCareFormPage = asyncLoader(() =>
  import(/* webpackChunkName: "express-care" */ './express-care/ExpressCareFormPage'),
);
const ExpressCareReasonPage = asyncLoader(() =>
  import(/* webpackChunkName: "express-care" */ './containers/ExpressCareReasonPage'),
);
const ExpressCareDetailsPage = asyncLoader(() =>
  import(/* webpackChunkName: "express-care" */ './containers/ExpressCareDetailsPage'),
);
const ExpressCareConfirmationPage = asyncLoader(() =>
  import(/* webpackChunkName: "express-care" */ './express-care/ExpressCareConfirmationPage'),
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
            import(/* webpackChunkName: "vaos-form" */ './new-appointment/NewAppointmentLayout'),
            import(/* webpackChunkName: "vaos-form" */ './new-appointment/redux/newAppointment'),
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
        <Route path="select-reason" component={ExpressCareReasonPage} />
        <Route path="additional-details" component={ExpressCareDetailsPage} />
        <Route path="confirmation" component={ExpressCareConfirmationPage} />
      </Route>
    </Route>
  );
}
