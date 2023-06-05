import MonetaryCheckList from '../../../components/monetary/MonetaryCheckList';

export const uiSchema = {
  'ui:title': 'Your household assets',
  monetaryAssets: {
    'ui:title': 'Select any of these financial assets you have:',
    'ui:widget': MonetaryCheckList,
    'ui:options': {
      hideOnReview: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    monetaryAssets: {
      type: 'boolean',
    },
  },
};
