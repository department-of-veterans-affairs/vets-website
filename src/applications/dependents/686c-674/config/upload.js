import environment from 'platform/utilities/environment';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import { focusElement } from 'platform/utilities/ui';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';

// Modified version of the file upload from applications/appeals/995

export const uploadUrl = `${environment.API_URL}/v0/claim_attachments`;

export function createPayload(file, _formId, password) {
  const payload = new FormData();
  payload.append('file', file);
  payload.append('form_id', _formId);
  // password for encrypted PDFs
  if (password) {
    payload.append('password', password);
  }

  return payload;
}

export const dependentsUploadUI = (content, options = {}) => {
  const findAndFocusLastSelect = () => {
    const lastSelect = [...document.querySelectorAll('select')].slice(-1);
    if (lastSelect.length) {
      focusElement(lastSelect[0]);
    }
  };

  const addAnotherLabel = 'Upload another file';

  return fileUploadUI(content, {
    fileUploadUrl: uploadUrl,
    addAnotherLabel,
    buttonText: content.buttonText || 'Upload file',
    fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
    maxSize: 20971520,
    minSize: 1024,
    formNumber: '686C-674-V2',
    confirmRemove: true,
    classNames: 'vads-u-font-size--md',
    createPayload,
    parseResponse: (response, file) => {
      setTimeout(() => {
        findAndFocusLastSelect();
      });
      return {
        name: file?.name,
        confirmationCode: response?.data?.attributes?.confirmationCode,
        attachmentId: '',
      };
    },
    attachmentSchema: () => ({
      'ui:title': 'Document type',
      'ui:disabled': false,
      'ui:webComponentField': VaSelectField,
    }),
    ...options,
  });
};

export const dependentsUploadSchema = {
  type: 'array',
  minItems: 1,
  items: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      size: {
        type: 'integer',
      },
      confirmationCode: {
        type: 'string',
      },
    },
  },
};
