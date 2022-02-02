import SearchRepresentativeWidget from './searchRepresentativeWidget.jsx';
import searchRepresentativeReviewWidget from './searchRepresentativeReviewWidget.jsx';

export const schema = {
  type: 'object',
  properties: {
    preferredRepresentative: {
      type: 'string',
    },
  },
};

export const uiSchema = {
  preferredRepresentative: {
    'ui:title': 'Selected VA medical center',
    'ui:widget': SearchRepresentativeWidget,
    'ui:options': {
      hideLabelText: true,
    },
    'ui:reviewWidget': searchRepresentativeReviewWidget,
  },
};
