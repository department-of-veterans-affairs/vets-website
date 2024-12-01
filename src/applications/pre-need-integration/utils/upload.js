import environment from '~/platform/utilities/environment';
import fileUiSchema from '~/platform/forms-system/src/js/definitions/file';
import VaSelectField from '~/platform/forms-system/src/js/web-component-fields/VaSelectField';

import { createPayload, parseResponse } from './helpers';

export function fileUploadUi(content) {
  return {
    ...fileUiSchema(content.label, {
      buttonText: 'Upload file',
      addAnotherLabel: 'Upload another file',
      itemDescription: content.description,
      fileUploadUrl: `${
        environment.API_URL
      }/simple_forms_api/v1/simple_forms/submit_supporting_documents`,
      fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
      maxSize: 1024 * 1024 * 100, // 100 MB max size,
      minSize: 1024,
      createPayload,
      parseResponse,
      attachmentSchema: ({ fileName }) => ({
        'ui:title': 'What kind of file is this?',
        'ui:disabled': false,
        'ui:webComponentField': VaSelectField,
        'ui:options': {
          messageAriaDescribedby: `Choose a document type for ${fileName}`,
        },
      }),
      hideLabelText: !content.label,
      hideOnReview: false,
      attachmentName: {
        'ui:title': 'File name',
      },
    }),
    'ui:description': content.description,
  };
}
