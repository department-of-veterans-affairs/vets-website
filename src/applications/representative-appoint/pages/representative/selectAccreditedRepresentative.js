import SelectAccreditedRepresentative, {
  AdditionalNote,
} from '../../components/SelectAccreditedRepresentative';

export const uiSchema = {
  selectAccreditedRepresentative: {
    'ui:title': 'Select Accredited Representative',
    'ui:widget': SelectAccreditedRepresentative,
    'ui:options': {
      hideLabelText: true,
    },
    'ui:required': () => true,
    'ui:errorMessages': {
      required:
        'Select the accredited representative or VSO you’d like to appoint below',
    },
  },
  additionalNote: {
    'ui:widget': AdditionalNote,
    'ui:options': {
      hideLabelText: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    selectAccreditedRepresentative: {
      type: 'string',
    },
    additionalNote: {
      type: 'string',
    },
  },
  required: ['view:selectedAccreditedRep'],
};
