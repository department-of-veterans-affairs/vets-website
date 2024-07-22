import environment from '~/platform/utilities/environment';
import VaSelectField from '~/platform/forms-system/src/js/web-component-fields/VaSelectField';
import fileUiSchema from '../definitions/file';

import { createPayload, parseResponse } from './helpers';

export function fileUploadUi(content) {
  return {
    ...fileUiSchema(content.label, {
      buttonText: 'Upload file',
      addAnotherLabel: 'Upload another file',
      itemDescription: content.description,
      ffileUploadUrl: `${
        environment.API_URL
      }/simple_forms_api/v1/simple_forms/submit_supporting_documents`,
      fileTypes: ['pdf'],
      maxSize: 15728640,
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
