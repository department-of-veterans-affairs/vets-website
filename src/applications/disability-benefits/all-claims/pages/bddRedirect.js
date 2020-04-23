import content from '../content/bddRedirect';
import { activeServicePeriods } from '../utils';
import environment from 'platform/utilities/environment';

export const depends = formData =>
  !environment.isProduction() && !!activeServicePeriods(formData).length;

export const uiSchema = {
  'ui:title': 'Filing a claim before discharge',
  'ui:description': content,
};

export const schema = {
  type: 'object',
  properties: {
    'view:bddRedirectWarning': { type: 'object', properties: {} },
  },
};
