import React from 'react';
import { useSelector } from 'react-redux';

import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import { signInServiceEnabled } from '../selectors';

const breadcrumbList = [
  {
    href: '/',
    label: 'VA.gov Home',
  },
  {
    href: '/my-health',
    label: 'Health care',
  },
  {
    href: manifest.rootUrl,
    label: manifest.appName,
  },
];

const serviceRequired = [
  // backendServices.FACILITIES,
  backendServices.FORM_PREFILL,
  // backendServices.IDENTITY_PROOFED,
  backendServices.SAVE_IN_PROGRESS,
  backendServices.USER_PROFILE,
];

const App = ({ location, children }) => {
  const { user } = useSelector(state => state);
  const useSiS = useSelector(signInServiceEnabled);

  return (
    <RequiredLoginView
      useSiS={useSiS}
      user={user}
      serviceRequired={serviceRequired}
    >
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        <VaBreadcrumbs breadcrumbList={breadcrumbList} />
        {children}
      </RoutedSavableApp>
    </RequiredLoginView>
  );
};

export default App;
