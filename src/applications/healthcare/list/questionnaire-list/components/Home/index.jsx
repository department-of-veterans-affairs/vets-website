import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import backendServices from 'platform/user/profile/constants/backendServices';
import environment from 'platform/utilities/environment';

import TabNav from './TabNav';
import ToDoQuestionnaires from '../ToDoQuestionnaires';
import CompletedQuestionnaires from '../CompletedQuestionnaires';
import { loadQuestionnaires } from '../../../api';
import {
  questionnaireListLoading,
  questionnaireListLoaded,
} from '../../../actions';

import { sortQuestionnairesByStatus } from '../../../utils';

const Home = props => {
  const { user, isLoading, setLoading, setQuestionnaireData } = props;

  useEffect(
    () => {
      // call the API
      setLoading();
      loadQuestionnaires().then(response => {
        const { data } = response;
        // load data in to redux
        setQuestionnaireData(sortQuestionnairesByStatus(data));
      });
    },
    [setLoading, setQuestionnaireData],
  );
  return (
    <RequiredLoginView
      serviceRequired={[backendServices.USER_PROFILE]}
      user={user}
      verify={!environment.isLocalhost()}
    >
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
        <h1>Your health questionnaires</h1>
        <p className="va-introtext">
          Review and keep track of your completed health care questionnaires and
          any you need to fill out before your upcoming appointment. You can
          also print a copy of questionnaires you've completed.
        </p>
        {isLoading ? (
          <>
            <LoadingIndicator message="Loading your questionnaires." />
          </>
        ) : (
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
        )}
      </div>
    </RequiredLoginView>
  );
};

function mapStateToProps(state) {
  return {
    user: state.user,
    isLoading: state.questionnaireListData?.list?.status?.isLoading,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setLoading: () => dispatch(questionnaireListLoading()),
    setQuestionnaireData: value => dispatch(questionnaireListLoaded(value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
