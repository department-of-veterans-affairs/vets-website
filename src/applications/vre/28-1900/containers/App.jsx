import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FormFooter from 'platform/forms/components/FormFooter';

import formConfig from '../config/form';
import OrientationWizardContainer from './OrientationWizardContainer';
import { WIZARD_STATUS } from '../constants';

import FormInProgressNotification from '../components/FormInProgressNotification';

function App({ chapter31Feature }) {
  let content;

  const wizardStateHandler = status => {
    sessionStorage.setItem(WIZARD_STATUS, status);
  };

  if (chapter31Feature === undefined) {
    content = <LoadingIndicator message="Loading..." />;
  } else if (!chapter31Feature) {
    content = <FormInProgressNotification />;
  } else {
    content = (
      <OrientationWizardContainer wizardStateHandler={wizardStateHandler} />
    );
  }

  return (
    <>
      {content}
      <FormFooter formConfig={formConfig} />
    </>
  );
}

const mapStateToProps = store => ({
  chapter31Feature: toggleValues(store)[FEATURE_FLAG_NAMES.showChapter31],
});

export default connect(mapStateToProps)(App);
