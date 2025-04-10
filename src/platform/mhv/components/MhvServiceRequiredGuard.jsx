import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const MhvServiceRequiredGuard = ({ children, serviceRequired, user }) => {
  const userServices = user.profile.services; // mhv_messaging_policy.rb defines if messaging service is avaialble when a user is in Premium status upon structuring user services from the user profile in services.rb

  const hasRequiredService = serviceRequired.some(service =>
    userServices.includes(service),
  );
  const [authorized, setAuthorized] = useState(false);

  useEffect(
    () => {
      if (!user.profile.verified || !hasRequiredService) {
        window.location.replace('/my-health');
      } else {
        setAuthorized(true);
      }
    },
    [hasRequiredService, user, userServices],
  );

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
