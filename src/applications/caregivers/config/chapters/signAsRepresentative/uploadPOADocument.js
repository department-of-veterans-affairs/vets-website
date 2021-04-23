// import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import environment from 'platform/utilities/environment';
import { representativeFields } from 'applications/caregivers/definitions/constants';
import {
  RepresentativeDocumentUploadDescription,
  RepresentativeAdditionalInfo,
} from 'applications/caregivers/components/AdditionalInfo';
import recordEvent from 'platform/monitoring/record-event';

// const { representative } = fullSchema.properties;
// const veteranProps = veteran.properties;
// const { address, phone } = fullSchema.definitions;

const attachmentsSchema = {
  type: 'array',
  minItems: 1,
  items: {
    type: 'object',
    required: ['attachmentId', 'name'],
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
      attachmentId: {
        type: 'string',
        enum: ['1', '2', '3', '4', '5', '6', '7'],
        enumNames: [
          'DD214',
          'DD215 (used to correct or make additions to the DD214)',
          'WD AGO 53-55 (report of separation used prior to 1950)',
          'Other discharge papers (like your DD256, DD257, or NGB22)',
          'Official documentation of a military award (like a Purple Heart, Medal of Honor, or Silver Star)',
          'Disability rating letter from the Veterans Benefit Administration (VBA)',
          'Other official military document',
        ],
      },
    },
  },
};

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
      createPayload: file => {
        const payload = new FormData();
        payload.append('attachment', file);
        return payload;
      },
      parseResponse: (response, file) => {
        recordEvent({
          'caregivers-poa-document-success': file.name,
          'caregivers-poa-document-size': file.size,
          'caregivers-poa-document-confirmation-code':
            response.data.attributes.guid,
        });
        return {
          name: file.name,
          confirmationCode: response.data.attributes.guid,
          size: file.size,
        };
      },
      attachmentSchema: {
        'ui:title': 'Document type',
      },
      attachmentName: {
        'ui:title': 'Document name',
      },
    }),
    'view:placeholderTwo': {
      'ui:description': RepresentativeAdditionalInfo(),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [representativeFields.documentUpload]: attachmentsSchema,
      'view:placeholderTwo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
