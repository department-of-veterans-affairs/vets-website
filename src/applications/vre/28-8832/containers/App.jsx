import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import FormFooter from 'platform/forms/components/FormFooter';

import WizardContainer from './WizardContainer';
import { WIZARD_STATUS, CAREERS_EMPLOYMENT_ROOT_URL } from '../constants';
import formConfig from '../config/form';

// Need to set status of whether or not the wizard is complete to local storage
// Read from local storage to determine if we should render the wizard OR the intro page

function App({ location, children, chapter36Feature }) {
  const [wizardState, setWizardState] = useState(false);
  let content;
  useEffect(
    () => {
      const wizardStatus = sessionStorage.getItem(WIZARD_STATUS);
      setWizardState(JSON.parse(wizardStatus));
    },
    [setWizardState],
  );

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
  } else if (!wizardState) {
    content = <WizardContainer />;
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
