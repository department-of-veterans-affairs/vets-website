import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import FormFooter from 'platform/forms/components/FormFooter';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import {
  WIZARD_STATUS_NOT_STARTED,
  WIZARD_STATUS_RESTARTED,
  WIZARD_STATUS_COMPLETE,
  restartShouldRedirect,
} from 'platform/site-wide/wizard';

import formConfig from '../config/form';
import OrientationWizardContainer from './OrientationWizardContainer';
import { WIZARD_STATUS, VRE_ROOT_URL } from '../constants';

function App({ location, children, router, chapter31Feature, isLoggedIn }) {
  const [wizardState, setWizardState] = useState(WIZARD_STATUS_NOT_STARTED);
  let content;

  const wizardStateHandler = status => {
    sessionStorage.setItem(WIZARD_STATUS, status);
    setWizardState(status);
  };

  useEffect(() => {
    const shouldRestart = restartShouldRedirect(WIZARD_STATUS);
    wizardStateHandler(
      shouldRestart
        ? WIZARD_STATUS_RESTARTED
        : sessionStorage.getItem(WIZARD_STATUS),
    );
    if (shouldRestart) {
      router.push('/');
    }
  });
  if (chapter31Feature === undefined) {
    content = <LoadingIndicator message="Loading..." />;
  } else if (!chapter31Feature) {
    content = (
      <div className="row vads-u-margin-bottom--1">
        <div className="usa-width-two-thirds medium-8 columns">
          <article>
            <FormTitle title="Veteran Readiness and Employment" />
            <p>
              Equal to VA Form 28-1900 (Vocational Rehabilitation for Claimants
              With Service-Connected Disabilities)
            </p>
            <AlertBox
              status="info"
              headline="We’re still working on this feature"
              content={
                <>
                  <p>
                    We’re rolling out the Veteran Readiness and Employment form
                    in stages. It’s not quite ready yet. Please check back again
                    soon.{' '}
                  </p>
                  <a
                    href={VRE_ROOT_URL}
                    className="u-vads-display--block u-vads-margin-top--2"
                  >
                    Return to Veteran Readiness and Employment page
                  </a>
                </>
              }
            />
          </article>
        </div>
      </div>
    );
  } else if (wizardState !== WIZARD_STATUS_COMPLETE) {
    content = (
      <OrientationWizardContainer wizardStateHandler={wizardStateHandler} />
    );
  } else {
    content = (
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    );
  }
  if (!isLoggedIn) {
    document.location.pathname.replace(
      '/careers-employment/vocational-rehabilitation/apply',
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
  isLoggedIn: store?.user?.login?.currentlyLoggedIn,
});

export default connect(mapStateToProps)(App);
