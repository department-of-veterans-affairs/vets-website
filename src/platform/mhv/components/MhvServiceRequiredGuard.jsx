import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const MhvServiceRequiredGuard = ({ children, serviceRequired, user }) => {
  const userServices = user.profile.services; // mhv_messaging_policy.rb defines if messaging service is avaialble when a user is in Premium status upon structuring user services from the user profile in services.rb

  const [hasRequiredService, setHasRequiredService] = useState(null);
  const [isVerified, setIsVerified] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(
    () => {
      setHasRequiredService(
        serviceRequired.some(service => userServices.includes(service)),
      );
      setIsVerified(user.profile.verified);
    },
    [serviceRequired, userServices, user.profile.verified],
  );

  useEffect(
    () => {
      if (isVerified !== null && hasRequiredService !== null) {
        if (!isVerified || !hasRequiredService) {
          window.location.replace('/my-health');
        } else {
          setAuthorized(true);
        }
      }
    },
    [isVerified, hasRequiredService],
  );

  if (isVerified === null || hasRequiredService === null) {
    return null; // Do not render children or redirect until values are fetched
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
};

MhvServiceRequiredGuard.propTypes = {
  children: PropTypes.node,
  serviceRequired: PropTypes.array,
  user: PropTypes.object,
};

export default MhvServiceRequiredGuard;
