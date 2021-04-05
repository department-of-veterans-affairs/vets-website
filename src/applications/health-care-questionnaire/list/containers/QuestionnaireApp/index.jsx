import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import recordEvent from 'platform/monitoring/record-event';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import Home from '../../questionnaire-list/components/Home';
import {
  selectShowQuestionnaire,
  selectLoadingFeatureFlags,
} from '../../../shared/redux-selectors';

const QuestionnaireApp = props => {
  const { isLoadingFeatureFlags, isQuestionnaireEnabled, location } = props;
  useEffect(
    () => {
      if (location && location.query) {
        const { ref } = location.query;
        if (ref) {
          recordEvent({
            event: 'hcq-list-ref',
            ref,
          });
        }
      }
    },
    [location],
  );
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
