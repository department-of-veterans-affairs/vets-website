module.exports = {
  // Basic pieces of data for making API requests.
  api: {
    url: '/api/v0/messaging/health',
    settings: {
      get: {
        method: 'GET',
        headers: {
          'X-Key-Inflection': 'camel'
        }
      },
      post: {
        method: 'POST',
        headers: {
          'X-Key-Inflection': 'camel',
          'Content-Type': 'application/json'
        }
      }
    }
  },

  paths: {
    INBOX_URL: '/messaging',
    COMPOSE_URL: '/messaging/compose',
    FOLDERS_URL: '/messaging/folder'
  },

  // The indices of systemFolders are positive. The
  // actual folder IDs are negative. Remember to invert
  // when needed.
  systemFolders: ['Inbox', 'Sent', 'Drafts', 'Deleted'],

  // An array of objects containing the category name (label) and a
  // value for use with select, radio button inputs.
  messageCategories: [
    {
      label: 'Appointments',
      value: 'APPOINTMENTS'
    },
    {
      label: 'Education',
      value: 'EDUCATION'
    },
    {
      label: 'Medications',
      value: 'MEDICATIONS'
    },
    {
      label: 'Test results',
      value: 'TEST_RESULTS'
    },
    {
      label: 'Other (please add a subject)',
      value: 'OTHER'
    }
  ],
  composeMessage: {
    placeholders: {
      subject: 'Add an additional subject line (optional)',
      message: 'Type your message here'
    },
    errors: {
      category: 'Please select a category.',
      message: 'Please enter your message.',
      subject: 'Please add subject description.',
      recipient: 'Please select a recipient from your health care team.'
    },
    maxChars: {
      message: 2000,
      subject: 512
    }
  },
  allowedMimeTypes: [
    'text/plain',
    'application/pdf',
    'application/msword',
    'application/excel',
    'application/vnd.ms-excel',
    'image/gif',
    'image/jpg',
    'application/rtf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/png'
  ],
  createNewFolderSettings: {
    maxLength: 50,
    errorMessages: {
      empty: 'Please enter a folder name.',
      exists: 'The folder name you have chosen already exists. Please try another name.',
      patternMismatch: 'Only the letters A through Z, numbers, and spaces are allowed in folder names.'
    }
  }
};
