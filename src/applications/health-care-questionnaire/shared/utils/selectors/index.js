import { getStatus, getStartTime } from './appointment.selectors';
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

export { appointment, questionnaireResponse, location, organization };
