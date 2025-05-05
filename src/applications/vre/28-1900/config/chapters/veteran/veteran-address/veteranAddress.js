import fullSchema from 'vets-json-schema/dist/28-1900_V2-schema.json';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import get from 'platform/utilities/data/get';
import addressUiSchema, {
  COUNTRY_NAMES,
  STATE_NAMES,
  STATE_VALUES,
  MILITARY_STATE_NAMES,
  MILITARY_STATE_VALUES,
} from 'platform/forms-system/src/js/definitions/profileAddress';

import { VeteranAddressDescription } from '../../../../components/VeteranAddressDescription';

const { veteranAddress, mainPhone, cellPhone, email } = fullSchema.properties;

const checkboxTitle =
  'I live on a United States military base outside of the U.S.';

export const schema = {
  type: 'object',
  properties: {
    'view:addressDescription': {
      type: 'object',
      properties: {},
    },
    veteranAddress,
    mainPhone,
    cellPhone,
    email,
    'view:confirmEmail': {
      type: 'string',
    },
  },
  required: ['email'],
};
const veteranAddressUiSchema = addressUiSchema(
  'veteranAddress',
  checkboxTitle,
  () => true,
);

veteranAddressUiSchema.country['ui:options'].updateSchema = (
  _,
  _schema,
  uiSchema,
  __,
) => {
  const countryUI = uiSchema;
  countryUI['ui:disabled'] = false;
  return {
    type: 'string',
    enum: COUNTRY_NAMES,
    enumNames: COUNTRY_NAMES,
  };
};

veteranAddressUiSchema.state['ui:options'].replaceSchema = (
  formData,
  _schema,
  _,
  index,
) => {
  const insertArrayIndex = (key, idx) => key.replace('[INDEX]', `[${idx}]`);
  const getPath = (pathToData, idx) =>
    typeof idx === 'number' ? insertArrayIndex(pathToData, idx) : pathToData;

  const formDataPath = getPath('veteranAddress', index);
  const data = get(formDataPath, formData) ?? {};
  const { country } = data;
  const { isMilitary } = data;
  if (isMilitary) {
    return {
      type: 'string',
      title: 'State',
      enum: MILITARY_STATE_VALUES,
      enumNames: MILITARY_STATE_NAMES,
    };
  }
  if (!isMilitary && country === 'United States') {
    return {
      type: 'string',
      title: 'State',
      enum: STATE_VALUES,
      enumNames: STATE_NAMES,
    };
  }
  return {
    type: 'string',
    title: 'State/Province/Region',
  };
};

export const uiSchema = {
  'view:addressDescription': {
    'ui:description': VeteranAddressDescription,
  },
  veteranAddress: veteranAddressUiSchema,
  mainPhone: {
    'ui:required': () => true,
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
    'ui:title': 'Main phone number',
    'ui:errorMessages': {
      pattern: 'Enter only numbers, no dashes or parentheses',
    },
  },
  cellPhone: {
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
      hideEmptyValueInReview: true,
    },
    'ui:title': 'Cell phone number',
    'ui:errorMessages': {
      pattern: 'Enter only numbers, no dashes or parentheses',
    },
  },
  email: emailUI(),
  'view:confirmEmail': {
    ...emailUI(),
    'ui:title': 'Confirm email address',
    'ui:required': () => true,
    'ui:validations': [
      {
        validator: (errors, fieldData, formData) => {
          if (
            formData.email.toLowerCase() !==
            formData['view:confirmEmail'].toLowerCase()
          ) {
            errors.addError(
              'This email does not match your previously entered email',
            );
          }
        },
      },
    ],
  },
};
