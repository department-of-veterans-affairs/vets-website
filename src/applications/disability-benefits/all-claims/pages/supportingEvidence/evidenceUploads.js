import full526EZSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import { ancillaryFormUploadUi } from '../../utils/schemas';

const { attachments } = full526EZSchema.properties;

export default {
  uiSchema: {
    'ui:title': 'Add Document',
    uploadedDocuments: {
      ...ancillaryFormUploadUi(
        'Upload the evidence you want to add to your claim',
        'Adding evidence:',
        {
          addAnotherLabel: 'Add more evidence',
          buttonText: 'Upload evidence',
        },
      ),
      'ui:description': 'Upload description',
    },
  },
  schema: {
    type: 'object',
    properties: {
      uploadedDocuments: attachments,
    },
  },
};
