const authorizationTitle =
  'Do you authorize your accredited representative to change your address in your VA.gov proifle?';

export const schema = {
  type: 'object',
  properties: {
    authorization: {
      type: 'boolean',
      title: authorizationTitle,
    },
  },
};

export const uiSchema = {
  authorization: {
    'ui:widget': 'yesNo',
  },
};
