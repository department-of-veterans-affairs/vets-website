import environment from 'platform/utilities/environment';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';

import DischargePapersDescription from '../../../components/FormDescriptions/DischargePapersDescription';

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
    'ui:title': 'Upload your discharge papers',
    'ui:description': DischargePapersDescription,
    attachments: fileUploadUI('', {
      buttonText: 'Upload a document',
      addAnotherLabel: 'Upload another document',
      fileUploadUrl: `${environment.API_URL}/v0/hca_attachments`,
      fileTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'rtf', 'png'],
      maxSize: 1024 * 1024 * 10,
      hideLabelText: true,
      createPayload: file => {
        const payload = new FormData();
        payload.append('hca_attachment[file_data]', file);
        return payload;
      },
      parseResponse: (response, file) => ({
        name: file.name,
        confirmationCode: response.data.attributes.guid,
        size: file.size,
      }),
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
      attachments: attachmentsSchema,
    },
  },
};
