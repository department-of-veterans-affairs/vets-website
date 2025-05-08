import {
  textareaUI,
  textareaSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import {
  additionalInformationPageTitle,
  additionalInformationPageQuestion,
} from '../../content/form0781/additionalInformationPage';
import {
  titleWithTag,
  form0781HeadingTag,
  mentalHealthSupportAlert,
} from '../../content/form0781';

export const uiSchema = {
  'ui:title': titleWithTag(additionalInformationPageTitle, form0781HeadingTag),
  additionalInformation: textareaUI({
    title: additionalInformationPageQuestion,
  }),
  'view:mentalHealthSupportAlert': {
    'ui:description': mentalHealthSupportAlert,
  },
};

export const schema = {
  type: 'object',
  properties: {
    additionalInformation: textareaSchema,
    'view:mentalHealthSupportAlert': {
      type: 'object',
      properties: {},
    },
  },
};
