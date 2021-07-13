import SearchRepresentativeWidget from './searchRepresentativeWidget.jsx';

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
  },
};
