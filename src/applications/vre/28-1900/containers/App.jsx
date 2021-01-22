import React, { useState } from 'react';
import FormFooter from 'platform/forms/components/FormFooter';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import OrientationWizardContainer from './OrientationWizardContainer';

export default function App({ location, children }) {
  const [wizardState, setWizardState] = useState(false);
  let content;

  const wizardStateHandler = status => {
    setWizardState(status);
  };

  if (!wizardState) {
    content = (
      <OrientationWizardContainer handleWizardUpdate={wizardStateHandler} />
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
