import React from 'react';
import FormFooter from 'platform/forms/components/FormFooter';

import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { useBrowserMonitoring } from '~/platform/utilities/real-user-monitoring';
import formConfig from '../config/form';
import OrientationWizardContainer from './OrientationWizardContainer';
import { WIZARD_STATUS } from '../constants';
import { App as NewApp } from '../new-28-1900/containers/App';

function App({ location }) {
  return <NewApp location={location} />;

  // const wizardStateHandler = status => {
  //   sessionStorage.setItem(WIZARD_STATUS, status);
  // };
  // const content = (
  //   <OrientationWizardContainer wizardStateHandler={wizardStateHandler} />
  // );

  // const { TOGGLE_NAMES } = useFeatureToggle();
  // useBrowserMonitoring({
  //   location,
  //   toggleName: TOGGLE_NAMES.disablityBenefitsBrowserMonitoringEnabled,
  // });

  // return (
  //   <>
  //     {content}
  //     <FormFooter formConfig={formConfig} />
  //   </>
  // );
}

export default App;
