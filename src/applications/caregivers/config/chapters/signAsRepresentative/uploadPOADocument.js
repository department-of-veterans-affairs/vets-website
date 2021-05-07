import React from 'react';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import environment from 'platform/utilities/environment';
import { representativeFields } from 'applications/caregivers/definitions/constants';
import { RepresentativeDocumentUploadDescription } from 'applications/caregivers/components/AdditionalInfo';
import recordEvent from 'platform/monitoring/record-event';

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
    'ui:description': RepresentativeDocumentUploadDescription(),
    'ui:title': () => (
      <legend className="vads-u-font-size--h4">
        Upload your legal representative documentation
        <span className="vads-u-margin-left--0p5 vads-u-color--secondary-dark vads-u-font-size--sm vads-u-font-weight--normal">
          (*Required)
        </span>
      </legend>
    ),
    [representativeFields.documentUpload]: fileUploadUI(
      'Upload your legal representative documentation',
      {
        buttonText: 'Upload',
        classNames: 'poa-document-upload',
        multiple: false,
        fileUploadUrl: `${environment.API_URL}/v0/form1010cg/attachments`,
        fileTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'rtf', 'png'],
        maxSize: 1024 * 1024 * 10,
        hideLabelText: true,
        createPayload,
        parseResponse,
        attachmentName: {
          'ui:title': 'Document name',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    required: [representativeFields.documentUpload],
    properties: {
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
