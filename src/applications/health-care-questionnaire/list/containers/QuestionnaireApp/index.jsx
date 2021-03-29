import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import Home from '../../questionnaire-list/components/Home';
import {
  selectShowQuestionnaire,
  selectLoadingFeatureFlags,
} from '../../../shared/redux-selectors';

const QuestionnaireApp = props => {
  const { isLoadingFeatureFlags, isQuestionnaireEnabled } = props;

  if (isLoadingFeatureFlags) {
    return (
      <>
        <LoadingIndicator />
      </>
    );
  } else if (!isQuestionnaireEnabled) {
    window.location.replace('/');
    return <></>;
  } else {
    return (
      <div className="questionnaire-app">
        <Home />
      </div>
    );
  }
};

const mapStateToProps = state => ({
  isQuestionnaireEnabled: selectShowQuestionnaire(state),
  isLoadingFeatureFlags: selectLoadingFeatureFlags(state),
});

export default connect(mapStateToProps)(QuestionnaireApp);
