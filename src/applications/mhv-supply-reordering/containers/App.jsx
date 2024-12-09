import React from 'react';
import { useSelector } from 'react-redux';

import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import formConfig from '../config/form';
import { signInServiceEnabled } from '../selectors';

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
        {children}
      </RoutedSavableApp>
    </RequiredLoginView>
  );
};

export default App;
