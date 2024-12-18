import { preparerIsVeteran } from '../utilities/helpers';

export default function prefillTransformer(formData) {
  const newFormData = {
    ...formData,
  };

  if (preparerIsVeteran({ formData })) {
    newFormData.veteranFullName = formData?.personalInformation?.fullName;
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
    newFormData['Primary phone'] = formData?.contactInformation?.primaryPhone;
    newFormData['Branch of Service'] =
      formData?.militaryInformation?.serviceBranch;
  } else {
    newFormData.applicantName = formData?.personalInformation?.fullName;
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
  }

  return newFormData;
}
