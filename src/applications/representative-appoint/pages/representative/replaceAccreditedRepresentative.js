import ReplaceAccreditedRepresentative from '../../components/ReplaceAccreditedRepresentative';

export const uiSchema = {
  replaceAccreditedRepresentative: {
    'ui:title': 'Replace your current accredited representative',
    'ui:widget': ReplaceAccreditedRepresentative,
    'ui:options': {
      hideLabelText: true,
      hideOnReview: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    replaceAccreditedRepresentative: {
      type: 'string',
    },
  },
};
