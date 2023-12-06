export const getFullNameString = fullName => {
  if (fullName?.middle !== '' && fullName?.middle !== undefined) {
    return `${fullName.first} ${fullName.middle} ${fullName.last}`;
  }

  return `${fullName.first} ${fullName.last}`;
};
