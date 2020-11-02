import React, { useEffect, useState } from 'react';
import FormFooter from 'platform/forms/components/FormFooter';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import WizardContainer from './WizardContainer';
import { WIZARD_STATUS } from 'applications/vre/28-1900/constants';

export default function App({ location, children }) {
  const [wizardState, setWizardState] = useState(false);
  let content;

  useEffect(
    () => {
      const wizardStatus = sessionStorage.getItem(WIZARD_STATUS);
      setWizardState(JSON.parse(wizardStatus));
    },
    [setWizardState],
  );

  if (!wizardState) {
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
