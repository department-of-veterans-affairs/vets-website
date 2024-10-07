import ReplaceAccreditedRepresentative from '../../components/ReplaceAccreditedRepresentative';

export const uiSchema = {
  replaceAccreditedRepresentative: {
    'ui:title': 'Replace your current accredited representative',
    'ui:widget': ReplaceAccreditedRepresentative,
    'ui:options': {
      hideLabelText: true,
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
