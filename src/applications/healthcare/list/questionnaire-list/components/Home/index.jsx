import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import TabNav from './TabNav';

import ToDoQuestionnaires from '../ToDoQuestionnaires';
import CompletedQuestionnaires from '../CompletedQuestionnaires';

export default function index() {
  // TODO: Auth
  return (
    <div className="row">
      <div className="usa-width-two-thirds medium-8 columns">
        <h1>Your health care questionnaires</h1>
        <p className="va-introtext">
          Review and keep track of your completed health care questionnaires and
          any you need to fill out before your upcoming appointment. You can
          also print a copy of questionnaires you've completed.
        </p>
        <Router>
          <TabNav />
          <Switch>
            <Route
              path={`/healthcare/list/todo`}
              component={ToDoQuestionnaires}
            />
            <Route
              path={`/healthcare/list/completed`}
              component={CompletedQuestionnaires}
            />
            <Route path={`/healthcare/list`} component={ToDoQuestionnaires} />
          </Switch>
        </Router>
      </div>
    </div>
  );
}
