import content from '../content/bddRedirect';

export const depends = () => true;
export const uiSchema = {
  'ui:title': 'Filing a claim before discharge',
  'view:bddRedirect': {
    'ui:description': content,
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:bddRedirect': { type: 'object', properties: {} },
  },
};
