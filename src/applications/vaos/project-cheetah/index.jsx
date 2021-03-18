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
import * as listActions from '../appointment-list/redux/actions';
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
import ErrorMessage from '../components/ErrorMessage';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import {
  selectCanUseVaccineFlow,
  selectDirectScheduleSettingsStatus,
} from '../appointment-list/redux/selectors';

export function NewBookingSection({
  canUseVaccineFlow,
  featureProjectCheetah,
  directScheduleSettingsStatus,
  fetchDirectScheduleSettings,
}) {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (directScheduleSettingsStatus === FETCH_STATUS.notStarted) {
      fetchDirectScheduleSettings();
    }
  }, []);

  useEffect(
    () => {
      if (!featureProjectCheetah) {
        history.push('/');
      }
    },
    [featureProjectCheetah, history],
  );

  useEffect(
    () => {
      if (directScheduleSettingsStatus === FETCH_STATUS.failed) {
        scrollAndFocus();
      }
    },
    [directScheduleSettingsStatus],
  );

  useManualScrollRestoration();

  useFormUnsavedDataWarning({
    // We don't want to warn a user about leaving the flow when they're shown the page
    // that says they can't make an appointment online
    disabled: location.pathname.includes('contact-facilities'),
  });

  const shouldRedirectToStart = useFormRedirectToStart({
    shouldRedirect: () =>
      !location.pathname.endsWith(match.url) &&
      !location.pathname.endsWith('confirmation'),
  });
  if (shouldRedirectToStart) {
    return <Redirect to={match.url} />;
  }

  if (directScheduleSettingsStatus === FETCH_STATUS.failed) {
    return <ErrorMessage level="1" />;
  }

  if (
    directScheduleSettingsStatus === FETCH_STATUS.loading ||
    directScheduleSettingsStatus === FETCH_STATUS.notStarted
  ) {
    return (
      <div className="vads-u-margin-y--8">
        <LoadingIndicator
          setFocus
          message="Checking for online appointment availability"
        />
      </div>
    );
  }

  // Redirect the user to the Contact Facilities page when there are no facilities that
  // support scheduling an appointment for the vaccine.
  if (
    !canUseVaccineFlow &&
    directScheduleSettingsStatus === FETCH_STATUS.succeeded &&
    !location.pathname.includes(`${match.url}/contact-facilities`)
  ) {
    return <Redirect to={`${match.url}/contact-facilities`} />;
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
    directScheduleSettingsStatus: selectDirectScheduleSettingsStatus(state),
    canUseVaccineFlow: selectCanUseVaccineFlow(state),
    pageChangeInProgress: state.projectCheetah.newBooking.pageChangeInProgress,
  };
}
const mapDispatchToProps = {
  fetchDirectScheduleSettings: listActions.fetchDirectScheduleSettings,
};

export const NewBooking = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewBookingSection);

export const reducer = projectCheetahReducer;
