import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import projectCheetahReducer from './redux/reducer';
import FormLayout from './components/FormLayout';
import InfoPage from './components/InfoPage';
import SelectDate1Page from './components/SelectDate1Page';
import SelectDate2Page from './components/SelectDate2Page';
import ReviewPage from './components/ReviewPage';
import ConfirmationPage from './components/ConfirmationPage';

export function NewBookingSection() {
  const match = useRouteMatch();

  useEffect(() => {
    if (window.History) {
      window.History.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <FormLayout>
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
    </FormLayout>
  );
}

export const NewBooking = connect()(NewBookingSection);

export const reducer = projectCheetahReducer;
