import {
  textareaUI,
  textareaSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  additionalInformationPageTitle,
  additionalInformationPageQuestion,
} from '../../content/form0781/additionalInformationPage';
import { formTitle } from '../../utils';

export const uiSchema = {
  'ui:title': formTitle(additionalInformationPageTitle),
  additionalInformation: textareaUI({
    title: additionalInformationPageQuestion,
  }),
};

export const schema = {
  type: 'object',
  properties: {
    additionalInformation: textareaSchema,
  },
};
