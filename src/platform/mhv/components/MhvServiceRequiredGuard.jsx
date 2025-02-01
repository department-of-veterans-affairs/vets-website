import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const MhvServiceRequiredGuard = ({ children, serviceRequired, user }) => {
  const userServices = user.profile.services; // mhv_messaging_policy.rb defines if messaging service is avaialble when a user is in Premium status upon structuring user services from the user profile in services.rb

  const hasRequiredService = serviceRequired.some(service =>
    userServices.includes(service),
  );

  useEffect(
    () => {
      if (!user.profile.verified || !hasRequiredService) {
        window.location.replace('/my-health');
      }
    },
    [hasRequiredService, user, userServices],
  );

  return <>{children}</>;
};

MhvServiceRequiredGuard.propTypes = {
  children: PropTypes.node,
  serviceRequired: PropTypes.array,
  user: PropTypes.object,
};

export default MhvServiceRequiredGuard;
