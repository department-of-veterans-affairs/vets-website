import React from 'react';

import { ancillaryFormUploadUi } from '../utils';

import { UploadDescription } from '../content/fileUploadDescriptions';
import { ptsd781aNameTitle } from '../content/ptsdClassification';
// import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import tempSchema from '../config/schema';

const { secondaryAttachments } = tempSchema.properties;

export const uiSchema = index => ({
  'ui:title': ptsd781aNameTitle,
  'ui:description': (
    <UploadDescription uploadTitle="Upload supporting documents" />
  ),
  [`secondaryUploadSources${index}`]: ancillaryFormUploadUi(
    '',
    'PTSD 781a form supporting documents',
    {},
  ),
});

export const schema = index => ({
  type: 'object',
  required: [`secondaryUploadSources${index}`],
  properties: {
    [`secondaryUploadSources${index}`]: secondaryAttachments,
  },
});
