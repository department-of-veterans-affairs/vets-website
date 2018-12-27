import { uploadDescription } from '../content/fileUploadDescriptions';
import { ptsd781NameTitle } from '../content/ptsdClassification';
import { ancillaryFormUploadUi } from '../utils';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const { completedFormAttachments } = fullSchema.properties;

export const uiSchema = {
  'ui:title': ptsd781NameTitle,
  'ui:description': uploadDescription,
  ptsd781: ancillaryFormUploadUi('', 'PTSD 781 form', {
    attachmentId: 'VA Form 21-781 - Statement in Support of Claim for PTSD',
    widgetType: 'textarea',
    customClasses: 'upload-completed-form',
    isDisabled: true,
  }),
};

export const schema = {
  type: 'object',
  required: ['ptsd781'],
  properties: {
    ptsd781: completedFormAttachments,
  },
};
