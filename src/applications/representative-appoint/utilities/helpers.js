import environment from '@department-of-veterans-affairs/platform-utilities/environment';

export const addressExists = address =>
  !!(
    address?.addressLine1?.trim() &&
    address?.city?.trim() &&
    address?.stateCode?.trim() &&
    address?.zipCode?.trim()
  );

export const filterOrganizations = formData => {
  const organizations =
    formData['view:selectedRepresentative']?.attributes?.accreditedOrganizations
      ?.data;
  const submissionMethod = formData.representativeSubmissionMethod;

  if (submissionMethod === 'digital') {
    return organizations?.filter(
      org => org.attributes?.canAcceptDigitalPoaRequests === true,
    );
  }

  return organizations;
};

export const isProductionEnv = () => {
  return (
    !environment.BASE_URL.includes('localhost') &&
    !window.DD_RUM?.getInitConfiguration() &&
    !window.Mocha
  );
};
