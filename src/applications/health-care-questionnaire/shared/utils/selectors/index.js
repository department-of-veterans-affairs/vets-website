import { getStatus, getStartTime } from './appointment.selectors';
import { getStatus as getQRStatus } from './questionnaire.response.selectors';
import { getType } from './location.selector';

const appointment = {
  getStatus,
  getStartTime,
};

const questionnaireResponse = {
  getStatus: getQRStatus,
};

const location = {
  getType,
};

export { appointment, questionnaireResponse, location };
