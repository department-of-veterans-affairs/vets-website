const all = {
  data: {
    type: 'schedulingPreferences',
    attributes: {
      preferences: [
        {
          itemId: 1, // preferredContactMethod
          optionIds: ['4'], // mailingAddress
          // optionIds: ['39'], // workPhone
        },
        {
          itemId: 4, // needsHelpSchedulingAppointments
          optionIds: ['29'], // yes
        },
        {
          itemId: 5, // needsHelpChoosingProvider
          optionIds: ['33'], // no
        },
        {
          itemId: 6, // preferredProviderGender
          optionIds: ['35'], // male
        },
      ],
    },
  },
};

const none = {
  data: {
    type: 'schedulingPreferences',
    attributes: {
      preferences: [],
    },
  },
};

module.exports = {
  all,
  none,
};
