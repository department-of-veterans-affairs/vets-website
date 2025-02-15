import SelectOrganization from '../../components/SelectOrganization';

export const uiSchema = {
  inputSelectedOrgId: {
    'ui:title': 'Select Organization',
    'ui:widget': SelectOrganization,
    'ui:options': {
      hideLabelText: true,
      hideOnReview: true,
    },
    'ui:required': () => true,
  },
};

export const schema = {
  type: 'object',
  properties: {
    inputSelectedOrgId: {
      type: 'string',
    },
  },
};

export const pageDepends = formData => {
  return (
    !!formData.inputSelectedRepresentative &&
    ['representative', 'veteran_service_officer'].includes(
      formData.inputSelectedRepresentative.attributes?.individualType,
    ) &&
    formData.inputSelectedRepresentative.attributes?.accreditedOrganizations
      ?.data?.length > 1
  );
};
