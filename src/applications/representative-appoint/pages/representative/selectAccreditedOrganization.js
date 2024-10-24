import SelectOrganization from '../../components/SelectOrganization';

export const uiSchema = {
  selectedAccreditedOrganizationId: {
    'ui:title': 'Select Organization',
    'ui:widget': SelectOrganization,
    'ui:options': {
      hideLabelText: true,
      hideOnReview: true,
    },
    'ui:required': () => true,
  },
};

export const schema = {};
