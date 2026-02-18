import { ROUTES, errorTextMap, labelTextMap } from '../constants';

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

export const determineErrorMessage = shortName => {
  return errorTextMap[shortName]
    ? errorTextMap[shortName]
    : 'Select a response.';
};

export const determineLabel = shortName => {
  return labelTextMap[shortName] ? labelTextMap[shortName] : '';
};

export const isValidYear = value => {
  return value <= new Date().getFullYear() && value?.match(/^(19|20)\d{2}$/);
};
