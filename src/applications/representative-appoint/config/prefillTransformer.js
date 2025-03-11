import { preparerIsVeteran } from '../utilities/helpers';

export default function prefillTransformer(formData) {
  const newFormData = {
    ...formData,
  };

  if (preparerIsVeteran({ formData })) {
    newFormData.veteranFullName = {
      first: formData?.personalInformation?.fullName?.first,
      middle: formData?.personalInformation?.fullName?.middle?.substring(0, 1),
      last: formData?.personalInformation?.fullName?.last,
    };
    newFormData.veteranDateOfBirth = formData?.personalInformation?.dateOfBirth;
    newFormData.veteranSocialSecurityNumber =
      formData?.personalInformation?.ssn;
    newFormData.veteranHomeAddress = {
      city: formData?.contactInformation?.address?.city,
      country: formData?.contactInformation?.address?.country,
      postalCode: formData?.contactInformation?.address?.postalCode,
      state: formData?.contactInformation?.address?.state,
      street: formData?.contactInformation?.address?.street,
    };
    newFormData.veteranEmail = formData?.contactInformation?.email;
    newFormData.primaryPhone = formData?.contactInformation?.primaryPhone;
    newFormData['Branch of Service'] =
      formData?.militaryInformation?.serviceBranch;

    // only Veteran users are digital submit eligible at this time
    newFormData.userIsDigitalSubmitEligible =
      formData?.identityValidation?.hasIcn &&
      formData?.identityValidation?.hasParticipantId;

    // reset the applicant information in case of claimant type change
    newFormData.applicantName = undefined;
    newFormData.applicantDOB = undefined;
    newFormData.applicantEmail = undefined;
    newFormData.applicantPhone = undefined;
    newFormData.homeAddress = {
      city: undefined,
      country: undefined,
      postalCode: undefined,
      state: undefined,
      street: undefined,
    };
  } else {
    newFormData.applicantName = {
      first: formData?.personalInformation?.fullName?.first,
      middle: formData?.personalInformation?.fullName?.middle?.substring(0, 1),
      last: formData?.personalInformation?.fullName?.last,
    };
    newFormData.applicantDOB = formData?.personalInformation?.dateOfBirth;
    newFormData.applicantEmail = formData?.contactInformation?.email;
    newFormData.applicantPhone = formData?.contactInformation?.primaryPhone;
    newFormData.homeAddress = {
      city: formData?.contactInformation?.address?.city,
      country: formData?.contactInformation?.address?.country,
      postalCode: formData?.contactInformation?.address?.postalCode,
      state: formData?.contactInformation?.address?.state,
      street: formData?.contactInformation?.address?.street,
    };

    // only Veteran users are digital submit eligible at this time
    newFormData.userIsDigitalSubmitEligible = undefined;
    newFormData.representativeSubmissionMethod = undefined;

    // reset the Veteran information in case of claimant type change
    newFormData.veteranFullName = undefined;
    newFormData.veteranDateOfBirth = undefined;
    newFormData.veteranSocialSecurityNumber = undefined;
    newFormData.veteranHomeAddress = {
      city: undefined,
      country: undefined,
      postalCode: undefined,
      state: undefined,
      street: undefined,
    };
    newFormData.veteranEmail = undefined;
    newFormData.primaryPhone = undefined;
    newFormData['Branch of Service'] = undefined;
  }

  return newFormData;
}
