import {
  fileInputUI,
  fileInputSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import {
  UPLOAD_GUIDELINES,
  ALERT_TOO_MANY_PAGES,
  ALERT_TOO_FEW_PAGES,
} from '../config/constants';
import {
  getFormContent,
  hideAlertTooManyPages,
  hideAlertTooFewPages,
} from '../helpers';

const { formNumber, title } = getFormContent();

export const uploadPage = {
  uiSchema: {
    'view:uploadGuidelines': {
      'ui:description': UPLOAD_GUIDELINES,
    },
    uploadedFile: {
      ...fileInputUI({
        errorMessages: { required: `Upload a completed VA Form ${formNumber}` },
        name: 'form-upload-file-input',
        title,
        required: () => true,
      }),
    },
    'view:alertTooManyPages': {
      'ui:description': ALERT_TOO_MANY_PAGES(formNumber),
      'ui:options': {
        hideIf: formData => hideAlertTooManyPages(formData),
      },
    },
    'view:alertTooFewPages': {
      'ui:description': ALERT_TOO_FEW_PAGES(formNumber),
      'ui:options': {
        hideIf: formData => hideAlertTooFewPages(formData),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:uploadGuidelines': {
        type: 'object',
        properties: {},
      },
      uploadedFile: fileInputSchema,
      'view:alertTooManyPages': {
        type: 'object',
        properties: {},
      },
      'view:alertTooFewPages': {
        type: 'object',
        properties: {},
      },
    },
    required: ['uploadedFile'],
  },
};
