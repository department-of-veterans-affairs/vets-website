import { mapValues } from 'lodash';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  checkboxGroupSchema,
  checkboxGroupUI,
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import PrefillAlertAndTitle from '../../../components/PrefillAlertAndTitle';
import { CHAPTER_3, contactOptions, pronounLabels } from '../../../constants';
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
    businessPhone: phoneUI('Phone number'),
    businessEmail: emailUI('Email address'),
    contactPreference: radioUI({
      title: CHAPTER_3.CONTACT_PREF.QUESTION_2,
      labels: {
        PHONE: 'Phone call',
        EMAIL: 'Email',
        US_MAIL: 'U.S. mail',
      },
      errorMessages: {
        required: 'Please select your contact preference',
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
    pronouns: {
      ...checkboxGroupUI({
        title: 'Pronouns',
        hint:
          'Share this information if you’d like to help us understand the best way to address you.',
        required: false,
        description: 'Select all of your pronouns',
        labelHeaderLevel: '4',
        labels: pronounLabels,
      }),
    },
    pronounsNotListedText: {
      'ui:title':
        "If your pronouns aren't listed, you can write them here (255 characters maximum)",
      'ui:webComponentField': VaTextInputField,
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        const updatedCategoryTopicContactPreferences = getContactMethods(
          formData.selectCategory,
          formData.selectTopic,
        );
        if (
          formData.personalRelationship ===
            "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)" &&
          isEqualToOnlyEmail(updatedCategoryTopicContactPreferences)
        ) {
          return {
            ...formSchema,
            required: ['businessPhone', 'businessEmail'],
            properties: {
              businessPhone: phoneSchema,
              businessEmail: emailSchema,
              preferredName: {
                type: 'string',
                pattern: '^[A-Za-z]+$',
                minLength: 1,
                maxLength: 25,
              },
              pronouns: checkboxGroupSchema(Object.keys(pronounLabels)),
              pronounsNotListedText: {
                type: 'string',
                pattern: '^[A-Za-z]+$',
                minLength: 1,
                maxLength: 255,
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
                pattern: '^[A-Za-z]+$',
                minLength: 1,
                maxLength: 25,
              },
              pronouns: checkboxGroupSchema(Object.keys(pronounLabels)),
              pronounsNotListedText: {
                type: 'string',
                minLength: 1,
                maxLength: 255,
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
              pattern: '^[A-Za-z]+$',
              minLength: 1,
              maxLength: 25,
            },
            pronouns: checkboxGroupSchema(Object.keys(pronounLabels)),
            pronounsNotListedText: {
              type: 'string',
              pattern: '^[A-Za-z]+$',
              minLength: 1,
              maxLength: 255,
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
        pattern: '^[A-Za-z]+$',
        minLength: 1,
        maxLength: 25,
      },
      pronouns: checkboxGroupSchema(Object.values(pronounLabels)),
      pronounsNotListedText: {
        type: 'string',
        pattern: '^[A-Za-z]+$',
        minLength: 1,
        maxLength: 255,
      },
    },
  },
};

export default yourContactInformationPage;
