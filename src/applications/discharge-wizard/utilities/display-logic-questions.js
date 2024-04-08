import { ROUTES } from '../constants';
import { SHORT_NAME_MAP } from '../constants/question-data-map';

export const nextQuestionRoute = (currentQuestion, answer) => {
  let nextRoute;

  switch (currentQuestion) {
    case SHORT_NAME_MAP.SERVICE_BRANCH:
      nextRoute = SHORT_NAME_MAP.DISCHARGE_YEAR;
      break;
    case SHORT_NAME_MAP.DISCHARGE_YEAR:
      if (answer === `${new Date().getFullYear() - 15}`) {
        nextRoute = SHORT_NAME_MAP.DISCHARGE_MONTH;
      } else {
        nextRoute = SHORT_NAME_MAP.DISCHARGE_REASON;
      }
      break;
    case SHORT_NAME_MAP.DISCHARGE_MONTH:
      nextRoute = SHORT_NAME_MAP.DISCHARGE_REASON;
      break;
    default:
      return ROUTES.RESULTS;
  }
  return nextRoute;
};
