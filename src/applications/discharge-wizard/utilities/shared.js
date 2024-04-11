import { ROUTES, errorTextMap, labelTextMap } from '../constants';
import { SHORT_NAME_MAP, RESPONSES } from '../constants/question-data-map';

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
    : 'Select a response';
};

export const determineLabel = shortName => {
  return labelTextMap[shortName] ? labelTextMap[shortName] : '';
};

export const determineYearRoute = answer => {
  if (answer === `${new Date().getFullYear() - 15}`) {
    return SHORT_NAME_MAP.DISCHARGE_MONTH;
  }
  return SHORT_NAME_MAP.REASON;
};

export const determineReasonRoute = answer => {
  if (answer === RESPONSES.REASON_3) {
    return SHORT_NAME_MAP.DISCHARGE_TYPE;
  }
  if (answer === RESPONSES.REASON_8) {
    return SHORT_NAME_MAP.PREVIOUS_APPLICATION_TYPE;
  }
  if (answer === RESPONSES.REASON_5) return SHORT_NAME_MAP.COURT_MARTIAL;

  return SHORT_NAME_MAP.INTENTION;
};
