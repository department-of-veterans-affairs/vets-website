import React from 'react';
import FormFooter from 'platform/forms/components/FormFooter';

import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { useBrowserMonitoring } from '~/platform/utilities/real-user-monitoring';
import formConfig from '../config/form';
import OrientationWizardContainer from './OrientationWizardContainer';
import { WIZARD_STATUS } from '../constants';
import { default as NewApp } from '../new-28-1900/containers/App';

import '@department-of-veterans-affairs/platform-polyfills';
// import './sass/new-28-1900-chapter-31.scss';

import { startAppFromIndex } from '@department-of-veterans-affairs/platform-startup/exports';

import routes from '../new-28-1900/routes';
import reducer from '../new-28-1900/reducers';
// import manifest from './manifest.json';
import manifest from '../new-28-1900/manifest.json';

startAppFromIndex({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});

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
