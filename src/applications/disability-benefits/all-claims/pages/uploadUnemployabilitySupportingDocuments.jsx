import React from 'react';

import { ancillaryFormUploadUi } from '../utils';
import { UploadDescription } from '../content/fileUploadDescriptions';
import { unemployabilityTitle } from '../content/unemployabilityFormIntro';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const { attachments } = fullSchema.properties;

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  'ui:description': (
    <UploadDescription uploadTitle="Upload supporting documents" />
  ),
  unemployabilitySupportingDocuments: ancillaryFormUploadUi(
    '',
    'Individual Unemployability 8940 form supporting documents',
  ),
};

export const schema = {
  type: 'object',
  properties: {
    unemployabilitySupportingDocuments: attachments,
  },
};
