import assign from 'lodash/fp/assign';

import environment from '../common/helpers/environment';

function getHeaders(optionalHeaders = {}) {
  const defaultHeaders = {
    'X-Key-Inflection': 'camel'
  };

  if (typeof sessionStorage !== 'undefined' && sessionStorage !== null) {
    defaultHeaders.Authorization = `Token token=${sessionStorage.userToken}`;
  }

  return assign(defaultHeaders, optionalHeaders);
}

function getApiUrl() {
  let url;

  if (environment) {
    url = environment.API_URL;
  }

  return url;
}

module.exports = {
  // Basic config for making API requests.
  api: {
    url: `${getApiUrl()}/v0/messaging/health`,
    settings: {
      get: {
        method: 'GET',
        headers: getHeaders()
      },
      postJson: {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' })
      },
     // For sending binary data requests. Assumes use of FormData API.
      postFormData: {
        method: 'POST',
        headers: getHeaders()
      },
      put: {
        method: 'PUT',
        headers: getHeaders({ 'Content-Type': 'application/json' })
      },
      'delete': {
        method: 'DELETE',
        headers: getHeaders()
      },
      patch: {
        method: 'PATCH',
        headers: getHeaders()
      }
    }
  },

  paths: {
    INBOX_URL: '/',
    COMPOSE_URL: '/compose',
    FOLDERS_URL: '/folder',
    THREADS_URL: '/thread'
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
      subjectLine: {
        category: 'Please select a category.',
        subject: 'Please add subject description.'
      },
      message: 'Please enter your message.',
      recipient: 'Please select a recipient from your health care team.'
    },
    maxChars: {
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
