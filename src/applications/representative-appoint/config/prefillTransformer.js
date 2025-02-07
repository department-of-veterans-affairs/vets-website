import { preparerIsVeteran } from '../utilities/helpers';

export default function prefillTransformer(formData) {
  const newFormData = {
    ...formData,
  };

  if (preparerIsVeteran({ formData })) {
    newFormData.inputVeteranFullName = {
      first: formData?.personalInformation?.fullName?.first,
      middle: formData?.personalInformation?.fullName?.middle?.substring(0, 1),
      last: formData?.personalInformation?.fullName?.last,
    };
    newFormData.inputVeteranDOB = formData?.personalInformation?.dateOfBirth;
    newFormData.inputVeteranSSN = formData?.personalInformation?.ssn;
    newFormData.inputVeteranHomeAddress = {
      city: formData?.contactInformation?.address?.city,
      country: formData?.contactInformation?.address?.country,
      postalCode: formData?.contactInformation?.address?.postalCode,
      state: formData?.contactInformation?.address?.state,
      street: formData?.contactInformation?.address?.street,
    };
    newFormData.inputVeteranEmail = formData?.contactInformation?.email;
    newFormData.inputVeteranPrimaryPhone =
      formData?.contactInformation?.primaryPhone;
    newFormData['Branch of Service'] =
      formData?.militaryInformation?.serviceBranch;
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

    // reset the applicant information in case of claimant type change
    newFormData.inputVeteranFullName = undefined;
    newFormData.inputVeteranDOB = undefined;
    newFormData.inputVeteranSSN = undefined;
    newFormData.inputVeteranHomeAddress = {
      city: undefined,
      country: undefined,
      postalCode: undefined,
      state: undefined,
      street: undefined,
    };
    newFormData.inputVeteranEmail = undefined;
    newFormData.inputVeteranPrimaryPhone = undefined;
    newFormData['Branch of Service'] = undefined;
  }

  newFormData.userIsDigitalSubmitEligible =
    formData?.identityValidation?.hasIcn &&
    formData?.identityValidation?.hasParticipantId;

  return newFormData;
}
