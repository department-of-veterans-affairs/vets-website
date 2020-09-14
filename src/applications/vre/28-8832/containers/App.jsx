import React, { useEffect, useState } from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import FormFooter from 'platform/forms/components/FormFooter';
import WizardContainer from './WizardContainer';
import { WIZARD_STATUS } from '../constants';
import formConfig from '../config/form';

// Need to set status of whether or not the wizard is complete to local storage
// Read from local storage to determine if we should render the wizard OR the intro page

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
