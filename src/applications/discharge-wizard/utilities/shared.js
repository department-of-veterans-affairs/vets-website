import { ROUTES } from '../constants';

export const printErrorMessage = message =>
  // eslint-disable-next-line no-console
  console.error(message);

export const pushToRoute = (shortName, router) => {
  const newRoute = ROUTES?.[shortName];
  if (newRoute) {
    router.push(newRoute);
  } else {
    printErrorMessage('Unable to determine page to display');
  }
};
