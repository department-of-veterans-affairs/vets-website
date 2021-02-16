import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
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

export function NewBookingSection({ featureProjectCheetah }) {
  const match = useRouteMatch();
  const history = useHistory();

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
  };
}

export const NewBooking = connect(mapStateToProps)(NewBookingSection);

export const reducer = projectCheetahReducer;
