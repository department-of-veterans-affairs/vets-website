// pdfFullNameNoSuffix.js
// a custom full-name definition with
// support for PDF-specific maxLengths
export const schema = (
  props = {
    pdfMaxLengths: {
      first: 12,
      middle: 1,
      last: 18,
    },
  },
) => {
  const { pdfMaxLengths } = props;

  return {
    type: 'object',
    additionalProperties: false,
    required: ['first', 'last'],
    properties: {
      first: {
        type: 'string',
        maxLength: pdfMaxLengths.first,
      },
      middle: {
        type: 'string',
        maxLength: pdfMaxLengths.middle,
      },
      last: {
        type: 'string',
        maxLength: pdfMaxLengths.last,
      },
    },
  };
};
