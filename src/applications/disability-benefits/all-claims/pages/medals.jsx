import { ptsd781NameTitle } from '../content/ptsdClassification';

export const uiSchema = index => ({
  'ui:title': ptsd781NameTitle,
  'ui:description':
    'To help us research your claim, please let us know the names of any medals or citations you received for the event.',
  [`incident${index}`]: {
    medalsCitations: {
      'ui:title': 'Medals or citations you received for this event',
    },
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`incident${index}`]: {
      type: 'object',
      properties: {
        medalsCitations: {
          type: 'string',
        },
      },
    },
  },
});
