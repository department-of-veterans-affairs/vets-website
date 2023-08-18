// definitions with form-specific overrides
export default {
  pdfEmail: {
    type: 'string',
    maxLength: 40, // PDF-specific override
    format: 'email',
  },
  phone: {
    type: 'string',
    minLength: 10,
    pattern: '^\\d{3}-?\\d{3}-?\\d{4}$',
  },
};
