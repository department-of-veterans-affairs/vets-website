import { getStatus, getStartTime } from './appointment.selectors';
import { getStatus as getQRStatus } from './questionnaire.response.selectors';

const appointment = {
  getStatus,
  getStartTime,
};

const questionnaireResponse = {
  getStatus: getQRStatus,
};

export { appointment, questionnaireResponse };
