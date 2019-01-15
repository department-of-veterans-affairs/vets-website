import { download4192Notice } from '../content/pastEmploymentFormDownload';
import { unemployabilityTitle } from '../content/unemployabilityFormIntro';

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  'ui:description': download4192Notice,
};

export const schema = {
  type: 'object',
  properties: {},
};
