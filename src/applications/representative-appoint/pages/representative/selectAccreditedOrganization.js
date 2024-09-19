import DynamicRadioWidget from '../../config/organizations/DynamicRadioWidget';

export const uiSchema = {
  selectedAccreditedOrganizationId: {
    'ui:title': 'Select Organization',
    'ui:widget': DynamicRadioWidget,
    'ui:options': {
      hideLabelText: true,
    },
    'ui:required': () => true,
  },
};
export const schema = {};
