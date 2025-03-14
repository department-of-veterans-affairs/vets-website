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

export const schema = {
  type: 'object',
  properties: {
    selectedAccreditedOrganizationId: {
      type: 'string',
    },
  },
};

export const pageDepends = formData => {
  /*
    tentatively displaying org select screen in all digital submission 
    cases (even if there's only one org)
  */
  const minimumOrgCount =
    formData.representativeSubmissionMethod === 'digital' ? 1 : 2;

  return (
    !!formData['view:selectedRepresentative'] &&
    ['representative', 'veteran_service_officer'].includes(
      formData['view:selectedRepresentative'].attributes?.individualType,
    ) &&
    formData['view:selectedRepresentative'].attributes?.accreditedOrganizations
      ?.data?.length >= minimumOrgCount
  );
};
