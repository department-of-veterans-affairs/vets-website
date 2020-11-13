import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import TabNav from './TabNav';

import ToDoQuestionnaires from '../ToDoQuestionnaires';
import CompletedQuestionnaires from '../CompletedQuestionnaires';

export default function index() {
  return (
    <div>
      <h1>Your health care questionnaires</h1>
      <p className="va-introtext">
        Review and keep track of your completed health care questionnaires and
        any you need to fill out before your upcoming appointment. You can also
        print a copy of questionnaires you've completed.
      </p>
      <Router>
        <TabNav />
        <Switch>
          <Route path={`/questionnaire/todo`} component={ToDoQuestionnaires} />
          <Route
            path={`/questionnaire/completed`}
            component={CompletedQuestionnaires}
          />
          <Route path={`/questionnaire`} component={ToDoQuestionnaires} />
        </Switch>
      </Router>
    </div>
  );
}
