import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import FormFooter from 'platform/forms/components/FormFooter';

import {
  WIZARD_STATUS_NOT_STARTED,
  WIZARD_STATUS_RESTARTED,
  WIZARD_STATUS_COMPLETE,
  restartShouldRedirect,
} from 'platform/site-wide/wizard';

import WizardContainer from './WizardContainer';
import { WIZARD_STATUS, CAREERS_EMPLOYMENT_ROOT_URL } from '../constants';
import formConfig from '../config/form';

// Need to set status of whether or not the wizard is complete to local storage
// Read from local storage to determine if we should render the wizard OR the intro page

function App({ location, children, chapter36Feature, router }) {
  const [wizardState, setWizardState] = useState(WIZARD_STATUS_NOT_STARTED);

  // pass this to wizard pages so re-render doesn't happen on
  // successful wizard entry
  const setWizardStatusHandler = value => {
    sessionStorage.setItem(WIZARD_STATUS, value);
  };

  const setWizardStatus = value => {
    sessionStorage.setItem(WIZARD_STATUS, value);
    setWizardState(value);
  };

  let content;
  useEffect(() => {
    const shouldRestart = restartShouldRedirect(WIZARD_STATUS);
    setWizardStatus(
      shouldRestart
        ? WIZARD_STATUS_RESTARTED
        : sessionStorage.getItem(WIZARD_STATUS),
    );
    if (shouldRestart) {
      router.push('/');
    }
  });

  if (chapter36Feature === undefined) {
    content = <LoadingIndicator message="Loading..." />;
  } else if (!chapter36Feature) {
    content = (
      <div className="row vads-u-margin-bottom--1">
        <div className="usa-width-two-thirds medium-8 columns">
          <article>
            <FormTitle title="Personalized Career Planning and Guidance" />
            <p>
              Equal to VA Form 28-8832 (Education/Vocational Counseling
              Application)
            </p>
            <AlertBox
              status="info"
              headline="We’re still working on this feature"
              content={
                <>
                  <p>
                    We’re rolling out the Personalized Career Planning and
                    Guidance form in stages. It’s not quite ready yet. Please
                    check back again soon.{' '}
                  </p>
                  <a
                    href={CAREERS_EMPLOYMENT_ROOT_URL}
                    className="u-vads-display--block u-vads-margin-top--2"
                  >
                    Return to Career Planning and Guidance page
                  </a>
                </>
              }
            />
          </article>
        </div>
      </div>
    );
  } else if (wizardState !== WIZARD_STATUS_COMPLETE) {
    content = <WizardContainer setWizardStatus={setWizardStatusHandler} />;
  } else {
    content = (
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
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
  chapter36Feature: toggleValues(store)[FEATURE_FLAG_NAMES.showChapter36],
});

export default connect(mapStateToProps)(App);
