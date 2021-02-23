import React, { useEffect, useState } from 'react';
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
import { WIZARD_STATUS } from '../constants';

export default function App({ location, children, router }) {
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

  if (wizardState !== WIZARD_STATUS_COMPLETE) {
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
  return (
    <>
      {content}
      <FormFooter formConfig={formConfig} />
    </>
  );
}
