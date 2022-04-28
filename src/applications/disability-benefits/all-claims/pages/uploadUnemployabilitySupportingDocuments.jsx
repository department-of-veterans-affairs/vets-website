import React from 'react';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import { ancillaryFormUploadUi } from '../utils/schemas';
import { UploadDescription } from '../content/fileUploadDescriptions';
import { unemployabilityTitle } from '../content/unemployabilityFormIntro';

const { unemployabilityAttachments } = fullSchema.properties;

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
    unemployabilitySupportingDocuments: unemployabilityAttachments,
  },
};
