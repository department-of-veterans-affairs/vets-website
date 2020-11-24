import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import backendServices from 'platform/user/profile/constants/backendServices';
import environment from 'platform/utilities/environment';

import TabNav from './TabNav';
import ToDoQuestionnaires from '../ToDoQuestionnaires';
import CompletedQuestionnaires from '../CompletedQuestionnaires';

const Home = props => {
  const { user } = props;
  return (
    <RequiredLoginView
      serviceRequired={[backendServices.USER_PROFILE]}
      user={user}
      verify={!environment.isLocalhost()}
    >
      <div className="row">
        <div className="usa-width-three-fourths medium-8 columns">
          <h1>Your health care questionnaires</h1>
          <p className="va-introtext">
            Review and keep track of your completed health care questionnaires
            and any you need to fill out before your upcoming appointment. You
            can also print a copy of questionnaires you've completed.
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
    </RequiredLoginView>
  );
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(Home);
