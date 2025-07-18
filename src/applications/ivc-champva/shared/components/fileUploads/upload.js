import environment from 'platform/utilities/environment';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import { focusElement } from 'platform/utilities/ui';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import { fileTypes } from './attachments';

// Modified version of the file upload from applications/appeals/995

const uploadUrl = `${
  environment.API_URL
}/ivc_champva/v1/forms/submit_supporting_documents`;

export function createPayload(
  file,
  _formId,
  password,
  attachmentId = undefined,
) {
  const payload = new FormData();
  payload.append('file', file);
  payload.append('form_id', _formId);
  // For hard-coded attachment IDs (needed for LLM validation)
  if (attachmentId) payload.append('attachment_id', attachmentId);
  // password for encrypted PDFs
  if (password) payload.append('password', password);

  return payload;
}

/**
 * This function handles setting focus after uploading a file.
 * It sets focus to the first <select> element in the host.
 * If no <select> is found it attempts to set focus to the delete button
 * and falls back to the upload button if no delete button is found.
 * @param {Object} host DOM node we want to look inside
 * @returns last <select> element found in host or undefined
 */
export function findAndFocusLastSelect(host) {
  if (host === undefined) return undefined;
  const lastSelect = [...host?.querySelectorAll('va-select')].slice(-1);
  if (lastSelect.length) {
    focusElement(lastSelect[0]);
  } else {
    // focus on delete button with upload button as a fallback
    const delBtn = host?.querySelector('.delete-upload');
    if (delBtn) {
      const delBtnShadow = delBtn?.shadowRoot?.querySelector('button');
      focusElement(delBtnShadow);
    } else {
      focusElement(
        // including `#upload-button` because RTL can't access the shadowRoot
        'button, #upload-button',
        {},
        host.querySelector(`#upload-button`)?.shadowRoot,
      );
    }
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
    createPayload: (file, _formId, password) =>
      createPayload(file, _formId, password, content.attachmentId),
    parseResponse: (response, file) => {
      setTimeout(() => {
        // Get the host element that contains our upload/delete buttons.
        // This is so we can improve the focus behavior after upload.
        let host = Array.from(
          document.querySelectorAll('.schemaform-file-list li'),
        );
        // From the list, select the one that holds a file with the same name
        // as the one just uploaded. Take the last match.
        host = host.filter(el => el.innerText?.includes(file.name));
        findAndFocusLastSelect(host?.pop());
      }, 500);
      return {
        name: file.name,
        confirmationCode: response.data.attributes.confirmationCode,
        attachmentId: content.attachmentId ?? '',
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
    // attachmentName: false,
    attachmentName: content?.attachmentName
      ? {
          'ui:title': 'Document name',
        }
      : false,
    //   ? {
    //       'ui:title': 'Document name',
    //     }
    //   : false,
    uswds: true,
  });
};

export const singleFileSchema = {
  type: 'array',
  maxItems: 1,
  items: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
    },
  },
};
