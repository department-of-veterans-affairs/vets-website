import React from 'react';
import { connect } from 'react-redux';

import {
  selectShowQuestionnaire,
  selectLoadingFeatureFlags,
} from '../selectors';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import App from './App';

const QuestionnaireWrapper = ({
  location,
  children,
  isQuestionnaireEnabled,
  isLoadingFeatureFlags,
}) => {
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
    return <App location={location}>{children}</App>;
  }
};

const mapStateToProps = state => ({
  isQuestionnaireEnabled: selectShowQuestionnaire(state),
  isLoadingFeatureFlags: selectLoadingFeatureFlags(state),
});
const mapDispatchToProps = _dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(QuestionnaireWrapper);
