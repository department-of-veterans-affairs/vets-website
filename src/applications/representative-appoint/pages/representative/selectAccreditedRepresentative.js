import SelectAccreditedRepresentative from '../../components/SelectAccreditedRepresentative';

export const uiSchema = {
  selectAccreditedRepresentative: {
    'ui:title': 'Select Accredited Representative',
    'ui:widget': SelectAccreditedRepresentative,
    'ui:options': {
      hideLabelText: true,
    },
    'ui:required': () => true,
  },
};

export const schema = {
  type: 'object',
  properties: {
    selectAccreditedRepresentative: {
      type: 'string',
    },
  },
  required: ['view:selectedAccreditedRep'],
};
