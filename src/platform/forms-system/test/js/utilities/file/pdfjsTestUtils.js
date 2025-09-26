// Helper utilities to mock pdfjs for password validation tests
// Provides factory functions for success, incorrect password, and generic error scenarios.

export const createPdfjsSuccess = (destroySpy = () => {}) => ({
  getDocument: () => ({
    promise: Promise.resolve({
      getPage: () => Promise.resolve({}),
      destroy: destroySpy,
    }),
  }),
});

export const createPdfjsIncorrectPassword = () => ({
  getDocument: () => ({
    promise: Promise.reject(
      Object.assign(new Error('Invalid password'), {
        name: 'PasswordException',
      }),
    ),
  }),
});

export const createPdfjsGenericError = () => ({
  getDocument: () => ({
    promise: Promise.reject(new Error('Corrupted PDF')),
  }),
});
