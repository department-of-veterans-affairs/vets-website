import environment from '../../../../platform/utilities/environment';
import fileUploadUI from 'us-forms-system/lib/js/definitions/file';

const FIFTY_MB = 52428800;

export const ancillaryFormUploadUi = itemDescription =>
  fileUploadUI('', {
    itemDescription,
    hideLabelText: true,
    fileUploadUrl: `${environment.API_URL}/v0/upload_supporting_evidence`,
    fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
    maxSize: FIFTY_MB,
    createPayload: file => {
      const payload = new FormData();
      payload.append('supporting_evidence_attachment[file_data]', file);

      return payload;
    },
    parseResponse: (response, file) => ({
      name: file.name,
      confirmationCode: response.data.attributes.guid,
    }),
    // this is the uiSchema passed to FileField for the attachmentId schema
    // FileField requires this name be used
    attachmentSchema: {
      'ui:title': 'Document type',
    },
    // this is the uiSchema passed to FileField for the name schema
    // FileField requires this name be used
    attachmentName: {
      'ui:title': 'Document name',
    },
  });
