import environment from 'platform/utilities/environment';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import { scrollAndFocus } from 'platform/utilities/scroll';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

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
  const findAndFocusLastCard = name => {
    const target = $$('.schemaform-file-list li').find(entry =>
      $('strong', entry)
        .textContent?.trim()
        .includes(name),
    );
    scrollAndFocus(target);
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
    parseResponse: (response, { name, size }) => {
      setTimeout(() => {
        findAndFocusLastCard(name);
      });
      return {
        name,
        size,
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
