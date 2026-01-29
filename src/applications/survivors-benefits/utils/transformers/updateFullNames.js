// Update names for Veteran, Claimant, Veteran Previous Names, dependents, dependent custodian, previous marriages.

const updateName = fullName => {
  let updatedName = fullName;
  if (fullName?.middle) {
    updatedName = {
      ...updatedName,
      middle: fullName.middle.charAt(),
    };
  }
  if (fullName?.suffix && fullName?.last) {
    updatedName = {
      ...updatedName,
      last: `${fullName.last} ${fullName.suffix}`,
    };
  }
  return updatedName;
};

export function updateFullNames(formData) {
  const parsedFormData = JSON.parse(formData);
  const transformedValue = { ...parsedFormData };
  // Veteran
  if (parsedFormData?.veteranFullName) {
    transformedValue.veteranFullName = updateName(
      parsedFormData.veteranFullName,
    );
  }
  // Claimant
  if (parsedFormData?.claimantFullName) {
    transformedValue.claimantFullName = updateName(
      parsedFormData.claimantFullName,
    );
  }
  // Custodian
  if (parsedFormData?.custodianFullName) {
    transformedValue.custodianFullName = updateName(
      parsedFormData.custodianFullName,
    );
  }
  // Veteran Previous Names
  if (parsedFormData?.veteranPreviousNames?.length) {
    transformedValue.veteranPreviousNames = parsedFormData.veteranPreviousNames.map(
      name => {
        if (name?.otherServiceName) {
          return {
            ...updateName(name.otherServiceName),
          };
        }
        return name;
      },
    );
  }
  // Dependents
  if (parsedFormData?.veteransChildren?.length) {
    transformedValue.veteransChildren = parsedFormData.veteransChildren.map(
      child => {
        if (child?.childFullName) {
          return {
            ...child,
            childFullName: updateName(child.childFullName),
          };
        }
        return child;
      },
    );
  }
  // Spouse previous Marriages
  if (parsedFormData?.spouseMarriages?.length) {
    transformedValue.spouseMarriages = parsedFormData.spouseMarriages.map(
      marriage => {
        if (marriage?.spouseFullName) {
          return {
            ...marriage,
            spouseFullName: updateName(marriage.spouseFullName),
          };
        }
        return marriage;
      },
    );
  }
  // Veteran previous marriages
  if (parsedFormData?.veteranMarriages?.length) {
    transformedValue.veteranMarriages = parsedFormData.veteranMarriages.map(
      marriage => {
        if (marriage?.spouseFullName) {
          return {
            ...marriage,
            spouseFullName: updateName(marriage.spouseFullName),
          };
        }
        return marriage;
      },
    );
  }
  return JSON.stringify(transformedValue);
}
