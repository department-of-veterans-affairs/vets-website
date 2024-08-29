import { mapValues } from 'lodash';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import React from 'react';
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

const pronounInfo = (
  <>
    <h4 className="vads-u-font-weight--bold">Pronouns</h4>
    <p className="vads-u-color--gray-medium light vads-u-margin-top--0 vads-u-margin-bottom--0 vads-u-font-weight--normal">
      Share this information if you’d like to help us understand the best way to
      address you.
    </p>
  </>
);

const yourContactInformationPage = {
  uiSchema: {
    'ui:description': PrefillAlertAndTitle,
    phoneNumber: phoneUI(),
    emailAddress: emailUI(),
    businessPhone: phoneUI('Phone number'),
    businessEmail: emailUI('Email address'),
    contactPreference: radioUI({
      title: CHAPTER_3.CONTACT_PREF.QUESTION_2,
      description: '',
      labels: {
        PHONE: 'Phone call',
        EMAIL: 'Email',
        US_MAIL: 'U.S. mail',
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
      'ui:title': pronounInfo,
      'ui:description': 'Select all of your pronouns',
      'ui:required': () => false,
      ...createUiTitlePropertiesFromOptions(pronounLabels),
      pronounsNotListedText: {
        'ui:title':
          "If your pronouns aren't listed, you can write them here (255 characters maximum)",
      },
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        const updatedCategoryTopicContactPreferences = getContactMethods(
          formData.category,
          formData.topic,
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
            pronouns: {
              type: 'object',
              properties: {
                ...createBooleanSchemaPropertiesFromOptions(pronounLabels),
                ...{ pronounsNotListedText: { type: 'string' } },
              },
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
      pronouns: {
        type: 'object',
        properties: {
          ...createBooleanSchemaPropertiesFromOptions(pronounLabels),
          ...{ pronounsNotListedText: { type: 'string' } },
        },
      },
    },
  },
};

export default yourContactInformationPage;
