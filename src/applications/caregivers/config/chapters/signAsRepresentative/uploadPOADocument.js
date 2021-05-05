// import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import environment from 'platform/utilities/environment';
import { representativeFields } from 'applications/caregivers/definitions/constants';
import { RepresentativeDocumentUploadDescription } from 'applications/caregivers/components/AdditionalInfo';
// import recordEvent from 'platform/monitoring/record-event';

// const { representative } = fullSchema.properties;
// const veteranProps = veteran.properties;
// const { address, phone } = fullSchema.definitions;

const attachmentsSchema = {
  type: 'array',
  minItems: 1,
  maxItems: 1,
  items: {
    type: 'object',
    required: ['guid'],
    properties: {
      guid: {
        type: 'string',
        format: 'uuid',
      },
    },
  },
};

// const { poaAttachmentId } = fullSchema.properties;

export default {
  uiSchema: {
    'ui:title': '',
    'ui:description': RepresentativeDocumentUploadDescription(),
    [representativeFields.documentUpload]: fileUploadUI('', {
      buttonText: 'Upload',
      classNames: 'poa-document-upload',
      multiple: false,
      fileUploadUrl: `${environment.API_URL}/v0/form1010cg/attachments`,
      fileTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'rtf', 'png'],
      maxSize: 1024 * 1024 * 10,
      hideLabelText: true,
      createPayload: (file, formId, password) => {
        const payload = new FormData();
        payload.append('attachment[file_data]', file);
        payload.append('form_id', formId);

        // password for encrypted PDFs
        if (password) {
          payload.append('attachment[password]', password);
        }

        return payload;
      },
      parseResponse: fileInfo => {
        /* TODO need to figure out why this is failing 
           I think there are more required attributes for UI */
        return {
          guid: fileInfo.data.attributes.guid,
          confirmationCode: fileInfo.data.id,
        };
      },
      attachmentSchema: {
        'ui:title': 'Document type',
      },
      attachmentName: {
        'ui:title': 'Document name',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      [representativeFields.documentUpload]: attachmentsSchema,
    },
  },
};
