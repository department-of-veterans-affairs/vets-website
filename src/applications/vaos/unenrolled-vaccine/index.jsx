import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  useLocation,
  Redirect,
} from 'react-router-dom';
import unenrolledVaccineReducer from './redux/reducer';
import FormLayout from './components/FormLayout';
import PlanAheadPage from './components/PlanAheadPage';
import ConfirmationPage from './components/ConfirmationPage';
import { selectFeatureUnenrolledVaccine } from '../redux/selectors';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import useFormRedirectToStart from '../hooks/useFormRedirectToStart';
import useFormUnsavedDataWarning from '../hooks/useFormUnsavedDataWarning';

export function UnenrolledVaccineSection() {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const featureUnenrolledVaccine = useSelector(selectFeatureUnenrolledVaccine);

  useEffect(
    () => {
      if (!featureUnenrolledVaccine) {
        history.push('/');
      }
    },
    [featureUnenrolledVaccine, history],
  );

  useManualScrollRestoration();

  useFormUnsavedDataWarning({
    // We don't want to warn a user about leaving the flow when they're shown the page
    // that says they can't make an appointment online
    disabled: location.pathname.includes('contact-facility'),
  });

  const shouldRedirectToStart = useFormRedirectToStart({
    shouldRedirect: () =>
      !location.pathname.endsWith(match.url) &&
      !location.pathname.endsWith('confirmation'),
  });
  if (shouldRedirectToStart) {
    return <Redirect to={match.url} />;
  }

  return (
    <FormLayout>
      <Switch>
        <Route
          path={`${match.url}/confirmation`}
          component={ConfirmationPage}
        />
        <Route path="/" component={PlanAheadPage} />
      </Switch>
    </FormLayout>
  );
}

export const reducer = unenrolledVaccineReducer;
