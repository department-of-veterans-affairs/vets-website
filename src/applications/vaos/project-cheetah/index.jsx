import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  useLocation,
  Redirect,
} from 'react-router-dom';
import * as actions from './redux/actions';
import projectCheetahReducer from './redux/reducer';
import FormLayout from './components/FormLayout';
import PlanAheadPage from './components/PlanAheadPage';
import VAFacilityPage from './components/VAFacilityPage';
import ClinicChoicePage from './components/ClinicChoicePage';
import SelectDate1Page from './components/SelectDate1Page';
import ReviewPage from './components/ReviewPage';
import ConfirmationPage from './components/ConfirmationPage';
import { selectFeatureProjectCheetah } from '../redux/selectors';
import SecondDosePage from './components/SecondDosePage';
import ContactInfoPage from './components/ContactInfoPage';
import ReceivedDoseScreenerPage from './components/ReceivedDoseScreenerPage';
import ContactFacilitiesPage from './components/ContactFacilitiesPage';
import { FETCH_STATUS } from '../utils/constants';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import useFormRedirectToStart from '../hooks/useFormRedirectToStart';
import useFormUnsavedDataWarning from '../hooks/useFormUnsavedDataWarning';
import { SelectDate2Page } from './components/SelectDate2Page';
import ErrorMessage from '../components/ErrorMessage';

export function NewBookingSection({
  isEligible,
  newBookingStatus,
  featureProjectCheetah,
  openNewBookingPage,
}) {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();

  useEffect(
    () => {
      openNewBookingPage(history);
    },
    [isEligible],
  );

  useEffect(
    () => {
      if (!featureProjectCheetah) {
        history.push('/');
      }
    },
    [featureProjectCheetah, history],
  );

  useManualScrollRestoration();

  useFormUnsavedDataWarning({
    // We don't want to warn a user about leaving the flow when they're shown the page
    // that says they can't make an appointment online
    disabled: location.pathname.includes('contact-facilities'),
  });

  const shouldRedirectToStart = useFormRedirectToStart({
    shouldRedirect: () =>
      !location.pathname.endsWith('new-project-cheetah-booking') &&
      !location.pathname.endsWith('confirmation'),
  });
  if (shouldRedirectToStart) {
    return <Redirect to="/new-project-cheetah-booking" />;
  }

  const title = <h1 className="vads-u-font-size--h2">{'New Booking'}</h1>;
  if (newBookingStatus === FETCH_STATUS.failed) {
    return (
      <div>
        {title}
        <ErrorMessage level="2" />
      </div>
    );
  }

  if (
    newBookingStatus === FETCH_STATUS.loading ||
    newBookingStatus === FETCH_STATUS.notStarted
  ) {
    return (
      <div className="vads-u-margin-y--8">
        <LoadingIndicator message="Checking for online appointment availability" />
      </div>
    );
  }

  // Redirect the user to the Contact Facilities page when there are no facilities that
  // support scheduling an appointment for the vaccine.
  if (
    !isEligible &&
    newBookingStatus === FETCH_STATUS.succeeded &&
    !location.pathname.includes(
      '/new-project-cheetah-booking/contact-facilities',
    )
  ) {
    return <Redirect to="/new-project-cheetah-booking/contact-facilities" />;
  }

  return (
    <FormLayout>
      <Switch>
        <Route
          path={`${match.url}/received-dose`}
          component={ReceivedDoseScreenerPage}
        />
        <Route
          path={`${match.url}/contact-facilities`}
          component={ContactFacilitiesPage}
        />
        <Route path={`${match.url}/facility`} component={VAFacilityPage} />
        <Route path={`${match.url}/clinic`} component={ClinicChoicePage} />
        <Route
          path={`${match.url}/select-date-1`}
          component={SelectDate1Page}
        />
        <Route
          path={`${match.url}/select-date-2`}
          component={SelectDate2Page}
        />
        <Route
          path={`${match.url}/plan-second-dose`}
          component={SecondDosePage}
        />
        <Route path={`${match.url}/contact-info`} component={ContactInfoPage} />
        <Route path={`${match.url}/review`} component={ReviewPage} />
        <Route
          path={`${match.url}/confirmation`}
          component={ConfirmationPage}
        />
        <Route path="/" component={PlanAheadPage} />
      </Switch>
    </FormLayout>
  );
}

function mapStateToProps(state) {
  return {
    featureProjectCheetah: selectFeatureProjectCheetah(state),
    isEligible: state.projectCheetah.isEligible,
    newBookingStatus: state.projectCheetah.newBookingStatus,
    pageChangeInProgress: state.projectCheetah.newBooking.pageChangeInProgress,
  };
}
const mapDispatchToProps = {
  openNewBookingPage: actions.openNewBookingPage,
};

export const NewBooking = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewBookingSection);

export const reducer = projectCheetahReducer;
