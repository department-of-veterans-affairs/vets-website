const getType = (clinic, options) => {
  if (!clinic) {
    return null;
  }
  const { titleCase } = options;
  const { type } = clinic;
  if (!type || !type.length) {
    return null;
  }

  const { coding } = type[0];
  if (!coding || !coding.length) {
    return null;
  }

  const { display } = coding[0];

  return titleCase
    ? display.charAt(0).toUpperCase() + display.slice(1).toLowerCase()
    : display;
};

export { getType };
