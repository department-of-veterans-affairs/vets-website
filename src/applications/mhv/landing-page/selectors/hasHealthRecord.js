import { selectPatientFacilities } from '~/platform/user/cerner-dsot/selectors';

export const hasHealthRecord = state => {
  const facilities = selectPatientFacilities(state) || [];
  return facilities.length > 0;
};
