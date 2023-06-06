import ResolutionExplainerWidget from '../../components/ResolutionExplainerWidget';

export const uiSchema = {
  'ui:title': ' ',
  resolutionExplainer: {
    'ui:title': ' ',
    'ui:widget': ResolutionExplainerWidget,
    'ui:options': {
      hideOnReview: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    resolutionExplainer: {
      type: 'boolean',
    },
  },
};
