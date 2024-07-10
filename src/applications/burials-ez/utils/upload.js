import environment from 'platform/utilities/environment';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import { focusElement } from 'platform/utilities/ui';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';

// Modified version of the file upload from applications/appeals/995

const uploadUrl = `${environment.API_URL}/v0/claim_attachments`;

function createPayload(file, _formId, password) {
  const payload = new FormData();
  payload.append('file', file);
  payload.append('form_id', _formId);
  // password for encrypted PDFs
  if (password) {
    payload.append('password', password);
  }

  return payload;
}

export const burialUploadUI = content => {
  const findAndFocusLastSelect = () => {
    const lastSelect = [...document.querySelectorAll('select')].slice(-1);
    if (lastSelect.length) {
      focusElement(lastSelect[0]);
    }
  };

  const addAnotherLabel = 'Upload another file';

  return fileUploadUI(content, {
    // title: content.label,
    // itemDescription: content.description,
    fileUploadUrl: uploadUrl,
    addAnotherLabel,
    buttonText: content.buttonText || 'Upload file',
    fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
    maxSize: 20971520,
    minSize: 1024,
    confirmRemove: true,
    classNames: 'vads-u-font-size--md',
    createPayload,
    parseResponse: (response, file) => {
      setTimeout(() => {
        findAndFocusLastSelect();
      });
      return {
        name: file.name,
        confirmationCode: response.data.attributes.confirmationCode,
        attachmentId: '',
      };
    },
    attachmentSchema: (/* { fileId, index } */) => ({
      'ui:title': 'Document type',
      'ui:disabled': false,
      'ui:webComponentField': VaSelectField,
    }),
    uswds: true,
  });
};
