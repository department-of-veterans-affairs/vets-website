// import { useSelector } from 'react-redux';
// import { isLOA3 } from '@department-of-veterans-affairs/platform-user/selectors';
import { selectProfile } from '~/platform/user/selectors';

export const hasHealthData = state => {
  const facilities = selectProfile(state)?.facilities || [];
  return facilities.length > 0;
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
