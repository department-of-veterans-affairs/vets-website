import React from 'react';
import FormFooter from 'platform/forms/components/FormFooter';

import formConfig from '../config/form';
import OrientationWizardContainer from './OrientationWizardContainer';
import { WIZARD_STATUS } from '../constants';

function App() {
  const wizardStateHandler = status => {
    sessionStorage.setItem(WIZARD_STATUS, status);
  };
  const content = (
    <OrientationWizardContainer wizardStateHandler={wizardStateHandler} />
  );

  return (
    <>
      {content}
      <FormFooter formConfig={formConfig} />
    </>
  );
}

export default App;
