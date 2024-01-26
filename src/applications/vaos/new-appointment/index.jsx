import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Switch,
  Route,
  useRouteMatch,
  useLocation,
  Redirect,
} from 'react-router-dom';
// import { selectVAPResidentialAddress } from 'platform/user/selectors';
import { selectIsCernerOnlyPatient } from 'platform/user/cerner-dsot/selectors';
import { selectFeatureBreadcrumbUrlUpdate } from '../redux/selectors';
import { selectIsNewAppointmentStarted } from './redux/selectors';
import newAppointmentReducer from './redux/reducer';
import FormLayout from './components/FormLayout';
import TypeOfCarePage from './components/TypeOfCarePage';
import ContactInfoPage from './components/ContactInfoPage';
import TypeOfVisitPage from './components/TypeOfVisitPage';
import TypeOfSleepCarePage from './components/TypeOfSleepCarePage';
import TypeOfEyeCarePage from './components/TypeOfEyeCarePage';
import TypeOfAudiologyCarePage from './components/TypeOfAudiologyCarePage';
import PreferredDatePage from './components/PreferredDatePage';
import DateTimeRequestPage from './components/DateTimeRequestPage';
import VARequest from './components/DateTimeRequestPage/VA';
import CCRequest from './components/DateTimeRequestPage/CommunityCare';
import DateTimeSelectPage from './components/DateTimeSelectPage';
import VAFacilityPageV2 from './components/VAFacilityPage/VAFacilityPageV2';
import ClosestCityStatePage from './components/ClosestCityStatePage';
import CommunityCareLanguagePage from './components/CommunityCareLanguagePage';
import CommunityCareProviderSelectionPage from './components/CommunityCareProviderSelectionPage';
import ClinicChoicePage from './components/ClinicChoicePage';
import ReasonForAppointmentPage from './components/ReasonForAppointmentPage';
import ReviewPage from './components/ReviewPage';
import ConfirmationPage from './components/ConfirmationPage';
import TypeOfFacilityPage from './components/TypeOfFacilityPage';
import useFormRedirectToStart from '../hooks/useFormRedirectToStart';
import useFormUnsavedDataWarning from '../hooks/useFormUnsavedDataWarning';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import ScheduleCernerPage from './components/ScheduleCernerPage';
import useVariantSortMethodTracking from './hooks/useVariantSortMethodTracking';

