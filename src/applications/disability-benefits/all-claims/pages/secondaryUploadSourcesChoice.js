import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { uploadDescription } from '../content/secondaryUploadSourcesChoice';

export const uiSchema = index => ({
  'ui:title': ptsd781aNameTitle,
  'ui:description': uploadDescription,
  [`secondaryIncident${index}`]: {
    'view:uploadSources': yesNoUI({
      title: 'Do you have supporting documents you would like to upload?',
    }),
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`secondaryIncident${index}`]: {
      type: 'object',
      properties: {
        'view:uploadSources': yesNoSchema,
      },
    },
  },
});
