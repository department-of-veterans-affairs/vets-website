import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isLOA3, isVAPatient } from '~/platform/user/selectors';

const MhvRegisteredUserGuard = ({ children }) => {
  const userVerified = useSelector(isLOA3);
  const vaPatient = useSelector(isVAPatient);
  const userRegistered = userVerified && vaPatient;

  useEffect(() => {
    if (!userRegistered) {
      window.location.replace('/my-health');
    }
  }, [userRegistered]);

  return <>{children}</>;
};

MhvRegisteredUserGuard.propTypes = {
  children: PropTypes.node,
};

export default MhvRegisteredUserGuard;
