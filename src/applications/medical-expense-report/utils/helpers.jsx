import { isAfter, isEqual } from 'date-fns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

export const isSameOrAfter = (date1, date2) => {
  return isAfter(date1, date2) || isEqual(date1, date2);
};

export const isProductionEnv = () => {
  return (
    !environment.BASE_URL.includes('localhost') &&
    !window.DD_RUM?.getInitConfiguration() &&
    !window.Mocha
  );
};

// TODO: Replace with flippers as needed.
export const showMultiplePageResponse = () =>
  window.sessionStorage.getItem('showMultiplePageResponse') === 'true';

// export const showIncomeAndAssetsClarification = () =>
//   window.sessionStorage.getItem('showIncomeAndAssetsClarification') === 'true';

// export const showMedicalEvidenceClarification = () =>
//   window.sessionStorage.getItem('showPensionEvidenceClarification') === 'true';
