import { useSelector } from 'react-redux';
// import { isLOA3 } from '@department-of-veterans-affairs/platform-user/selectors';
import { selectProfile } from '~/platform/user/selectors';

export const hasFacilityData = state => {
  const facilities = selectProfile(state)?.facilities || [];
  return facilities.length > 0;
};

// if facility count is 0, null, or undefined, redirect to /my-health

export const useMyHealthAccessGuard = () => {
  const hasFacility = useSelector(hasFacilityData);

  if (!hasFacility) {
    return window.location.replace('/my-health');
  }

  return null;
};
// export const useMyHealthAccessGuard = () => {
//   const mhvAccountState = useSelector(
//     state => state?.user?.profile?.mhvAccountState,
//   );

//   if (mhvAccountState === 'NONE') {
//     return window.location.replace('/my-health');
//   }

//   return null;
// };

/**
 * Route guard hook that will redirect the user to the /my-health landing page if isLOA3 is false.
 */

// export const useMyHealthAccessGuard = () => {
//   const isLOA3User = useSelector(isLOA3);

//   if (!isLOA3User) {
//     return window.location.replace('/my-health');
//   }

//   return null;
// };
