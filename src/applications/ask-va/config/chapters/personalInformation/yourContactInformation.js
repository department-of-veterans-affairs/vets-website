// import emailUI from '@department-of-veterans-affairs/platform-forms-system/email';
// import phoneUI from '@department-of-veterans-affairs/platform-forms-system/phone';
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

const yourContactInformationPage = {
  uiSchema: {
    'ui:description': PrefillAlertAndTitle,
    phoneNumber: phoneUI(),
    emailAddress: emailUI(),
    contactPreference: radioUI({
      title: CHAPTER_3.CONTACT_PREF.QUESTION_1,
      description: '',
      labels: contactOptions,
    }),
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
