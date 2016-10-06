const headers = {
  'X-Key-Inflection': 'camel'
};

module.exports = {
  // Basic config for making API requests.
  api: {
    url: '/api/v0/messaging/health',
    settings: {
      get: {
        method: 'GET',
        headers
      },
      post: {
        method: 'POST',
        headers: Object.assign({}, headers, {
          'Content-Type': 'application/json'
        })
      },
      put: {
        method: 'PUT',
        headers: Object.assign({}, headers, {
          'Content-Type': 'application/json'
        })
      },
      'delete': {
        method: 'DELETE',
        headers
      },
      patch: {
        method: 'PATCH',
        headers
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
      subject: 'Add an additional subject line',
      message: 'Type your message here'
    },
    errors: {
      attachments: {
        tooLarge: {
          title: 'Attachment size limit',
          text: 'The file(s) you are trying to attach exceed the 3MB attachment size limit and the total size of attachments cannot exceed 6MB'
        },
        tooMany: {
          title: 'Attachments limit',
          text: 'You may not attach more than four files.'
        }
      },
      category: 'Please select a category.',
      message: 'Please enter your message.',
      subject: 'Please add subject description.',
      recipient: 'Please select a recipient from your health care team.'
    },
    maxChars: {
      message: 2000,
      subject: 512
    },
    // Using bytes
    attachments: {
      maxNum: 4,
      maxSingleFile: 3000000,
      maxTotalFiles: 6000000
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
