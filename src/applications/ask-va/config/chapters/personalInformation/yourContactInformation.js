import { mapValues } from 'lodash';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
  internationalPhoneDeprecatedUI,
  internationalPhoneDeprecatedSchema,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import PrefillAlertAndTitle from '../../../components/PrefillAlertAndTitle';
import { CHAPTER_3, contactOptions } from '../../../constants';
import { getContactMethods, isEqualToOnlyEmail } from '../../helpers';

export const createBooleanSchemaPropertiesFromOptions = obj =>
  mapValues(obj, () => {
    return { type: 'boolean' };
  });

export const createUiTitlePropertiesFromOptions = obj => {
  return Object.entries(obj).reduce((accumulator, [key, value]) => {
    accumulator[key] = { 'ui:title': value };
    return accumulator;
  }, {});
};

const yourContactInformationPage = {
  uiSchema: {
    'ui:description': PrefillAlertAndTitle,
    phoneNumber: phoneUI(),
    emailAddress: emailUI(),
    businessPhone: {
      ...internationalPhoneDeprecatedUI('Phone number'),
      'ui:errorMessages': {
        required:
          'Enter up to a 16-digit phone number (with or without dashes)',
        pattern:
          'Enter a valid phone number up to 16-digits (with or without dashes)',
      },
    },
    businessEmail: emailUI('Email address'),
    contactPreference: radioUI({
      title: CHAPTER_3.CONTACT_PREF.QUESTION_2.QUESTION,
      labels: {
        PHONE: 'Phone call',
        EMAIL: 'Email',
        US_MAIL: 'U.S. mail',
      },
      errorMessages: {
        required: CHAPTER_3.CONTACT_PREF.QUESTION_2.ERROR,
      },
    }),
    preferredName: {
      'ui:title': CHAPTER_3.CONTACT_PREF.QUESTION_1.QUESTION,
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        pattern: CHAPTER_3.CONTACT_PREF.QUESTION_1.ERROR,
      },
      'ui:options': {
        uswds: true,
        hint: CHAPTER_3.CONTACT_PREF.QUESTION_1.HINT,
      },
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        const updatedCategoryTopicContactPreferences = getContactMethods(
          formData.contactPreferences,
        );
        if (
          formData.relationshipToVeteran ===
            "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)" &&
          formData.contactPreferences?.length > 1
        ) {
          return {
            ...formSchema,
            required: ['businessPhone', 'businessEmail', 'contactPreference'],
            properties: {
              businessPhone: {
                ...internationalPhoneDeprecatedSchema,
                pattern: '^\\+?[0-9](?:-?[0-9]){0,15}$',
              },
              businessEmail: emailSchema,
              contactPreference: radioSchema(
                Object.values(updatedCategoryTopicContactPreferences),
              ),
              preferredName: {
                type: 'string',
                pattern: '^[^0-9]*$',
                minLength: 1,
                maxLength: 30,
              },
            },
          };
        }
        if (
          formData.relationshipToVeteran ===
          "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)"
        ) {
          return {
            ...formSchema,
            required: ['businessPhone', 'businessEmail'],
            properties: {
              businessPhone: {
                ...internationalPhoneDeprecatedSchema,
                pattern: '^\\+?[0-9](?:-?[0-9]){0,15}$',
              },
              businessEmail: emailSchema,
              preferredName: {
                type: 'string',
                pattern: '^[^0-9]*$',
                minLength: 1,
                maxLength: 30,
              },
            },
          };
        }
        if (isEqualToOnlyEmail(updatedCategoryTopicContactPreferences)) {
          return {
            ...formSchema,
            required: ['phoneNumber', 'emailAddress'],
            properties: {
              phoneNumber: phoneSchema,
              emailAddress: emailSchema,
              preferredName: {
                type: 'string',
                pattern: '^[^0-9]*$',
                minLength: 1,
                maxLength: 30,
              },
            },
          };
        }
        return {
          ...formSchema,
          properties: {
            phoneNumber: phoneSchema,
            emailAddress: emailSchema,
            contactPreference: radioSchema(
              Object.values(updatedCategoryTopicContactPreferences),
            ),
            preferredName: {
              type: 'string',
              pattern: '^[^0-9]*$',
              minLength: 1,
              maxLength: 30,
            },
          },
          required: ['phoneNumber', 'emailAddress', 'contactPreference'],
        };
      },
    },
  },
  schema: {
    type: 'object',
    required: ['phoneNumber', 'emailAddress', 'contactPreference'],
    properties: {
      phoneNumber: phoneSchema,
      emailAddress: emailSchema,
      businessPhone: phoneSchema,
      businessEmail: emailSchema,
      contactPreference: radioSchema(Object.values(contactOptions)),
      preferredName: {
        type: 'string',
        pattern: '^[^0-9]*$',
        minLength: 1,
        maxLength: 30,
      },
    },
  },
};

export default yourContactInformationPage;
