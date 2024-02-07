import environment from 'platform/utilities/environment';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import { focusElement } from 'platform/utilities/ui';
import _ from 'platform/utilities/data';

import fullSchema from '../config/form-0995-schema.json';

import { EVIDENCE_UPLOAD_API } from '../constants';

import {
  MAX_FILE_SIZE_BYTES,
  SUPPORTED_UPLOAD_TYPES,
} from '../../shared/constants';
import { createPayload } from '../../shared/utils/upload';

export const fileUploadUi = content => {
  // a11y focus management. Move focus to select after upload
  // see va.gov-team/issues/19688
  const findAndFocusLastSelect = () => {
    // focus on last document type select since all new uploads are appended
    const lastSelect = [...document.querySelectorAll('select')].slice(-1);
    if (lastSelect.length) {
      focusElement(lastSelect[0]);
    }
  };
  const addAnotherLabel = 'Upload another file';

  return fileUploadUI(content.label, {
    itemDescription: content.description,
    hideLabelText: !content.label,
    fileUploadUrl: `${environment.API_URL}${EVIDENCE_UPLOAD_API}`,
    addAnotherLabel,
    buttonText: 'Upload file',
    fileTypes: SUPPORTED_UPLOAD_TYPES,
    maxSize: MAX_FILE_SIZE_BYTES,
    minSize: 1024,
    createPayload,
    parseResponse: (response, file) => {
      setTimeout(() => {
        findAndFocusLastSelect();
      });
      return {
        name: file.name,
        confirmationCode: response.data.attributes.guid,
        attachmentId: '',
      };
    },
    attachmentSchema: ({ fileId }) => ({
      'ui:title': 'Document type',
      'ui:disabled': false,
      'ui:widget': 'select',
      'ui:options': {
        widgetProps: {
          'aria-describedby': fileId,
        },
      },
    }),
    hideOnReview: true,
    attachmentName: false,
  });
};

export const getAttachmentsSchema = defaultAttachmentId => {
  const { attachments } = fullSchema.properties;
  return _.set(
    'items.properties.attachmentId.default',
    defaultAttachmentId,
    attachments,
  );
};
