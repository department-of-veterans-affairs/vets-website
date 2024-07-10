import environment from '~/platform/utilities/environment';
import VaSelectField from '~/platform/forms-system/src/js/web-component-fields/VaSelectField';
import fileUiSchema from '../definitions/file';

export function fileUploadUi(content) {
  return {
    ...fileUiSchema(content.label, {
      buttonText: 'Upload file',
      addAnotherLabel: 'Upload another file',
      itemDescription: content.description,
      fileUploadUrl: `${environment.API_URL}/v0/preneeds/preneed_attachments`,
      fileTypes: ['pdf'],
      maxSize: 15728640,
      minSize: 1024,
      createPayload: file => {
        const payload = new FormData();
        payload.append('preneed_attachment[file_data]', file);
        return payload;
      },
      parseResponse: (response, file) => ({
        name: file.name,
        confirmationCode: response.data.attributes.guid,
      }),
      attachmentSchema: ({ fileName }) => ({
        'ui:title': 'What kind of file is this?',
        'ui:disabled': false,
        'ui:webComponentField': VaSelectField,
        'ui:options': {
          messageAriaDescribedby: `Choose a document type for ${fileName}`,
        },
      }),
      hideLabelText: !content.label,
      hideOnReview: true,
      attachmentName: {
        'ui:title': 'File name',
      },
    }),
    'ui:description': content.description,
  };
}
