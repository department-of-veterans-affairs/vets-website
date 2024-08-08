import { useSelector } from 'react-redux';
import { isVAPatient } from '~/platform/user/selectors';

/**
 * Route guard hook that will redirect the user to the /my-health landing page if isVAPatient is false.
 */

export const useMyHealthAccessGuard = () => {
  const isVAPatientUser = useSelector(isVAPatient);

  if (!isVAPatientUser) {
    return window.location.replace('/my-health');
  }

  return null;
};
