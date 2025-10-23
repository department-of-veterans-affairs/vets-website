import { download4192Notice } from '../content/pastEmploymentFormDownload';
import {
  unemployabilityTitle,
  unemployabilityPageTitle,
} from '../content/unemployabilityFormIntro';

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  'view:downloadInfo': {
    'ui:title': unemployabilityPageTitle('Download VA Form 21-4192'),
    'ui:description': download4192Notice,
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:downloadInfo': {
      type: 'object',
      properties: {},
    },
  },
};
