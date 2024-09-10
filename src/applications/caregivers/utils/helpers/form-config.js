export const hasPrimaryCaregiver = formData => {
  return formData['view:hasPrimaryCaregiver'] === true;
};

export const hasSecondaryCaregiverOne = formData =>
  formData['view:hasSecondaryCaregiverOne'] === true;

export const hasSecondaryCaregiverTwo = formData =>
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
  const hasDocument = upload?.length;

  if (!hasDocument) return false;

  const { guid, name, errorMessage } = upload[0];
  return !(guid && name && !errorMessage);
};

export const isSsnUnique = formData => {
  const {
    veteranSsnOrTin,
    primarySsnOrTin,
    secondaryOneSsnOrTin,
    secondaryTwoSsnOrTin,
  } = formData;

  const checkIfPartyIsPresent = (comparator, data) => {
    return comparator(formData) ? data : undefined;
  };

  const presentPrimarySsn = checkIfPartyIsPresent(
    hasPrimaryCaregiver,
    primarySsnOrTin,
  );

  const presentSecondaryOneSsn = checkIfPartyIsPresent(
    hasSecondaryCaregiverOne,
    secondaryOneSsnOrTin,
  );

  const presentSecondaryTwoSsn = checkIfPartyIsPresent(
    hasSecondaryCaregiverTwo,
    secondaryTwoSsnOrTin,
  );

  const allSSNs = [
    veteranSsnOrTin,
    presentPrimarySsn,
    presentSecondaryOneSsn,
    presentSecondaryTwoSsn,
  ];

  const allValidSSNs = allSSNs.filter(ssn => ssn !== undefined);

  const checkIfArrayIsUnique = array => array.length === new Set(array).size;

  return checkIfArrayIsUnique(allValidSSNs);
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
  if (!formData['view:useFacilitiesAPI']) {
    return false;
  }

  const plannedClinic = formData['view:plannedClinic'];
  const hasPlannedClinic =
    plannedClinic &&
    typeof plannedClinic === 'object' &&
    Object.keys(plannedClinic).length > 0;

  if (!hasPlannedClinic) {
    return false;
  }

  return (
    plannedClinic?.veteranSelected?.id !== plannedClinic?.caregiverSupport?.id
  );
};
