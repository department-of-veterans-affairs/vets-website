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
