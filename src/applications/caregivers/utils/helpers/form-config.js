export const hasPrimaryCaregiver = formData =>
  formData['view:hasPrimaryCaregiver'] === true;

export const hasSecondaryCaregiverOne = formData =>
  formData['view:hasSecondaryCaregiverOne'] === true;

export const hasSecondaryCaregiverTwo = formData =>
  hasSecondaryCaregiverOne(formData) &&
  formData['view:hasSecondaryCaregiverTwo'] === true;

export const hideCaregiverRequiredAlert = formData => {
  const hasPrimary = hasPrimaryCaregiver(formData);
  const hasSecondary = hasSecondaryCaregiverOne(formData);
  const isSecondaryOneUndefined =
    formData['view:hasSecondaryCaregiverOne'] === undefined;
  return hasPrimary || hasSecondary || isSecondaryOneUndefined;
};

export const hideUploadWarningAlert = formData => {
  const { signAsRepresentativeDocumentUpload: upload } = formData;
  const hasDocument = !!upload?.length;

  if (!hasDocument) return true;

  const { guid, name, errorMessage } = upload[0];
  return !(guid && name && !errorMessage);
};

export const primaryHasDifferentMailingAddress = formData => {
  const hasCaregiver = hasPrimaryCaregiver(formData);
  const hasDifferentMailingAddress =
    formData['view:primaryHomeSameAsMailingAddress'] === false;
  return hasCaregiver && hasDifferentMailingAddress;
};

export const secondaryOneHasDifferentMailingAddress = formData => {
  const hasCaregiver = hasSecondaryCaregiverOne(formData);
  const hasDifferentMailingAddress =
    formData['view:secondaryOneHomeSameAsMailingAddress'] === false;
  return hasCaregiver && hasDifferentMailingAddress;
};

export const secondaryTwoHasDifferentMailingAddress = formData => {
  const hasCaregiver = hasSecondaryCaregiverTwo(formData);
  const hasDifferentMailingAddress =
    formData['view:secondaryTwoHomeSameAsMailingAddress'] === false;
  return hasCaregiver && hasDifferentMailingAddress;
};

export const showFacilityConfirmation = formData => {
  if (!formData['view:useFacilitiesAPI']) return false;

  const plannedClinic = formData['view:plannedClinic'];

  if (
    !plannedClinic ||
    typeof plannedClinic !== 'object' ||
    !Object.keys(plannedClinic).length
  ) {
    return false;
  }

  return (
    plannedClinic?.veteranSelected?.id !== plannedClinic?.caregiverSupport?.id
  );
};
