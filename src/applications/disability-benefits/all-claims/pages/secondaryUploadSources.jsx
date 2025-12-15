import React from 'react';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import { ancillaryFormUploadUi } from '../utils/schemas';
import { UploadDescription } from '../content/fileUploadDescriptions';
import { ptsd781aNameTitle } from '../content/ptsdClassification';

const { secondaryAttachment } = fullSchema.properties;

export const uiSchema = index => ({
  'ui:title': ptsd781aNameTitle,
  'ui:description': (
    <UploadDescription uploadTitle="Upload supporting documents" />
  ),
  [`secondaryUploadSources${index}`]: {
    ...ancillaryFormUploadUi('', 'PTSD 781a form supporting documents', {}),
    'ui:confirmationField': ({ formData }) => ({
      data: formData?.map(item => item.name || item.fileName),
      label: 'Uploaded file(s)',
    }),
  },
});

export const schema = index => ({
  type: 'object',
  required: [`secondaryUploadSources${index}`],
  properties: {
    [`secondaryUploadSources${index}`]: secondaryAttachment,
  },
});
