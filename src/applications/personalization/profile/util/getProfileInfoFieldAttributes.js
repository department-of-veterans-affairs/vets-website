import { API_ROUTES, FIELD_TITLES, FIELD_NAMES } from '@@vap-svc/constants';

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
  getFormSchema as addressFormSchema,
  getUiSchema as addressUiSchema,
} from '@@vap-svc/components/AddressField/address-schemas';

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
    apiRoute = '/'; // TODO: DUMMY API ROUTE
    convertCleanDataToPayload = payload => {
      // console.log(payload);
      // TODO: this function will need to be changed so it can be used for the Data transformation for the API call. See https://github.com/department-of-veterans-affairs/vets-website/blob/Profile-31685-newpersonalinfosection/src/applications/personalization/profile/components/ProfileInformationEditView.jsx#L180
      return payload;
    };
    uiSchema = personalInformationUiSchemas[fieldName];
    formSchema = personalInformationFormSchemas[fieldName];

    // console.log(fieldName, ' uiSchema => ', uiSchema);
    // console.log(fieldName, ' formSchema => ', formSchema);
    if (fieldName === FIELD_NAMES.PREFERRED_NAME) {
      title = FIELD_TITLES[FIELD_NAMES.PREFERRED_NAME];
    }
    if (fieldName === FIELD_NAMES.PRONOUNS) {
      title = FIELD_TITLES[FIELD_NAMES.PRONOUNS];
    }
    if (fieldName === FIELD_NAMES.GENDER_IDENTITY) {
      title = FIELD_TITLES[FIELD_NAMES.GENDER_IDENTITY];
    }
    if (fieldName === FIELD_NAMES.SEXUAL_ORIENTATION) {
      title = FIELD_TITLES[FIELD_NAMES.SEXUAL_ORIENTATION];
    }
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
