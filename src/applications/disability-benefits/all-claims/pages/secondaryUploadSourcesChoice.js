import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { uploadDescription } from '../content/secondaryUploadSourcesChoice';

export const uiSchema = index => ({
  'ui:title': ptsd781aNameTitle,
  'ui:description': uploadDescription,
  [`view:uploadChoice${index}`]: {
    'ui:title': 'Do you have supporting documents you would like to upload?',
    'ui:widget': 'yesNo',
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`view:uploadChoice${index}`]: {
      type: 'boolean',
      properties: {},
    },
  },
});
