import SelectOrganization from '../../components/SelectOrganization';
import { pageDepends as isDigiSubmission } from './representativeSubmissionMethod';

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
  // in digital submission flow, display even if there's only one org
  const minimumOrgs = isDigiSubmission() ? 0 : 1;

  return (
    !!formData['view:selectedRepresentative'] &&
    ['representative', 'veteran_service_officer'].includes(
      formData['view:selectedRepresentative'].attributes?.individualType,
    ) &&
    formData['view:selectedRepresentative'].attributes?.accreditedOrganizations
      ?.data?.length > minimumOrgs
  );
};
