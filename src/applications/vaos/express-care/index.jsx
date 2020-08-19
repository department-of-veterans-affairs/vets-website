import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import NewExpressCareRequestLayout from '../containers/NewExpressCareRequestLayout';
import ExpressCareReasonPage from '../containers/ExpressCareReasonPage';
import ExpressCareDetailsPage from '../containers/ExpressCareDetailsPage';
import ExpressCareConfirmationPage from '../containers/ExpressCareConfirmationPage';
import ExpressCareInfoPage from '../containers/ExpressCareInfoPage';

export function NewExpressCareRequest() {
  const match = useRouteMatch();

  return (
    <NewExpressCareRequestLayout>
      <Switch>
        <Route
          path={`${match.url}/select-reason`}
          component={ExpressCareReasonPage}
        />
        <Route
          path={`${match.url}/additional-details`}
          component={ExpressCareDetailsPage}
        />
        <Route
          path={`${match.url}/confirmation`}
          component={ExpressCareConfirmationPage}
        />
        <Route path="/" component={ExpressCareInfoPage} />
      </Switch>
    </NewExpressCareRequestLayout>
  );
}
