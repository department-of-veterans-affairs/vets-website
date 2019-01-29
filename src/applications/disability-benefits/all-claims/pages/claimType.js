export const uiSchema = {
  'ui:description':
    'Please tell us what you’re claiming. (Select all that apply.)',
  'view:claimingNew': {
    'ui:title': 'I have a new condition to add to my rated disability claim',
  },
  'view:claimingIncrease': {
    'ui:title': 'One or more of my rated disabilities has gotten worse',
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:claimingNew': { type: 'boolean' },
    'view:claimingIncrease': { type: 'boolean' },
  },
};
