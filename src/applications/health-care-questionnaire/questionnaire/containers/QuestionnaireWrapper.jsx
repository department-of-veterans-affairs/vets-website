import React from 'react';
import { connect } from 'react-redux';

import {
  selectShowQuestionnaire,
  selectLoadingFeatureFlags,
} from '../selectors';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import App from './App';
import BreadCrumbs from '../components/bread-crumbs/BreadCrumbs';
import { getAppointmentIdFromUrl } from '../utils';

const QuestionnaireWrapper = ({
  location,
  children,
  isQuestionnaireEnabled,
  isLoadingFeatureFlags,
}) => {
  // check url
  const urlId = getAppointmentIdFromUrl(window);

  // if a url id
  if (urlId) {
    // store in session
    const data = {
      appointmentId: urlId,
    };
    sessionStorage.setItem('currentHealthQuestionnaire', JSON.stringify(data));
  } else {
    // if no url id,
    const data = sessionStorage.getItem('currentHealthQuestionnaire') ?? '{}';
    const parsed = JSON.parse(data);
    const sId = parsed?.appointmentId;
    // check session
    if (!sId) {
      // if no url and no session, trigger redirect.
      return window.location.replace(
        '/health-care/health-questionnaires/questionnaires',
      );
    }
  }

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
      <>
        <BreadCrumbs />
        <App location={location}>{children}</App>
      </>
    );
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
