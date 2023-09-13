import { ROUTES } from '../constants';

export const redirectIfFormIncomplete = (
  dependentsInput,
  pastMode,
  router,
  yearInput,
  zipCodeInput,
) => {
  let shouldRedirect = !dependentsInput || !zipCodeInput;

  if (pastMode) {
    shouldRedirect = !dependentsInput || !yearInput || !zipCodeInput;
  }

  if (shouldRedirect) {
    router.push(ROUTES.HOME);
  }
};

// Income limits are always based on the previous year's data
// This gets the previous year from either the current year or from the
// veteran-selected year
export const getPreviousYear = (pastMode, year) => {
  return pastMode && year ? year - 1 : new Date().getFullYear() - 1;
};
