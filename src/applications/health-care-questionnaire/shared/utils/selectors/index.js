import {
  getStatus,
  getStartTime,
  getBookingNote,
} from './appointment.selectors';
import { getStatus as getQRStatus } from './questionnaire.response.selectors';
import { getType, getName, getPhoneNumber } from './location.selector';
import {
  getId,
  getName as getOrgName,
  getPhoneNumber as getOrgPhone,
  getFacilityIdentifier,
} from './organization.selector';

const appointment = {
  getStatus,
  getStartTime,
  getBookingNote,
};

const questionnaireResponse = {
  getStatus: getQRStatus,
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
