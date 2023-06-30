// definitions with form-specific overrides
export default {
  pdfEmail: {
    type: 'string',
    maxLength: 40, // PDF-specific override
    format: 'email',
  },
};
