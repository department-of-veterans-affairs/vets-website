import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
import {
  selectFeatureToggleLoading,
  selectFeatureProjectCheetah,
} from '../redux/selectors';
import projectCheetahReducer from './redux/reducer';
import FormLayout from './components/FormLayout';
import InfoPage from './components/InfoPage';
import SelectDate1Page from './components/SelectDate1Page';
import SelectDate2Page from './components/SelectDate2Page';
import ReviewPage from './components/ReviewPage';
import ConfirmationPage from './components/ConfirmationPage';

export function NewBookingSection({ allowBookings }) {
  const match = useRouteMatch();
  const history = useHistory();

  useEffect(
    () => {
      if (!allowBookings) {
        history.push('/');
      }
    },
    [allowBookings, history],
  );

  return (
    <FormLayout>
      {allowBookings && (
        <Switch>
          <Route
            path={`${match.url}/select-date-1`}
            component={SelectDate1Page}
          />
          <Route
            path={`${match.url}/select-date-2`}
            component={SelectDate2Page}
          />
          <Route path={`${match.url}/review`} component={ReviewPage} />
          <Route
            path={`${match.url}/confirmation`}
            component={ConfirmationPage}
          />
          <Route path="/" component={InfoPage} />
        </Switch>
      )}
    </FormLayout>
  );
}

function mapStateToProps(state) {
  return {
    allowBookings:
      !selectFeatureToggleLoading(state) && selectFeatureProjectCheetah(state),
  };
}

export const NewBooking = connect(mapStateToProps)(NewBookingSection);

export const reducer = projectCheetahReducer;
