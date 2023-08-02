// pdfFullNameNoSuffix.js
// a custom full-name definition with
// support for PDF-specific maxLengths
export const schema = ({ pdfMaxLengths } = {}) => {
  return {
    type: 'object',
    additionalProperties: false,
    required: ['first', 'last'],
    properties: {
      first: {
        type: 'string',
        maxLength: pdfMaxLengths?.first || 12,
      },
      middle: {
        type: 'string',
        maxLength: pdfMaxLengths?.middle || 18,
      },
      last: {
        type: 'string',
        maxLength: pdfMaxLengths?.last || 18,
      },
    },
  };
};
