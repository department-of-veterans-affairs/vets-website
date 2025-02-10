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
    newFormData.inputNonVeteranClaimantName = undefined;
    newFormData.inputNonVeteranClaimantDOB = undefined;
    newFormData.inputNonVeteranClaimantEmail = undefined;
    newFormData.inputNonVeteranClaimantPhone = undefined;
    newFormData.inputNonVeteranClaimantHomeAddress = {
      city: undefined,
      country: undefined,
      postalCode: undefined,
      state: undefined,
      street: undefined,
    };
  } else {
    newFormData.inputNonVeteranClaimantName = {
      first: formData?.personalInformation?.fullName?.first,
      middle: formData?.personalInformation?.fullName?.middle?.substring(0, 1),
      last: formData?.personalInformation?.fullName?.last,
    };
    newFormData.inputNonVeteranClaimantDOB =
      formData?.personalInformation?.dateOfBirth;
    newFormData.inputNonVeteranClaimantEmail =
      formData?.contactInformation?.email;
    newFormData.inputNonVeteranClaimantPhone =
      formData?.contactInformation?.primaryPhone;
    newFormData.inputNonVeteranClaimantHomeAddress = {
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
