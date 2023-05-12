// definitions with form-specific overrides
export default {
  pdfEmail: {
    type: 'string',
    maxLength: 40, // PDF-specific override
    format: 'email',
  },
  pdfFullNameNoSuffix: {
    // has PDF-specific maxLengths
    type: 'object',
    additionalProperties: false,
    required: ['first', 'last'],
    properties: {
      first: {
        type: 'string',
        minLength: 1,
        maxLength: 12, // PDF-specific override
      },
      middle: {
        type: 'string',
        maxLength: 1, // PDF-specific override
      },
      last: {
        type: 'string',
        minLength: 1,
        maxLength: 18, // PDF-specific override
      },
    },
  },
};
