import React from 'react';

import { UploadDescription } from '../content/fileUploadDescriptions';
import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { ancillaryFormUploadUi } from '../utils';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const { attachments } = fullSchema.properties;
const secondarySupportStatement = 'L229';

export const uiSchema = {
  'ui:title': ptsd781aNameTitle,
  'ui:description': <UploadDescription uploadTitle="Upload VA Form 21-0781a" />,
  ptsd781a: ancillaryFormUploadUi('', 'PTSD 781a form', {
    attachmentId: secondarySupportStatement,
  }),
};

export const schema = {
  type: 'object',
  required: ['ptsd781a'],
  properties: {
    ptsd781a: attachments,
  },
};
