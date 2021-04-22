// This file was created to hold redundant or multi-use functions to be used elsewhere in the reducers

export const normalizedInstitutionAttributes = attributes => {
  const name = attributes.name
    ? attributes.name.toUpperCase()
    : attributes.name;
  return {
    ...attributes,
    name,
  };
};

export const normalizedProgramAttributes = attributes => {
  const description =
    attributes.description && attributes.description.toUpperCase();
  return {
    ...attributes,
    description,
  };
};
