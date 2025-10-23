export function remapOtherVeteranFields(data = {}) {
  const updated = { ...data };

  if (data.otherVeteranFullName) {
    updated.veteranFullName = data.otherVeteranFullName;
  }

  if (data.otherVeteranSocialSecurityNumber) {
    updated.veteranSocialSecurityNumber = data.otherVeteranSocialSecurityNumber;
  }

  if (data.otherVaFileNumber) {
    updated.vaFileNumber = data.otherVaFileNumber;
  }

  return updated;
}
