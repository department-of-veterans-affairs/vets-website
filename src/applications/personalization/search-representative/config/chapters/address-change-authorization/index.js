import AuthorizationLimits from '../../../components/AuthorizationLimits';

const authorizationTitle =
  'Do you authorize your accredited representative to change your address in your VA.gov profile?';

export const schema = {
  type: 'object',
  properties: {
    authorization: {
      type: 'boolean',
      title: authorizationTitle,
    },
    'view:authorizationLimits': {
      type: 'object',
      properties: {},
    },
  },
};

export const uiSchema = {
  authorization: {
    'ui:widget': 'yesNo',
  },
  'view:authorizationLimits': {
    'ui:field': AuthorizationLimits,
  },
};
