module.exports = {
  // Base URL to be used in API requests.
  apiUrl: '/api/v0/messaging/health',
  paths: {
    INBOX_URL: '/messaging',
    COMPOSE_URL: '/messaging/compose',
    DRAFTS_URL: '/messaging/folder/-2'
  },
  // An array of objects containing the category name (label) and a
  // value for use with select, radio button inputs.
  messageCategories: [
    {
      label: 'Appointments',
      value: 'Appointment Inquiry'
    },
    {
      label: 'Education',
      value: 'Patient Education Materials'
    },
    {
      label: 'Medications',
      value: 'Medication Inquiry'
    },
    {
      label: 'Test results',
      value: 'Test Results Inquiry'
    },
    {
      label: 'Other (please add a subject)',
      value: 'Other'
    }
  ],
  composeMessagePlaceholders: {
    subject: 'Add an additional subject line',
    message: 'Type your message here'
  },
  composeMessageErrors: {
    category: 'Please select a category.',
    message: 'Please enter your message.',
    subject: 'Please add subject description.',
    recipient: 'Please select a recipient from your health care team.'
  },
  composeMessageMaxChars: 2000,
  allowedMimeTypes: ['text/plain',
    'application/pdf',
    'application/msword',
    'application/excel',
    'application/vnd.ms-excel',
    'image/gif',
    'image/jpg',
    'application/rtf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/png']
};
