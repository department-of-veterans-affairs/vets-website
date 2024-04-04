export const MAX_APPLICANTS = 3;

// TODO: pull this out of here (and 1010d) and elevate to the shared dir
export const applicantListSchema = (requireds, propertyList) => {
  return {
    type: 'object',
    properties: {
      applicants: {
        type: 'array',
        minItems: 1,
        maxItems: MAX_APPLICANTS,
        items: {
          type: 'object',
          required: requireds,
          properties: propertyList,
        },
      },
    },
  };
};
