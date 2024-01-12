import { API_ROUTES, FIELD_TITLES, FIELD_NAMES } from '../constants';

import {
  getFormSchema as addressFormSchema,
  getUiSchema as addressUiSchema,
} from '../components/AddressField/address-schemas';
import {
  emailConvertCleanDataToPayload,
  emailUiSchema,
  emailFormSchema,
} from './contact-information/emailUtils';
import {
  phoneConvertCleanDataToPayload,
  phoneUiSchema,
  phoneFormSchema,
} from './contact-information/phoneUtils';
import { addressConvertCleanDataToPayload } from './contact-information/addressUtils';

import {
  personalInformationFormSchemas,
  personalInformationUiSchemas,
} from './personal-information/personalInformationUtils';

export const phoneNumbers = [
  FIELD_NAMES.HOME_PHONE,
  FIELD_NAMES.WORK_PHONE,
  FIELD_NAMES.MOBILE_PHONE,
  FIELD_NAMES.FAX_NUMBER,
];

export const addresses = [
  FIELD_NAMES.MAILING_ADDRESS,
  FIELD_NAMES.RESIDENTIAL_ADDRESS,
];

export const personalInformation = [
  FIELD_NAMES.PREFERRED_NAME,
  FIELD_NAMES.PRONOUNS,
  FIELD_NAMES.GENDER_IDENTITY,
  FIELD_NAMES.SEXUAL_ORIENTATION,
];

export const getProfileInfoFieldAttributes = fieldName => {
  let apiRoute;
  let convertCleanDataToPayload;
  let title;
  let uiSchema;
  let formSchema;

  if (fieldName === FIELD_NAMES.EMAIL) {
    title = FIELD_TITLES[FIELD_NAMES.EMAIL];
    apiRoute = API_ROUTES.EMAILS;
    convertCleanDataToPayload = emailConvertCleanDataToPayload;
    uiSchema = emailUiSchema;
    formSchema = emailFormSchema;
  }

  if (phoneNumbers.includes(fieldName)) {
    apiRoute = API_ROUTES.TELEPHONES;
    convertCleanDataToPayload = phoneConvertCleanDataToPayload;
    uiSchema = phoneUiSchema(FIELD_TITLES[fieldName]);
    formSchema = phoneFormSchema;

    if (fieldName === FIELD_NAMES.HOME_PHONE) {
      title = FIELD_TITLES[FIELD_NAMES.HOME_PHONE];
    }

    if (fieldName === FIELD_NAMES.WORK_PHONE) {
      title = FIELD_TITLES[FIELD_NAMES.WORK_PHONE];
    }

    if (fieldName === FIELD_NAMES.MOBILE_PHONE) {
      title = FIELD_TITLES[FIELD_NAMES.MOBILE_PHONE];
    }

    if (fieldName === FIELD_NAMES.FAX_NUMBER) {
      title = FIELD_TITLES[FIELD_NAMES.FAX_NUMBER];
    }
  }

  if (addresses.includes(fieldName)) {
    apiRoute = API_ROUTES.ADDRESSES;
    convertCleanDataToPayload = addressConvertCleanDataToPayload;
    uiSchema = addressUiSchema();
    formSchema = addressFormSchema();

    if (fieldName === FIELD_NAMES.MAILING_ADDRESS) {
      title = FIELD_TITLES[FIELD_NAMES.MAILING_ADDRESS];
    }

    if (fieldName === FIELD_NAMES.RESIDENTIAL_ADDRESS) {
      title = FIELD_TITLES[FIELD_NAMES.RESIDENTIAL_ADDRESS];
    }
  }

  if (personalInformation.includes(fieldName)) {
    // dont manipulate the payload by default and rely on the
    // conversion to happen within the switch statement below
    // for each fields specific data transformation needs
    convertCleanDataToPayload = payload => {
      return payload;
    };

    // TODO: update convertCleanDataToPayload when other field api endpoints are ready
    switch (fieldName) {
      case FIELD_NAMES.PREFERRED_NAME:
        apiRoute = API_ROUTES.PREFERRED_NAME;
        title = FIELD_TITLES[FIELD_NAMES.PREFERRED_NAME];
        convertCleanDataToPayload = payload => {
          return {
            text: payload?.[FIELD_NAMES.PREFERRED_NAME],
          };
        };
        break;

      case FIELD_NAMES.GENDER_IDENTITY:
        apiRoute = API_ROUTES.GENDER_IDENTITY;
        title = FIELD_TITLES[FIELD_NAMES.GENDER_IDENTITY];
        convertCleanDataToPayload = payload => {
          return {
            code: payload?.[FIELD_NAMES.GENDER_IDENTITY],
          };
        };
        break;

      case FIELD_NAMES.SEXUAL_ORIENTATION:
        // TODO: update when api route is avail
        apiRoute = '/';
        title = FIELD_TITLES[FIELD_NAMES.SEXUAL_ORIENTATION];
        break;

      case FIELD_NAMES.PRONOUNS:
        // TODO: update when api route is avail
        apiRoute = '/';
        title = FIELD_TITLES[FIELD_NAMES.PRONOUNS];
        break;

      default:
        apiRoute = '/';
        title = 'Title Not Set';
        break;
    }

    uiSchema = personalInformationUiSchemas[fieldName];
    formSchema = personalInformationFormSchemas[fieldName];
  }

  return {
    apiRoute,
    convertCleanDataToPayload,
    title,
    uiSchema,
    formSchema,
  };
};

export default getProfileInfoFieldAttributes;
