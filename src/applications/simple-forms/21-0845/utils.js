export const getFullNameString = fullName => {
  const { first, middle, last } = fullName;
  let fullNameString = `${first}`;

  if (middle) {
    fullNameString += ` ${middle}`;
  }

  return `${fullNameString} ${last}`;
};
