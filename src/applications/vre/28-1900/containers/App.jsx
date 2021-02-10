import React, { useEffect, useState } from 'react';
import FormFooter from 'platform/forms/components/FormFooter';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import OrientationWizardContainer from './OrientationWizardContainer';
import { WIZARD_STATUS } from '../constants';

export default function App({ location, children }) {
  const [wizardState, setWizardState] = useState(false);
  let content;

  const wizardStateHandler = status => {
    sessionStorage.setItem(WIZARD_STATUS, status);
    setWizardState(status);
  };

  useEffect(
    () => {
      setWizardState(sessionStorage.getItem(WIZARD_STATUS));
    },
    [setWizardState],
  );

  if (!wizardState) {
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
