export const truncateMiddleName = name => {
  if (!name?.middle) return name;
  return {
    ...name,
    middle: name.middle.charAt(0),
  };
};
