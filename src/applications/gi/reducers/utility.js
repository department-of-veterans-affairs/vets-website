// This file was created to hold redundant or multi-use functions to be used elsewhere in the reducers

const normalizeAddresses = attributes => {
  return {
    name: attributes.name?.toUpperCase(),
    city: attributes.city?.toUpperCase(),
    state: attributes.state?.toUpperCase(),
    country: attributes.country?.toUpperCase(),
    zip: attributes.zip?.toUpperCase(),
    physicalCity: attributes.physicalCity?.toUpperCase(),
    physicalState: attributes.physicalState?.toUpperCase(),
    physicalCountry: attributes.physicalCountry?.toUpperCase(),
    physicalZip: attributes.physicalZip?.toUpperCase(),
  };
};
export const normalizedInstitutionAttributes = attributes => {
  return {
    ...attributes,
    ...normalizeAddresses(attributes),
  };
};

export const normalizedProgramAttributes = attributes => {
  return {
    ...attributes,
    description: attributes.description?.toUpperCase(),
    ...normalizeAddresses(attributes),
  };
};
