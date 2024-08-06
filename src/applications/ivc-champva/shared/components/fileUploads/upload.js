import environment from 'platform/utilities/environment';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import { focusElement } from 'platform/utilities/ui';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import { fileTypes, maxSize, minSize } from './attachments';

// Modified version of the file upload from applications/appeals/995

const uploadUrl = `${
  environment.API_URL
}/ivc_champva/v1/forms/submit_supporting_documents`;

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

export function findAndFocusLastSelect() {
  const lastSelect = [...document.querySelectorAll('select')].slice(-1);
  if (lastSelect.length) {
    focusElement(lastSelect[0]);
  }
  return lastSelect;
}

export const fileUploadUi = content => {
  // a11y focus management. Move focus to select after upload
  // see va.gov-team/issues/19688
  const addAnotherLabel = 'Upload another file';

  return fileUploadUI(content.label, {
    itemDescription: content.description,
    hideLabelText: !content.label,
    fileUploadUrl: uploadUrl,
    addAnotherLabel,
    buttonText: content.buttonText || 'Upload file',
    fileTypes,
    maxSize,
    minSize,
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
      'ui:options': {
        // (The following comes from this implementation in applications/appeals/995):
        // TO DO: not implemented - see vets-design-system-documentation #2587;
        // Need to get file name from within element with ID of fileId
        // 'message-aria-describedby': // ???
      },
    }),
    // hideOnReview: true,
    attachmentName: false,
    // attachmentName: content?.attachmentName
    //   ? {
    //       'ui:title': 'Document name',
    //     }
    //   : false,
    uswds: true,
  });
};
