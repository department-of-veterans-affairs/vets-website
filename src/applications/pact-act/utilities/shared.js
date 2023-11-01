import { ROUTES } from '../constants';
import { SHORT_NAME_MAP } from '../constants/question-data-map';

/**
 * Filter object for a given value (predicate true/false function)
 */
Object.filter = (obj, predicate) =>
  Object.keys(obj)
    .filter(key => predicate(obj[key]))
    .reduce((res, key) => Object.assign(res, { [key]: obj[key] }), {});

export const printErrorMessage = message =>
  // eslint-disable-next-line no-console
  console.error(message);

/**
 * Move to given route or error if route not found
 * @param {number} shortName - question to route to
 */
export const pushToRoute = (shortName, router) => {
  const newRoute = ROUTES?.[shortName];

  if (newRoute) {
    router.push(newRoute);
  } else {
    printErrorMessage('Unable to determine page to display');
  }
};

/** ================================================================
 * Return SHORT_NAMEs with answers in the store
 *
 * @param {object} responsesToClean - all answers in the store
 */
export const getNonNullShortNamesFromStore = responsesToClean => {
  const nonNullResponses = Object.filter(
    responsesToClean,
    response => response !== null,
  );

  return Object.keys(nonNullResponses);
};

/**
 * Determine the last question answered before a results page
 * so the results page knows quickly where to go back to if "Back" is used
 */
export const getLastQuestionAnswered = formResponses => {
  const nonNullShortNames = getNonNullShortNamesFromStore(formResponses);

  return nonNullShortNames?.reverse()?.[0];
};

/**
 * Used for results screens
 * When the Back button is clicked, find the last question that was answered
 * in the flow based on service period response and direct user back there
 * @param {object} formResponses - all answers in the store
 */
export const onResultsBackClick = (formResponses, router) => {
  const previousQuestion = getLastQuestionAnswered(formResponses);

  if (previousQuestion) {
    return router.push(ROUTES?.[previousQuestion]);
  }

  printErrorMessage('Unable to find previous question from results page');
  return router.push(ROUTES.HOME);
};

/**
 * Get the SERVICE_PERIOD response from the formResponses
 *
 * @param {object} formResponses - all answers in the store
 */
export const getServicePeriodResponse = formResponses =>
  formResponses?.[SHORT_NAME_MAP.SERVICE_PERIOD];
