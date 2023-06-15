import MonetaryCheckList from '../../../components/monetary/MonetaryCheckList';

export const uiSchema = {
  'ui:title': '',
  'ui:field': MonetaryCheckList,
  monetaryCheckList: {
    'ui:title': 'monetaryCheckList',
    'ui:options': {
      hideOnReview: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    monetaryCheckList: {
      type: 'boolean',
    },
  },
};
