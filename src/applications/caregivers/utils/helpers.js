export const hasPrimaryCaregiver = formData => {
  return formData['view:hasPrimaryCaregiver'] === true;
};

export const hasSecondaryCaregiverOne = formData =>
  formData['view:hasSecondaryCaregiverOne'] === true;

export const hasSecondaryCaregiverTwo = formData =>
  formData['view:hasSecondaryCaregiverTwo'] === true;

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

/**
 * Helper that builds a full name string based on provided input values
 * @param {Object} name - the object that stores all the available input values
 * @param {Boolean} outputMiddle - optional param to declare whether to output
 * the middle name as part of the returned string
 * @returns {String} - the name string with all extra whitespace removed
 */
export const normalizeFullName = (name = {}, outputMiddle = false) => {
  const { first = '', middle = '', last = '', suffix = '' } = name;
  const nameToReturn = outputMiddle
    ? `${first} ${middle !== null ? middle : ''} ${last} ${suffix}`
    : `${first} ${last} ${suffix}`;
  return nameToReturn.replace(/ +(?= )/g, '').trim();
};

/**
 * Helper that replaces specified parts of a string with a dynamic value
 * @param {String} src - the original string to parse
 * @param {String} val - the value to input into the new string
 * @param {String} char - the value to be replaced in the original string
 * @returns {String} - the new string with all replaced values
 */
export const replaceStrValues = (src, val, char = '%s') => {
  return src && val ? src.toString().replace(char, val) : '';
};

// form config specific helpers
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
