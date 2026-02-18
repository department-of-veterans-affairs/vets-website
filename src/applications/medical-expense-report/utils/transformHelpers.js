export const updateName = fullName => {
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
