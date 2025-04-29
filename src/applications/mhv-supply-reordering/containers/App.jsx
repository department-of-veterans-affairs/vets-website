import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';
import MhvRegisteredUserGuard from 'platform/mhv/components/MhvRegisteredUserGuard';
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
  const showMhvSecondaryNav =
    location.pathname.includes('/introduction') ||
    location.pathname.includes('/confirmation');

  return (
    <RequiredLoginView
      useSiS={useSiS}
      user={user}
      serviceRequired={serviceRequired}
    >
      <MhvRegisteredUserGuard>
        <>
          {showMhvSecondaryNav && <MhvSecondaryNav />}
          <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
            {children}
          </RoutedSavableApp>
        </>
      </MhvRegisteredUserGuard>
    </RequiredLoginView>
  );
};

App.propTypes = {
  location: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default App;
