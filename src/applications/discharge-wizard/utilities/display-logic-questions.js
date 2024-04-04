import { ROUTES } from '../constants';
import { SHORT_NAME_MAP, RESPONSES } from '../constants/question-data-map';

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
        nextRoute = SHORT_NAME_MAP.REASON;
      }
      break;
    case SHORT_NAME_MAP.DISCHARGE_MONTH:
      nextRoute = SHORT_NAME_MAP.REASON;
      break;
    case SHORT_NAME_MAP.REASON:
      if (answer === RESPONSES.REASON_3) {
        nextRoute = SHORT_NAME_MAP.DISCHARGE_TYPE;
      } else if (answer === RESPONSES.REASON_8) {
        nextRoute = SHORT_NAME_MAP.PREVIOUS_APPLICATION_TYPE;
      } else if (answer === RESPONSES.REASON_5)
        nextRoute = SHORT_NAME_MAP.COURT_MARTIAL;
      else {
        nextRoute = SHORT_NAME_MAP.INTENTION;
      }
      break;
    case SHORT_NAME_MAP.DISCHARGE_TYPE:
      nextRoute = SHORT_NAME_MAP.INTENTION;
      break;
    case SHORT_NAME_MAP.INTENTION:
      nextRoute = SHORT_NAME_MAP.COURT_MARTIAL;
      break;
    case SHORT_NAME_MAP.COURT_MARTIAL:
      nextRoute = SHORT_NAME_MAP.PREVIOUS_APPLICATION_TYPE;
      break;
    default:
      return ROUTES.RESULTS;
  }
  return nextRoute;
};
