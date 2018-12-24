import { ancillaryFormUploadUi } from '../utils';

import { uploadDescription } from '../content/fileUploadDescriptions';
import { ptsd781aNameTitle } from '../content/ptsdClassification';
// import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import tempSchema from '../config/schema';

const { secondaryAttachments } = tempSchema.properties;

export const uiSchema = index => ({
  'ui:title': ptsd781aNameTitle,
  'ui:description': uploadDescription,
  [`secondaryUploadSources${index}`]: ancillaryFormUploadUi(
    '',
    'PTSD 781a form supporting documents',
    {},
  ),
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`secondaryUploadSources${index}`]: secondaryAttachments,
  },
});