export function NewAppointment() {
  const isCernerOnlyPatient = useSelector(selectIsCernerOnlyPatient);
  const isNewAppointmentStarted = useSelector(selectIsNewAppointmentStarted);
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );
  const match = useRouteMatch();
  const location = useLocation();
  const [crumb, setCrumb] = useState('New appointment');

  useManualScrollRestoration();

  useFormUnsavedDataWarning({
    // If we're on the facility page for a Cerner only patient, there's a link to send the user to
    // the Cerner portal, and it would be annoying to show the "You may have unsaved changes" message
    // when a user clicks on that link
    disabled: location.pathname.includes('va-facility') && isCernerOnlyPatient,
  });

  const shouldRedirectToStart = useFormRedirectToStart({
    shouldRedirect: () =>
      !isNewAppointmentStarted &&
      !location.pathname.endsWith('confirmation') &&
      !location.pathname.endsWith('type-of-care'),
  });

  useVariantSortMethodTracking({ skip: shouldRedirectToStart });

  if (shouldRedirectToStart) {
    return <Redirect to="/" />;
  }

  if (featureBreadcrumbUrlUpdate) {
    return (
      <FormLayout
        isReviewPage={location.pathname.includes('review')}
        pageTitle={crumb}
      >
        <Switch>
          <Route
            path={[
              `${match.url}/va-request/contact-information`,
              `${match.url}/community-request/contact-information`,
              `${match.url}/contact-information`,
            ]}
          >
            <ContactInfoPage changeCrumb={newTitle => setCrumb(newTitle)} />
          </Route>
          <Route path={`${match.url}/facility-type`}>
            <TypeOfFacilityPage changeCrumb={newTitle => setCrumb(newTitle)} />
          </Route>
          <Route
            path={[
              `${match.url}/va-request/preferred-method`,
              `${match.url}/choose-visit-type`,
            ]}
          >
            <TypeOfVisitPage changeCrumb={newTitle => setCrumb(newTitle)} />
          </Route>
          <Route path={`${match.url}/sleep-care`}>
            <TypeOfSleepCarePage changeCrumb={newTitle => setCrumb(newTitle)} />
          </Route>
          <Route path={`${match.url}/eye-care`}>
            <TypeOfEyeCarePage changeCrumb={newTitle => setCrumb(newTitle)} />
          </Route>
          <Route path={`${match.url}/audiology-care`}>
            <TypeOfAudiologyCarePage
              changeCrumb={newTitle => setCrumb(newTitle)}
            />
          </Route>
          <Route path={`${match.url}/preferred-date`}>
            <PreferredDatePage changeCrumb={newTitle => setCrumb(newTitle)} />
          </Route>
          <Route path={`${match.url}/date-time`}>
            <DateTimeSelectPage changeCrumb={newTitle => setCrumb(newTitle)} />
          </Route>
          <Route exact path={`${match.url}/va-request/`}>
            <VARequest changeCrumb={newTitle => setCrumb(newTitle)} />
          </Route>
          <Route exact path={`${match.url}/community-request/`}>
            <CCRequest changeCrumb={newTitle => setCrumb(newTitle)} />
          </Route>
          <Route path={`${match.url}/location`}>
            <VAFacilityPageV2 changeCrumb={newTitle => setCrumb(newTitle)} />
          </Route>
          <Route
            path={`${match.url}/how-to-schedule`}
            component={ScheduleCernerPage}
          />
          <Route
            path={[
              `${match.url}/va-request/community-care-preferences`,
              `${match.url}/community-request/preferred-provider`,
            ]}
          >
            <CommunityCareProviderSelectionPage
              changeCrumb={newTitle => setCrumb(newTitle)}
            />
          </Route>
          <Route
            path={[
              `${match.url}/va-request/community-care-language`,
              `${match.url}/community-request/preferred-language`,
            ]}
          >
            <CommunityCareLanguagePage
              changeCrumb={newTitle => setCrumb(newTitle)}
            />
          </Route>
          <Route
            path={[
              `${match.url}/va-request/choose-closest-city`,
              `${match.url}/community-request/closest-city`,
            ]}
          >
            <ClosestCityStatePage
              changeCrumb={newTitle => setCrumb(newTitle)}
            />
          </Route>
          <Route path={`${match.url}/clinic`}>
            <ClinicChoicePage changeCrumb={newTitle => setCrumb(newTitle)} />
          </Route>
          <Route
            path={[
              `${match.url}/va-request/reason`,
              `${match.url}/community-request/reason`,
              `${match.url}/reason`,
            ]}
          >
            <ReasonForAppointmentPage
              changeCrumb={newTitle => setCrumb(newTitle)}
            />
          </Route>
          <Route
            path={[
              `${match.url}/va-request/review`,
              `${match.url}/community-request/review`,
              `${match.url}/review`,
            ]}
          >
            <ReviewPage changeCrumb={newTitle => setCrumb(newTitle)} />
          </Route>
          <Route
            path={`${match.url}/confirmation`}
            component={ConfirmationPage}
          />
          <Route path={match.url}>
            <TypeOfCarePage changeCrumb={newTitle => setCrumb(newTitle)} />
          </Route>
        </Switch>
      </FormLayout>
    );
  }
  return (
    <FormLayout
      isReviewPage={location.pathname.includes('review')}
      pageTitle={crumb}
    >
      <Switch>
        <Route path={`${match.url}/contact-info`} component={ContactInfoPage} />
        <Route
          path={`${match.url}/choose-facility-type`}
          component={TypeOfFacilityPage}
        />
        <Route
          path={`${match.url}/choose-visit-type`}
          component={TypeOfVisitPage}
        />
        <Route
          path={`${match.url}/choose-sleep-care`}
          component={TypeOfSleepCarePage}
        />
        <Route
          path={`${match.url}/choose-eye-care`}
          component={TypeOfEyeCarePage}
        />
        <Route
          path={`${match.url}/audiology`}
          component={TypeOfAudiologyCarePage}
        />
        <Route
          path={`${match.url}/preferred-date`}
          component={PreferredDatePage}
        />
        <Route
          path={`${match.url}/request-date`}
          component={DateTimeRequestPage}
        />
        <Route
          path={`${match.url}/select-date`}
          component={DateTimeSelectPage}
        />
        <Route
          path={`${match.url}/va-facility-2`}
          component={VAFacilityPageV2}
        />
        <Route
          path={`${match.url}/how-to-schedule`}
          component={ScheduleCernerPage}
        />
        <Route
          path={`${match.url}/community-care-preferences`}
          component={CommunityCareProviderSelectionPage}
        />
        <Route
          path={`${match.url}/community-care-language`}
          component={CommunityCareLanguagePage}
        />
        <Route
          path={`${match.url}/choose-closest-city`}
          component={ClosestCityStatePage}
        />
        <Route path={`${match.url}/clinics`} component={ClinicChoicePage} />
        <Route
          path={`${match.url}/reason-appointment`}
          component={ReasonForAppointmentPage}
        />
        <Route path={`${match.url}/review`} component={ReviewPage} />
        <Route
          path={`${match.url}/confirmation`}
          component={ConfirmationPage}
        />
        <Route path="/" component={TypeOfCarePage} />
      </Switch>
    </FormLayout>
  );
}

export const reducer = newAppointmentReducer;
