import React from 'react';
// import { Switch, Route } from 'react-router-dom';

import TabNav from './TabNav';

// import ToDoQuestionnaires from '../ToDoQuestionnaires';

export default function index() {
  // const routes = (
  //   <Switch>
  //     <Route path="/" component={ToDoQuestionnaires} />
  //   </Switch>
  // );
  return (
    <div>
      <h1>Your health care questionnaires</h1>
      <p className="va-introtext">
        Review and keep track of your completed health care questionnaires and
        any you need to fill out before your upcoming appointment. You can also
        print a copy of questionnaires you've completed.
      </p>
      <TabNav />
      {/* {routes} */}
    </div>
  );
}
