import {
  fileInputUI,
  fileInputSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  UPLOAD_GUIDELINES,
  ALERT_TOO_MANY_PAGES,
  ALERT_TOO_FEW_PAGES,
  ALERT_WRONG_FORM,
} from '../config/constants';
import { getFormContent, getPdfDownloadUrl, onCloseAlert } from '../helpers';

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
        fileUploadUrl: `${
          environment.API_URL
        }/simple_forms_api/v1/scanned_form_upload`,
        title,
        formNumber,
        required: () => true,
      }),
    },
    'view:alertTooManyPages': {
      'ui:description': ALERT_TOO_MANY_PAGES(
        formNumber,
        getPdfDownloadUrl(formNumber),
        onCloseAlert,
      ),
      'ui:options': {
        hideIf: formData =>
          !formData.uploadedFile?.warnings?.includes('too_many_pages'),
      },
    },
    'view:alertTooFewPages': {
      'ui:description': ALERT_TOO_FEW_PAGES(
        formNumber,
        getPdfDownloadUrl(formNumber),
        onCloseAlert,
      ),
      'ui:options': {
        hideIf: formData =>
          !formData.uploadedFile?.warnings?.includes('too_few_pages'),
      },
    },
    'view:alertWrongForm': {
      'ui:description': ALERT_WRONG_FORM(
        formNumber,
        getPdfDownloadUrl(formNumber),
        onCloseAlert,
      ),
      'ui:options': {
        hideIf: formData =>
          !formData.uploadedFile?.warnings?.includes('wrong_form'),
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
      'view:alertWrongForm': {
        type: 'object',
        properties: {},
      },
    },
    required: ['uploadedFile'],
  },
};
