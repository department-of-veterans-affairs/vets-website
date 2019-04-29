import content from '../content/bddRedirect';
import { activeServicePeriods } from '../utils';

export const depends = formData => !!activeServicePeriods(formData).length;

export const uiSchema = {
  'ui:title': 'Filing a claim before discharge',
  'view:bddRedirectWarning': {
    'ui:description': content,
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:bddRedirectWarning': { type: 'object', properties: {} },
  },
};
