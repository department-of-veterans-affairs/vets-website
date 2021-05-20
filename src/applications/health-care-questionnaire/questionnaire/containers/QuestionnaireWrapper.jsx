import React from 'react';
import { connect } from 'react-redux';

import {
  selectShowQuestionnaire,
  selectLoadingFeatureFlags,
} from '../../shared/redux-selectors';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import App from './App';
import BreadCrumbs from '../components/bread-crumbs/BreadCrumbs';
import {
  getCurrentAppointmentId,
  setCurrentAppointmentId,
} from '../../shared/utils';

const QuestionnaireWrapper = ({
  location,
  children,
  isQuestionnaireEnabled,
  isLoadingFeatureFlags,
}) => {
  const appointmentId = getCurrentAppointmentId(window);

  if (!appointmentId) {
    // if no url and no session, trigger redirect.
    window.location.replace(
      '/health-care/health-questionnaires/questionnaires',
    );
    return <></>;
  } else {
    setCurrentAppointmentId(window, appointmentId);
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
