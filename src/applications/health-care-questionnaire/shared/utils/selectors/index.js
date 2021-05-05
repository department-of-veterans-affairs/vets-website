import {
  getStatus,
  getStartDateTime,
  getBookingNote,
  getStartTimeInTimeZone,
} from './appointment.selectors';
import {
  getStatus as getQRStatus,
  getQuestionnaireResponse,
} from './questionnaire.response.selectors';
import { getType, getName, getPhoneNumber } from './location.selector';
import {
  getId,
  getName as getOrgName,
  getPhoneNumber as getOrgPhone,
  getFacilityIdentifier,
} from './organization.selector';

const appointment = {
  getStatus,
  getStartDateTime,
  getBookingNote,
  getStartTimeInTimeZone,
};

const questionnaireResponse = {
  getStatus: getQRStatus,
  getQuestionnaireResponse,
};

const location = {
  getType,
  getName,
  getPhoneNumber,
};

const organization = {
  getName: getOrgName,
  getPhoneNumber: getOrgPhone,
  getId,
  getFacilityIdentifier,
};

export {
  appointment as appointmentSelector,
  questionnaireResponse as questionnaireResponseSelector,
  location as locationSelector,
  organization as organizationSelector,
};
