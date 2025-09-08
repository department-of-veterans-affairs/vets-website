import React from 'react';
import PropTypes from 'prop-types';
import { useMyHealthAccessGuard } from '~/platform/mhv/hooks/useMyHealthAccessGuard';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import MhvServiceRequiredGuard from 'platform/mhv/components/MhvServiceRequiredGuard';

const AppProviders = ({ user, children }) => {
  useMyHealthAccessGuard();

  return (
    <RequiredLoginView user={user} serviceRequired={[backendServices.RX]}>
      <MhvServiceRequiredGuard
        user={user}
        serviceRequired={[backendServices.RX]}
      >
        {children}
      </MhvServiceRequiredGuard>
    </RequiredLoginView>
  );
};

AppProviders.propTypes = {
  children: PropTypes.node,
  user: PropTypes.object,
};

export default AppProviders;
