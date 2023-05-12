// definitions with form-specific overrides
export default {
  pdfFullNameNoSuffix: {
    // has PDF-specific maxLengths
    type: 'object',
    additionalProperties: false,
    required: ['first', 'last'],
    properties: {
      first: {
        type: 'string',
        minLength: 1,
        maxLength: 12,
      },
      middle: {
        type: 'string',
        maxLength: 1,
      },
      last: {
        type: 'string',
        minLength: 1,
        maxLength: 18,
      },
    },
  },
};
