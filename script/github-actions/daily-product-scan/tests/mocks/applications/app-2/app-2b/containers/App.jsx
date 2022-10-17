import React, { useEffect, useState } from 'react';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import FormFooter from 'platform/forms/components/FormFooter';

import {
  WIZARD_STATUS_NOT_STARTED,
  WIZARD_STATUS_RESTARTED,
  WIZARD_STATUS_COMPLETE,
  restartShouldRedirect,
} from 'platform/site-wide/wizard';

import WizardContainer from './WizardContainer';
import { WIZARD_STATUS } from '../constants';
import formConfig from '../config/form';

// Need to set status of whether or not the wizard is complete to local storage
// Read from local storage to determine if we should render the wizard OR the intro page

function App({ location, children, router }) {
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

  if (wizardState !== WIZARD_STATUS_COMPLETE) {
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

export default App;
