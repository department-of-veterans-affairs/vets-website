import ContactAccreditedRepresentative from '../../components/ContactAccreditedRepresentative';

export const uiSchema = {
  contactAccreditedRepresentative: {
    'ui:title': 'Replace your current accredited representative',
    'ui:widget': ContactAccreditedRepresentative,
    'ui:options': {
      hideLabelText: true,
      hideOnReview: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    contactAccreditedRepresentative: {
      type: 'string',
    },
  },
};
