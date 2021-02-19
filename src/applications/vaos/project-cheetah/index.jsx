import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import * as actions from './redux/actions';
import projectCheetahReducer from './redux/reducer';
import FormLayout from './components/FormLayout';
import PlanAheadPage from './components/PlanAheadPage';
import VAFacilityPage from './components/VAFacilityPage';
import ClinicChoicePage from './components/ClinicChoicePage';
import SelectDate1Page from './components/SelectDate1Page';
import SelectDate2Page from './components/SelectDate2Page';
import ContactInfoPage from './components/ContactInfoPage';
import ReviewPage from './components/ReviewPage';
import ConfirmationPage from './components/ConfirmationPage';
import { selectFeatureProjectCheetah } from '../redux/selectors';
import ReceivedDoseScreenerPage from './components/ReceivedDoseScreenerPage';
import ContactFacilitiesPage from './components/ContactFacilitiesPage';
import { FETCH_STATUS } from '../utils/constants';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

export function NewBookingSection({
  windowsStatus,
  featureProjectCheetah,
  openNewBookingPage,
  pageChangeInProgress,
}) {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();

  useEffect(
    () => {
      openNewBookingPage(history);
    },
    [pageChangeInProgress],
  );

  useEffect(
    () => {
      if (!featureProjectCheetah) {
        history.push('/');
      }
    },
    [featureProjectCheetah, history],
  );

  useEffect(() => {
    if (window.History) {
      window.History.scrollRestoration = 'manual';
    }

    // We don't want people to start in the middle of the form, so redirect them when they jump
    // in the middle. We make an exception for the confirmation page in case someone is going back
    // after submitting.
    if (
      !location.pathname.endsWith('new-project-cheetah-booking') &&
      !location.pathname.endsWith('confirmation')
    ) {
      history.replace('/new-project-cheetah-booking');
    }
  }, []);

  return (
    <FormLayout>
      {(windowsStatus === FETCH_STATUS.loading ||
        windowsStatus === FETCH_STATUS.notStarted) && (
        <LoadingIndicator message="Checking COVID-19 vaccine availability" />
      )}
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
    windowsStatus: state.projectCheetah.newBookingStatus,
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
