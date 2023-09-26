// pdfFullNameNoSuffix.js
// a custom full-name, no-suffix definition with
// support for PDF-specific maxLengths
export const pdfFullNameNoSuffixSchema = (
  props = {
    pdfMaxLengths: {
      first: 12,
      middle: 1,
      last: 18,
    },
  },
) => {
  const { pdfMaxLengths } = props;

  if (!pdfMaxLengths.middle) {
    return {
      type: 'object',
      additionalProperties: false,
      required: ['first', 'last'],
      properties: {
        first: {
          type: 'string',
          minLength: 1,
          maxLength: pdfMaxLengths?.first || 30,
        },
        middle: {
          type: 'string',
        },
        last: {
          type: 'string',
          minLength: 1,
          maxLength: pdfMaxLengths?.last || 30,
        },
      },
    };
  }

  return {
    type: 'object',
    additionalProperties: false,
    required: ['first', 'last'],
    properties: {
      first: {
        type: 'string',
        minLength: 1,
        maxLength: pdfMaxLengths?.first || 30,
      },
      middle: {
        type: 'string',
        maxLength: pdfMaxLengths.middle,
      },
      last: {
        type: 'string',
        minLength: 1,
        maxLength: pdfMaxLengths?.last || 30,
      },
    },
  };
};
