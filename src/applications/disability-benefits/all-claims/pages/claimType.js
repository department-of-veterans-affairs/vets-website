export const uiSchema = {
  'ui:description':
    'Please tell us what type of disability claim you’re filing. (Select all that apply.)',
  'view:claimingNew': {
    'ui:title': 'For a new condition',
  },
  'view:claimingIncrease': {
    'ui:title': 'Because one or more of my rated conditions has gotten worse',
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:claimingNew': { type: 'boolean' },
    'view:claimingIncrease': { type: 'boolean' },
  },
};
