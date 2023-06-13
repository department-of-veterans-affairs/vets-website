import MonetaryCheckList from '../../../components/monetary/MonetaryCheckList';

export const uiSchema = {
  'ui:title': '',
  'ui:field': MonetaryCheckList,
  'ui:options': {
    hideOnReview: true,
  },
  monetaryCheckList: {
    'ui:title': 'monetaryCheckList',
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
