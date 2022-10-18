import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';

import {
  representativeFields,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE_BYTES,
} from '../../../definitions/constants';
import CheckUploadWarning from '../../../components/FormAlerts/CheckUploadWarning';
import { RepresentativeDocumentsDescription } from '../../../components/FormDescriptions';

const createPayload = (file, formId, password) => {
  const payload = new FormData();
  payload.append('attachment[file_data]', file);
  payload.append('form_id', formId);
  payload.append('name', file.name);

  // password for encrypted PDFs
  if (password) {
    payload.append('attachment[password]', password);
  }

  return payload;
};

const parseResponse = (fileInfo, file) => {
  recordEvent({
    'caregivers-poa-document-guid': fileInfo.data.attributes.guid,
    'caregivers-poa-document-confirmation-code': fileInfo.data.id,
  });

  return {
    guid: fileInfo.data.attributes.guid,
    confirmationCode: fileInfo.data.id,
    name: file.name,
  };
};

export default {
  uiSchema: {
    'ui:description': RepresentativeDocumentsDescription,
    'view:uploadSuccessAlert': {
      'ui:options': {
        hideIf: formData => {
          // return false to show, not hide
          return !(
            formData.signAsRepresentativeDocumentUpload &&
            formData.signAsRepresentativeDocumentUpload.length > 0 &&
            formData.signAsRepresentativeDocumentUpload[0].guid &&
            formData.signAsRepresentativeDocumentUpload[0].name &&
            !formData.signAsRepresentativeDocumentUpload[0].errorMessage
          );
        },
      },
      'ui:description': CheckUploadWarning,
    },
    [representativeFields.documentUpload]: fileUploadUI('Your document:', {
      buttonText: 'Upload document',
      classNames: 'poa-document-upload vads-u-margin-top--2',
      multiple: false,
      fileUploadUrl: `${environment.API_URL}/v0/form1010cg/attachments`,
      fileTypes: ALLOWED_FILE_TYPES,
      maxSize: MAX_FILE_SIZE_BYTES,
      hideLabelText: false,
      createPayload,
      parseResponse,
    }),
  },
  schema: {
    type: 'object',
    required: [representativeFields.documentUpload],
    properties: {
      'view:uploadSuccessAlert': {
        type: 'object',
        properties: {},
      },
      [representativeFields.documentUpload]: {
        type: 'array',
        minItems: 1,
        maxItems: 1,
        items: {
          type: 'object',
          required: ['guid', 'name'],
          properties: {
            guid: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};
