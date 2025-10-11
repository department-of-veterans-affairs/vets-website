/**
 * Error transformations for VA components
 */
export const ERROR_TRANSFORMATIONS = {
  'va-text-input': {
    normalizeError: error => {
      if (!error) return null;
      if (error === 'Invalid input' || error === 'Invalid') {
        return null;
      }
      if (typeof error !== 'string') return String(error);
      return error.trim() || null;
    },
    getErrorProps: (error, _touched, _forceShow) => ({
      error,
      'aria-invalid': error ? 'true' : 'false',
      noValidate: true,
    }),
  },

  'va-select': {
    normalizeError: error => {
      if (!error) return null;
      return typeof error === 'string' ? error.trim() || null : String(error);
    },
    getErrorProps: (error, _touched, _forceShow) => ({
      error,
      'aria-invalid': error ? 'true' : 'false',
    }),
  },

  'va-textarea': {
    normalizeError: error => {
      if (!error) return null;
      return typeof error === 'string' ? error.trim() || null : String(error);
    },
    getErrorProps: (error, _touched, _forceShow) => ({
      error,
      'aria-invalid': error ? 'true' : 'false',
    }),
  },

  'va-checkbox': {
    normalizeError: error => {
      if (!error) return null;
      return typeof error === 'string' ? error.trim() || null : String(error);
    },
    getErrorProps: (error, _touched, _forceShow) => ({
      error,
      'aria-invalid': error ? 'true' : 'false',
    }),
  },

  'va-checkbox-group': {
    normalizeError: error => {
      if (!error) return null;
      return typeof error === 'string' ? error.trim() || null : String(error);
    },
    getErrorProps: (error, _touched, _forceShow) => ({
      error,
      'aria-invalid': error ? 'true' : 'false',
    }),
  },

  'va-radio': {
    normalizeError: error => {
      if (!error) return null;
      return typeof error === 'string' ? error.trim() || null : String(error);
    },
    getErrorProps: (error, _touched, _forceShow) => ({
      error,
      'aria-invalid': error ? 'true' : 'false',
    }),
  },

  'va-date': {
    normalizeError: error => {
      if (!error) return null;
      return typeof error === 'string' ? error.trim() || null : String(error);
    },
    getErrorProps: (error, _touched, _forceShow) => ({
      error,
      'aria-invalid': error ? 'true' : 'false',
    }),
  },

  'va-memorable-date': {
    normalizeError: error => {
      if (!error) return null;
      if (error === 'Invalid input' || error === 'Invalid') {
        return null;
      }
      return typeof error === 'string' ? error.trim() || null : String(error);
    },
    getErrorProps: (error, _touched, _forceShow) => ({
      error,
      'aria-invalid': error ? 'true' : 'false',
    }),
  },

  'va-telephone-input': {
    normalizeError: error => {
      if (!error) return null;
      if (error === 'Invalid input' || error === 'Invalid') {
        return null;
      }
      if (typeof error !== 'string') return String(error);
      return error.trim() || null;
    },
    getErrorProps: (error, _touched, _forceShow) => ({
      error,
      'aria-invalid': error ? 'true' : 'false',
    }),
  },
};
