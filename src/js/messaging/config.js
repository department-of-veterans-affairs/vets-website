module.exports = {
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
      label: 'Medication',
      value: 'Medication Inquiry'
    },
    {
      label: 'Test results',
      value: 'Test Results Inquiry'
    },
    {
      label: 'Other (please fill in the subject line below)',
      value: 'Other'
    }
  ],
  composeMessageErrors: {
    category: 'Please select a category.',
    subject: 'Please add subject description.'
  }
};
