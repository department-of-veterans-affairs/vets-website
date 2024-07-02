import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import PrefillAlertAndTitle from '../../../components/PrefillAlertAndTitle';
import { CHAPTER_3, contactOptions } from '../../../constants';
import { getContactMethods, isEqualToOnlyEmail } from '../../helpers';

const yourContactInformationPage = {
  uiSchema: {
    'ui:description': PrefillAlertAndTitle,
    contactPreferredName: {
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
    phoneNumber: phoneUI(),
    emailAddress: emailUI(),
    contactPreference: radioUI({
      title: CHAPTER_3.CONTACT_PREF.QUESTION_2,
      description: '',
      labels: {
        PHONE: 'Phone call',
        EMAIL: 'Email',
        US_MAIL: 'U.S. mail',
      },
    }),
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        const updatedCategoryTopicContactPreferences = getContactMethods(
          formData.category,
          formData.topic,
        );
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
            contactPreferredName: { type: 'string' },
            phoneNumber: phoneSchema,
            emailAddress: emailSchema,
            contactPreference: radioSchema(
              Object.keys(updatedCategoryTopicContactPreferences),
            ),
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
      contactPreference: radioSchema(Object.keys(contactOptions)),
    },
  },
};

export default yourContactInformationPage;
